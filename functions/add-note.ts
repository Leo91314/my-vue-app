import cloud from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const db = cloud.mongo.db
  const { title, content } = ctx.body

  // 参数验证
  if (!title || !content) {
    return {
      code: 1,
      msg: '标题和内容不能为空'
    }
  }

  try {
    // 创建新笔记
    const note = {
      id: Date.now(),  // 使用时间戳作为id
      title,
      content,
      createdAt: new Date().toLocaleString()
    }

    // 更新文档，将新笔记添加到数组开头
    const result = await db.collection('notes').updateOne(
      { _id: "683efc96ba992f80deb3f94b" },
      { $push: { notes: { $each: [note], $position: 0 } } }
    )

    if (result.modifiedCount === 0) {
      return {
        code: 1,
        msg: '添加笔记失败'
      }
    }

    return {
      code: 0,
      data: note,
      msg: '添加笔记成功'
    }
  } catch (error) {
    console.error('添加笔记失败:', error)
    return {
      code: 1,
      error: error.message,
      msg: '添加笔记失败'
    }
  }
} 