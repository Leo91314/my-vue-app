const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/noteapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 笔记模型
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toLocaleString() }
});

const Note = mongoose.model('Note', noteSchema);

// API路由
// 获取所有笔记
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 添加新笔记
app.post('/notes', async (req, res) => {
    try {
        const note = new Note({
            title: req.body.title,
            content: req.body.content
        });
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 更新笔记
app.put('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note) {
            note.title = req.body.title;
            note.content = req.body.content;
            const updatedNote = await note.save();
            res.json(updatedNote);
        } else {
            res.status(404).json({ message: '笔记未找到' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 删除笔记
app.delete('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note) {
            await note.deleteOne();
            res.json({ message: '笔记已删除' });
        } else {
            res.status(404).json({ message: '笔记未找到' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 初始化数据
async function initializeData() {
    try {
        const count = await Note.countDocuments();
        if (count === 0) {
            await Note.insertMany([
                {
                    title: "吃饭",
                    content: "今天要记得按时吃三餐，不要太晚吃饭，对胃不好。",
                    createdAt: "2024-06-03 20:30:00"
                },
                {
                    title: "睡觉",
                    content: "保持规律作息，晚上11点前睡觉，保证8小时充足睡眠。",
                    createdAt: "2024-06-03 20:31:00"
                },
                {
                    title: "打游戏",
                    content: "周末和朋友一起打游戏，但要注意适度，每次不要超过2小时。",
                    createdAt: "2024-06-03 20:32:00"
                }
            ]);
            console.log('初始数据已添加');
        }
    } catch (error) {
        console.error('初始化数据失败:', error);
    }
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log('服务器运行在端口 ' + PORT);
    await initializeData();
}); 