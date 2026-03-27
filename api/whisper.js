// api/whisper.js - 临时顶替的假 AI 接口 (Mock API)

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paintingTitle, artistName } = request.body;

  // 1. 模拟真实 AI 的思考延迟（停顿 1.5 秒）
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 2. 伪造一段超级逼真的治愈系回复
  const fakeWhisper = `你好，探索者。当你凝视《${paintingTitle}》时，我希望你能感受到我当时的呼吸。在画下这幅画的那个夜晚，世界很安静，所有的色彩都在向我倾诉。放慢脚步，用心去听它的声音吧。 —— ${artistName}`;

  // 3. 返回给前端
  return response.status(200).json({ whisper: fakeWhisper });
}