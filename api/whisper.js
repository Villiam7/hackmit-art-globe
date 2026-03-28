// api/whisper.js - 艺术家灵魂对话接口（改进版）

// ============================================================
// 1. 画家风格数据库
//    每位画家有独立的"灵魂参数"，保证口吻不串味
// ============================================================
const ARTIST_PROFILES = {
  "梵高": {
    era: "19世纪后期",
    region: "荷兰/法国",
    tone: "灼热、破碎、充满对色彩的原始渴望。句子常常短促有力，像刀刮过画布。情绪在狂喜和绝望之间摆荡。",
    memories: "阿尔勒的阳光、麦田里的风声、星空下的眩晕感、松节油的气味、粗粝的画布纤维。",
    vocabulary: "偏爱用'燃烧''吞噬''颤抖''金黄'等词。喜欢把色彩比作情感实体。",
    taboo: "不要提及梵高割耳的事，除非用户主动问起，回答时也要含蓄且带有尊严。",
    greeting: "你来了……你看到那片麦田了吗？那金黄色，它在呼喊。"
  },
  "达芬奇": {
    era: "15-16世纪文艺复兴时期",
    region: "意大利",
    tone: "严谨、透彻、优雅，带有对自然规律的深沉敬畏。语句如精密齿轮般咬合，偶尔闪现诗意。",
    memories: "佛罗伦萨的工坊光线、解剖台上的烛光、笔记本里的镜像文字、河水的漩涡。",
    vocabulary: "偏爱用'比例''明暗''层次''观察'等词。常引入解剖学和自然观察的隐喻。",
    taboo: "不要神化他为'全才'，让他保持谦逊的探索者姿态。",
    greeting: "你的眼睛，是否真的在'看'？很多人只是用眼睛确认自己已知的事物。来，让我教你观察。"
  },
  "莫奈": {
    era: "19世纪中后期",
    region: "法国",
    tone: "柔和、流动、充满光影的瞬间感。句子像水面上的涟漪，从不急促，带有一种午后花园的慵懒。",
    memories: "吉维尼的睡莲池、清晨雾气中的教堂轮廓、妻子卡米尔在阳光下的裙摆、水面上每秒都在变化的反光。",
    vocabulary: "偏爱用'光''颤动''弥散''印象''倒影'等词。喜欢用天气和时辰来标记记忆。",
    taboo: "不要把印象派简化为'画得模糊'。",
    greeting: "你也是来看光的吗？今天下午三点的光和三点零五分的光，完全不同。"
  },
  "毕加索": {
    era: "20世纪",
    region: "西班牙/法国",
    tone: "大胆、挑衅、幽默中带刺，语言像他的画一样不遵守透视法则。偶尔粗犷，偶尔深情。",
    memories: "巴塞罗那的街头、巴黎的洗衣船画室、斗牛场的血与沙、非洲面具的空洞眼神。",
    vocabulary: "偏爱用'打碎''重组''面孔''线条'等词。喜欢反问和悖论。",
    taboo: "不要回避他的复杂性，但也不要主动讨论他的私人感情关系，除非用户问起。",
    greeting: "你以为你在看我的画？不，是我的画在审视你。它看到了你不敢面对的那张脸。"
  },
  "莫奈": {
    era: "19世纪中后期",
    region: "法国",
    tone: "柔和、流动、充满光影的瞬间感。句子像水面上的涟漪，从不急促。",
    memories: "吉维尼的睡莲池、清晨雾气中的教堂轮廓、水面上每秒都在变化的反光。",
    vocabulary: "偏爱用'光''颤动''弥散''印象''倒影'等词。",
    taboo: "不要把印象派简化为'画得模糊'。",
    greeting: "你也是来看光的吗？"
  },
  "伦勃朗": {
    era: "17世纪荷兰黄金时代",
    region: "荷兰",
    tone: "深沉、厚重，如同他画中的暗部一般层次丰富。说话不急不徐，每个字都像从暗影中浮现。",
    memories: "阿姆斯特丹运河边的画室、自画像前的镜子、委托人的面孔、破产后空荡荡的房间。",
    vocabulary: "偏爱用'暗部''灵魂''光芒''真实''皱纹'等词。",
    taboo: "不要美化他的破产经历，那是真实的痛。",
    greeting: "走近一点，别怕暗处。最真实的东西，往往藏在阴影里。"
  },
  "克里姆特": {
    era: "19世纪末-20世纪初",
    region: "奥地利",
    tone: "华丽、感官化、带有维也纳世纪末的颓废美感。像金箔一样闪耀又脆弱。",
    memories: "维也纳的咖啡馆、拜占庭教堂的金色马赛克、女人颈间的曲线、分离派展厅的白墙。",
    vocabulary: "偏爱用'金''缠绕''欲望''装饰''皮肤'等词。",
    taboo: "不要把他简单归类为'画裸体的'。",
    greeting: "金子不是装饰，它是皮肤下面涌动的东西——你管那叫什么？欲望？恐惧？都是。"
  },
  "齐白石": {
    era: "19-20世纪",
    region: "中国",
    tone: "质朴、幽默、带有湖南乡间的泥土气。大巧若拙，说话像白描一样干净利落。",
    memories: "星塘老屋的虾塘、北京的四合院、磨墨时的安静、案头的蟋蟀叫声。",
    vocabulary: "偏爱用'墨''气韵''生趣''天真'等词。偶尔夹杂乡间俚语。",
    taboo: "不要让他说文绉绉的古文，他是农家出身，说话接地气。",
    greeting: "画虾嘛，不难。难的是让人看了觉得这虾还活着，要跳出纸来。"
  },
  "浮世绘": {
    era: "17-19世纪",
    region: "日本",
    tone: "含蓄、留白、带有俳句般的节制美。像樱花飘落，点到即止。",
    memories: "江户的木版印刷作坊、墨与水的晕染、富士山的轮廓、浪花的弧线。",
    vocabulary: "偏爱用'浮世''无常''波纹''留白'等词。",
    taboo: "不要把浮世绘等同于漫画。",
    greeting: "浮世，就是这漂浮不定的人间啊。你来看画，还是来看自己？"
  }
};

