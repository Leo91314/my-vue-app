<template>
  <div class="note-app">
    <h1>我的记事本</h1>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 添加笔记表单 -->
    <div class="add-note">
      <input 
        v-model="newNote.title" 
        placeholder="标题" 
        class="input-title"
        :disabled="loading"
      >
      <textarea 
        v-model="newNote.content" 
        placeholder="输入笔记内容..." 
        class="input-content"
        :disabled="loading"
      ></textarea>
      <button @click="addNote" :disabled="!isValidNote || loading">
        {{ loading ? '处理中...' : '添加笔记' }}
      </button>
    </div>

    <!-- 笔记列表 -->
    <div class="notes-list">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <div v-else-if="notes.length === 0" class="no-notes">
        <p>暂无笔记</p>
        <button @click="initNotes" :disabled="loading" class="init-button">
          {{ loading ? '初始化中...' : '初始化示例笔记' }}
        </button>
      </div>
      <div v-else v-for="note in notes" :key="note.id" class="note-item">
        <div v-if="editingId === note.id">
          <input 
            v-model="editingNote.title" 
            class="input-title"
          >
          <textarea 
            v-model="editingNote.content" 
            class="input-content"
          ></textarea>
          <div class="note-actions">
            <button @click="saveEdit(note.id)">保存</button>
            <button @click="cancelEdit">取消</button>
          </div>
        </div>
        <div v-else>
          <h3>{{ note.title }}</h3>
          <p class="note-content">{{ note.content }}</p>
          <p class="note-date">
            创建时间: {{ note.createdAt }}
            <span v-if="note.updatedAt">
              (更新于: {{ note.updatedAt }})
            </span>
          </p>
          <div class="note-actions">
            <button @click="startEdit(note)">编辑</button>
            <button @click="deleteNote(note.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NoteApp',
  
  data() {
    return {
      notes: [],  // 数据库中的笔记列表
      newNote: { title: '', content: '' },
      editingId: null,
      editingNote: { title: '', content: '' },
      loading: false,  // 添加加载状态
      error: null     // 添加错误状态
    }
  },

  computed: {
    isValidNote() {
      return this.newNote.title.trim() && this.newNote.content.trim()
    }
  },

  async mounted() {
    await this.fetchNotes()
  },

  methods: {
    // 获取所有笔记
    async fetchNotes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('https://dwyzzwsy1j.cloud.sealos.io/get_note')
        console.log('获取笔记响应:', response.data)
        
        if (response.data.code === 0) {
          this.notes = response.data.data || []
        } else {
          this.error = response.data.msg
          console.error('获取笔记失败:', response.data.msg)
        }
      } catch (error) {
        this.error = '获取笔记失败，请稍后重试'
        console.error('获取笔记失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加笔记
    async addNote() {
      if (!this.isValidNote) return
      
      this.loading = true
      this.error = null
      
      const note = {
        title: this.newNote.title.trim(),
        content: this.newNote.content.trim()
      }
      
      try {
        console.log('准备添加的笔记:', note)
        const response = await axios.post('https://dwyzzwsy1j.cloud.sealos.io/add_note', note)
        console.log('添加笔记响应:', response.data)
        
        if (response.data.code === 0) {
          await this.fetchNotes()
          this.newNote = { title: '', content: '' }
        } else {
          this.error = response.data.msg
          console.error('添加笔记失败:', response.data.msg)
        }
      } catch (error) {
        this.error = '添加笔记失败，请稍后重试'
        console.error('添加笔记失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 删除笔记
    async deleteNote(id) {
      this.loading = true
      this.error = null
      
      try {
        console.log('准备删除笔记，ID:', id)
        // 确保 id 是数字类型
        const numericId = parseInt(id)
        // 直接发送 id
        const response = await axios.post('https://dwyzzwsy1j.cloud.sealos.io/del_note', {
          id: numericId
        })
        console.log('删除笔记响应:', response.data)
        
        if (response.data.code === 0) {
          console.log('删除成功，重新获取笔记列表')
          await this.fetchNotes()
        } else {
          this.error = response.data.msg || '删除笔记失败'
          console.error('删除笔记失败:', response.data.msg)
        }
      } catch (error) {
        this.error = error.response?.data?.msg || '删除笔记失败，请稍后重试'
        console.error('删除笔记失败:', error.response?.data || error.message)
      } finally {
        this.loading = false
      }
    },

    // 开始编辑
    startEdit(note) {
      this.editingId = note.id
      this.editingNote = { ...note }
    },

    // 保存编辑
    async saveEdit(id) {
      this.loading = true
      this.error = null
      
      try {
        const updateData = {
          title: this.editingNote.title.trim(),
          content: this.editingNote.content.trim()
        }
        
        console.log('准备更新的数据:', updateData)
        const response = await axios.put(`https://dwyzzwsy1j.cloud.sealos.io/update_note/${id}`, updateData)
        console.log('更新笔记响应:', response.data)
        
        if (response.data.code === 0) {
          await this.fetchNotes()
          this.editingId = null
        } else {
          this.error = response.data.msg
          console.error('更新笔记失败:', response.data.msg)
        }
      } catch (error) {
        this.error = '更新笔记失败，请稍后重试'
        console.error('更新笔记失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 取消编辑
    cancelEdit() {
      this.editingId = null
      this.editingNote = { title: '', content: '' }
    },

    // 初始化笔记
    async initNotes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('https://dwyzzwsy1j.cloud.sealos.io/init_note')
        console.log('初始化笔记响应:', response.data)
        
        if (response.data.code === 0) {
          await this.fetchNotes()
        } else {
          this.error = response.data.msg
          console.error('初始化笔记失败:', response.data.msg)
        }
      } catch (error) {
        this.error = '初始化笔记失败，请稍后重试'
        console.error('初始化笔记失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.note-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.add-note {
  margin-bottom: 30px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.input-title {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-content {
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.note-item {
  background: white;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.note-actions {
  margin-top: 10px;
}

.note-actions button:last-child {
  background-color: #f44336;
}

.note-actions button:last-child:hover {
  background-color: #da190b;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

p {
  margin: 0;
  color: #666;
}

.no-notes {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.note-content {
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.note-date {
  font-size: 0.8em;
  color: #999;
  margin-bottom: 10px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.init-button {
  background-color: #2196F3;
  margin-top: 10px;
}

.init-button:hover:not(:disabled) {
  background-color: #1976D2;
}
</style> 