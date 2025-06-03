import cloud from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const db = cloud.mongo.db
  
  try {
    // 获取包含笔记数组的文档
    const doc = await db.collection('notes').findOne({ 
      _id: "683efc96ba992f80deb3f94b" 
    })

    return {
      code: 0,
      data: doc?.notes || [],
      msg: '获取笔记列表成功'
    }
  } catch (error) {
    console.error('获取笔记列表失败:', error)
    return {
      code: 1,
      error: error.message,
      msg: '获取笔记列表失败'
    }
  }
} 