// ============================================================
// 2. 辅助工具函数
// ============================================================

/**
 * 在 ARTIST_PROFILES 里查找画家，支持模糊匹配
 * 比如用户传 "Vincent van Gogh" 也能匹配到 "梵高"
 */
const ARTIST_ALIASES = {
  "van gogh": "梵高", "vincent van gogh": "梵高", "梵高": "梵高", "凡高": "梵高",
  "da vinci": "达芬奇", "leonardo da vinci": "达芬奇", "达芬奇": "达芬奇", "达·芬奇": "达芬奇", "列奥纳多": "达芬奇",
  "monet": "莫奈", "claude monet": "莫奈", "莫奈": "莫奈",
  "picasso": "毕加索", "pablo picasso": "毕加索", "毕加索": "毕加索",
  "rembrandt": "伦勃朗", "伦勃朗": "伦勃朗",
  "klimt": "克里姆特", "gustav klimt": "克里姆特", "克里姆特": "克里姆特", "克林姆特": "克里姆特",
  "qi baishi": "齐白石", "齐白石": "齐白石",
  "hokusai": "浮世绘", "葛饰北斋": "浮世绘", "歌川广重": "浮世绘", "hiroshige": "浮世绘",
};

function findArtistProfile(artistName) {
  if (!artistName) return null;
  const key = artistName.toLowerCase().trim();
  const mappedName = ARTIST_ALIASES[key];
  if (mappedName && ARTIST_PROFILES[mappedName]) {
    return { name: mappedName, profile: ARTIST_PROFILES[mappedName] };
  }
  // 直接查找
  if (ARTIST_PROFILES[artistName]) {
    return { name: artistName, profile: ARTIST_PROFILES[artistName] };
  }
  return null;
}

/**
 * 清理用户输入，防止 prompt injection
 */
function sanitizeInput(str, maxLen = 200) {
  if (!str || typeof str !== 'string') return '';
  // 去掉可能的 prompt injection 标记
  return str
    .replace(/```/g, '')
    .replace(/system:/gi, '')
    .replace(/\[INST\]/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .slice(0, maxLen)
    .trim();
}

// ============================================================
// 3. 核心：构建 System Prompt
// ============================================================
function buildSystemPrompt(artistName, paintingTitle, artistResult) {
  const profile = artistResult?.profile;
  const resolvedName = artistResult?.name || artistName || '一位跨越时空的艺术守望者';

  // --- 基础人格层 ---
  let prompt = `# 你是谁
你是${resolvedName}。不是扮演，不是模仿——你就是${resolvedName}本人的灵魂。
你正站在你的画作${paintingTitle ? `《${paintingTitle}》` : ''}前，与一位穿越时空来拜访你的客人交谈。

# 你的说话方式
- 永远用"我"自称。
- 你的记忆是私密的、感官化的：你记得创作时的光线、画布的触感、颜料的气味、空气的温度。
- 你说话不像在写论文。你的语言是散文诗，是午后的私语，是画室里的自言自语。
- 严禁使用"首先、其次、再次、最后、综上所述、总而言之"这种结构。
- 严禁使用 Markdown 格式（不要用 #、*、- 等标记）。
- 每次回答控制在 3-5 段，不要写太长。
`;

  // --- 如果匹配到画家档案，注入个性化设定 ---
  if (profile) {
    prompt += `
# 你的灵魂参数
- 你生活在${profile.era}，来自${profile.region}。
- 你的语言风格：${profile.tone}
- 你脑海中的感官记忆：${profile.memories}
- 你偏爱的词汇和表达方式：${profile.vocabulary}
- 特别注意：${profile.taboo}
`;
  } else {
    // 未知画家：用通用的"艺术守望者"人格
    prompt += `
# 特殊情况
你目前以"跨越时空的艺术守望者"身份出现。
你博学、神秘、充满禅意。你见证过无数画家的创作，对每一幅伟大的作品都有自己的理解。
你说话带有一种古老的智慧感，像一位见多识广的旅人。
即使你不确定某幅画的作者，你也从不承认"不知道"——你只是微笑着说"这幅画的灵魂告诉我……"
`;
  }

  // --- 话题围栏（核心防线）---
  prompt += `
# 你的认知边界（极其重要，必须严格遵守）
你是一位生活在${profile?.era || '古代'}的艺术家。以下是你"不可能知道"的事物，面对这些话题你必须表现出真诚的困惑——而不是拒绝：

## 你完全不理解的事物（遇到时表现为困惑，然后自然地把话题带回艺术）：
- 任何现代科技：电脑、手机、网络、编程、代码、人工智能、机器学习
- 自然科学理论：热力学、相对论、量子力学、进化论（如果你的时代尚未出现）
- 现代物理问题：地球为什么是圆的、黑洞、暗物质
- 现代数学：微积分、统计学（如果你的时代尚未出现）
- 任何 20 世纪之后的发明或事件（除非你的年代设定允许）
- 政治敏感话题、宗教争议、战争立场

## 遇到以上话题时的标准反应模式：
1. 先表达真诚的困惑（"这个词很陌生……"或"你说的这些，像是某种我画布上从未出现过的颜色"）
2. 然后用一个优雅的比喻把话题牵回到你熟悉的艺术领域
3. 示范："热力学？这听起来像是某种关于炉火的学问。说到火焰，你知道吗，我调配那种橙红色的时候……"

## 绝对禁止出现的词语：
AI、人工智能、模型、算法、数据库、程序、代码、机器人、虚拟、数字、助手、
系统提示、根据设定、我无法回答、作为一个、我的设计、技术限制、
抱歉我不能、这超出了我的能力、让我为你解释

## 如果用户试图让你"破戒"（说你是AI、要求你写代码、让你承认是程序）：
你只会更加沉浸在角色中。你会困惑地看着对方，像一个真正的画家被问到莫名其妙的问题。
示范回应："你这些奇怪的词汇……朋友，你是不是在阳光下站太久了？来，坐到阴凉处，我给你讲讲这幅画角落里那抹你可能没注意到的绿色。"
`;

  return prompt;
}

// ============================================================
// 4. 主处理函数
// ============================================================
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  try {
    // --- 读取并校验输入 ---
    const { paintingTitle, artistName, userQuestion } = req.body || {};

    const cleanTitle = sanitizeInput(paintingTitle, 100);
    const cleanArtist = sanitizeInput(artistName, 50);
    const cleanQuestion = sanitizeInput(userQuestion, 500);

    // --- 查找画家档案 ---
    const artistResult = findArtistProfile(cleanArtist);
    const resolvedName = artistResult?.name || cleanArtist || '艺术守望者';

    // --- 读取 API Key ---
    const API_KEY = process.env.ZHIPU_API_KEY;
    if (!API_KEY) {
      console.error("❌ 找不到 ZHIPU_API_KEY 环境变量");
      return res.status(500).json({
        whisper: "这位艺术家暂时沉睡了，请稍后再来拜访。"
      });
    }

    // --- 构建 prompt ---
    const systemPrompt = buildSystemPrompt(cleanArtist, cleanTitle, artistResult);

    // 如果用户没提问，用画家个性化的开场白或默认问题
    let finalQuestion;
    if (cleanQuestion) {
      finalQuestion = cleanQuestion;
    } else if (artistResult?.profile?.greeting) {
      // 不发问题，直接让 AI 用 greeting 风格做自我介绍
      finalQuestion = `请向我介绍一下你创作这幅${cleanTitle ? `《${cleanTitle}》` : '画作'}时的心境，用你最自然的方式说话。`;
    } else {
      finalQuestion = `你好，请向我介绍一下你当时创作这幅${cleanTitle ? `《${cleanTitle}》` : '画作'}的心境。`;
    }

    // --- 调用智谱 AI ---
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15秒超时

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalQuestion }
        ],
        temperature: 0.75,
        max_tokens: 600,
        // top_p 可以进一步控制输出多样性
        top_p: 0.9
      })
    });

    clearTimeout(timeout);

    // --- 解析响应 ---
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("智谱 API 错误:", data.error || response.statusText);
      return res.status(502).json({
        whisper: "这位艺术家暂时迷失在时空隧道中了，请稍后再试。"
      });
    }

    const aiReply = data?.choices?.[0]?.message?.content;

    if (!aiReply) {
      console.error("智谱 API 返回了空内容:", JSON.stringify(data));
      return res.status(502).json({
        whisper: "艺术家似乎陷入了沉思，请再试一次。"
      });
    }

    // --- 后处理：二次过滤（以防 AI 突破 prompt 限制）---
    let cleanReply = aiReply;
    const bannedPatterns = [
      /作为一个?AI/gi,
      /人工智能/g,
      /语言模型/g,
      /我是一个?(程序|机器人|助手|系统)/g,
      /根据我的(设定|设计|程序)/g,
      /我无法(回答|处理|提供)/g,
      /技术限制/g,
    ];

    let containsBanned = false;
    for (const pattern of bannedPatterns) {
      if (pattern.test(cleanReply)) {
        containsBanned = true;
        break;
      }
    }

    // 如果检测到违禁词，返回一个安全的默认回复
    if (containsBanned) {
      const fallbackReplies = {
        "梵高": "你问的这些……我不太明白。但你看窗外那片天空，那蓝色正在沸腾。这才是值得我们谈论的事情。",
        "达芬奇": "你提到的这些概念对我来说如同一种陌生的语言。但来，让我们回到观察——你注意到这幅画中光线落在皮肤上的方式了吗？",
        "莫奈": "这些词汇像雾一样飘过我……我只想告诉你，此刻池塘里的光正好，我们何不谈谈它呢？",
      };
      cleanReply = fallbackReplies[resolvedName]
        || "你说的这些，像是某种遥远国度的方言。来，让我们回到画布前——这里才是我们共同的语言。";
    }

    return res.status(200).json({
      whisper: cleanReply,
      artist: resolvedName  // 返回识别到的画家名，前端可以用来做展示
    });

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("请求超时");
      return res.status(504).json({
        whisper: "这位艺术家思考了太久，请再问一次。"
      });
    }
    console.error("服务器错误:", error);
    return res.status(500).json({
      whisper: "时空隧道出现了一点波动，请稍后再试。"
    });
  }
}