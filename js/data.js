/**
 * 旅游攻略 - 数据层
 * 提供模拟数据，实际项目中可替换为 API 调用
 */

// 目的地数据
const destinations = [
  {
    id: 1,
    name: '云南大理',
    region: '国内',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dali+ancient+town+with+Erhai+Lake+and+Cangshan+Mountain+beautiful+landscape+sunny+day+travel+photography&image_size=landscape_4_3',
    rating: 4.8,
    tags: ['古城', '洱海', '苍山', '白族风情'],
    description: '大理古城位于云南省大理白族自治州，是中国历史文化名城之一，以苍山洱海的自然风光和浓郁的白族风情闻名于世。',
    bestSeason: '3-5月，9-11月',
    duration: '3-5天',
    budget: '2000-4000元'
  },
  {
    id: 2,
    name: '日本京都',
    region: '国际',
    category: '人文历史',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kyoto+Japan+traditional+temple+with+cherry+blossoms+and+wooden+architecture+beautiful+spring+day&image_size=landscape_4_3',
    rating: 4.9,
    tags: ['寺庙', '樱花', '和服', '抹茶'],
    description: '京都是日本千年古都，保存了大量的寺庙、神社和传统建筑，是体验日本传统文化的最佳目的地。',
    bestSeason: '3-4月（樱花季），11月（红叶季）',
    duration: '4-7天',
    budget: '8000-15000元'
  },
  {
    id: 3,
    name: '泰国清迈',
    region: '国际',
    category: '休闲度假',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chiang+Mai+Thailand+beautiful+temple+with+elephants+and+tropical+scenery+sunny+day+travel&image_size=landscape_4_3',
    rating: 4.6,
    tags: ['寺庙', '夜市', '丛林飞跃', '泰式按摩'],
    description: '清迈是泰国北部的文化中心，以古老的寺庙、热闹的夜市和丰富的户外活动吸引着全球游客。',
    bestSeason: '11月-次年2月',
    duration: '4-6天',
    budget: '3000-6000元'
  },
  {
    id: 4,
    name: '四川成都',
    region: '国内',
    category: '美食之旅',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu+Sichuan+China+with+panda+and+hotpot+and+traditional+teahouse+urban+travel+photography&image_size=landscape_4_3',
    rating: 4.7,
    tags: ['大熊猫', '火锅', '茶馆', '宽窄巷子'],
    description: '成都是一座来了就不想走的城市，这里有可爱的大熊猫、麻辣鲜香的美食和悠闲的慢生活。',
    bestSeason: '3-6月，9-11月',
    duration: '3-4天',
    budget: '1500-3500元'
  },
  {
    id: 5,
    name: '意大利罗马',
    region: '国际',
    category: '人文历史',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Rome+Italy+Colosseum+and+ancient+ruins+with+beautiful+sky+historic+architecture+travel&image_size=landscape_4_3',
    rating: 4.8,
    tags: ['古罗马', '斗兽场', '博物馆', '意面'],
    description: '罗马是永恒之城，拥有两千多年的历史遗迹，每一块石头都诉说着帝国的辉煌。',
    bestSeason: '4-6月，9-10月',
    duration: '5-7天',
    budget: '12000-20000元'
  },
  {
    id: 6,
    name: '海南三亚',
    region: '国内',
    category: '海岛度假',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya+Hainan+China+tropical+beach+with+palm+trees+and+blue+ocean+sunny+paradise+travel&image_size=landscape_4_3',
    rating: 4.5,
    tags: ['海滩', '潜水', '海鲜', '免税店'],
    description: '三亚是中国最南端的热带滨海旅游城市，拥有碧海蓝天和细腻的沙滩，是冬季避寒胜地。',
    bestSeason: '10月-次年4月',
    duration: '3-5天',
    budget: '2000-5000元'
  },
  {
    id: 7,
    name: '法国巴黎',
    region: '国际',
    category: '浪漫都市',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Paris+France+Eiffel+Tower+with+Seine+River+and+beautiful+cityscape+romantic+travel+photography&image_size=landscape_4_3',
    rating: 4.9,
    tags: ['埃菲尔铁塔', '卢浮宫', '法式美食', '购物'],
    description: '巴黎是浪漫之都，拥有世界级的博物馆、美食和时尚，是无数旅行者心中的梦想之地。',
    bestSeason: '4-6月，9-10月',
    duration: '5-7天',
    budget: '15000-25000元'
  },
  {
    id: 8,
    name: '西藏拉萨',
    region: '国内',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lhasa+Tibet+China+Potala+Palace+with+snow+mountains+and+blue+sky+spiritual+travel+photography&image_size=landscape_4_3',
    rating: 4.7,
    tags: ['布达拉宫', '高原', '藏传佛教', '纳木错'],
    description: '拉萨是西藏自治区的首府，这里有壮丽的布达拉宫、纯净的蓝天和虔诚的信仰。',
    bestSeason: '6-9月',
    duration: '5-7天',
    budget: '4000-8000元'
  },
  {
    id: 9,
    name: '阿联酋迪拜',
    region: '国际',
    category: '奢华体验',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dubai+UAE+Burj+Khalifa+and+modern+skyscrapers+with+desert+landscape+luxury+travel+photography&image_size=landscape_4_3',
    rating: 4.6,
    tags: ['哈利法塔', '沙漠', '购物中心', '奢华酒店'],
    description: '迪拜是中东的奢华之都，拥有世界最高建筑、最大购物中心和令人惊叹的沙漠体验。',
    bestSeason: '11月-次年3月',
    duration: '4-6天',
    budget: '8000-20000元'
  },
  {
    id: 10,
    name: '浙江杭州',
    region: '国内',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hangzhou+West+Lake+China+with+traditional+pagoda+and+willow+trees+beautiful+landscape+travel+photography&image_size=landscape_4_3',
    rating: 4.7,
    tags: ['西湖', '龙井茶', '灵隐寺', '江南水乡'],
    description: '杭州以西湖美景闻名天下，素有"上有天堂，下有苏杭"之称，是江南最动人的城市。',
    bestSeason: '3-5月，9-11月',
    duration: '2-4天',
    budget: '1500-3000元'
  },
  {
    id: 11,
    name: '冰岛雷克雅未克',
    region: '国际',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Iceland+Reykjavik+with+northern+lights+and+glaciers+and+waterfalls+arctic+landscape+travel+photography',
    rating: 4.9,
    tags: ['极光', '温泉', '冰川', '瀑布'],
    description: '冰岛是地球上最像外星的地方，极光、冰川、火山和温泉构成了令人震撼的自然奇观。',
    bestSeason: '6-8月（午夜太阳），10-3月（极光）',
    duration: '7-10天',
    budget: '20000-35000元'
  },
  {
    id: 12,
    name: '广西桂林',
    region: '国内',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Guilin+China+Li+River+with+karst+mountains+and+bamboo+rafts+beautiful+landscape+travel+photography&image_size=landscape_4_3',
    rating: 4.6,
    tags: ['漓江', '阳朔', '喀斯特', '竹筏'],
    description: '桂林山水甲天下，这里的喀斯特地貌和漓江风光是中国最美的自然画卷之一。',
    bestSeason: '4-10月',
    duration: '3-5天',
    budget: '2000-4000元'
  }
];

// 攻略数据
const guides = [
  {
    id: 1,
    destId: 1,
    title: '大理深度游：苍山洱海间的慢时光',
    author: '旅行者小王',
    avatar: '王',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dali+ancient+town+with+Erhai+Lake+and+Cangshan+Mountain+beautiful+landscape+sunny+day+travel+photography&image_size=landscape_4_3',
    summary: '在洱海边骑行，在古城里漫步，感受大理最纯粹的风花雪月。',
    content: `<h2>Day 1：抵达大理，古城初探</h2>
    <p>抵达大理后，建议先入住古城附近的民宿。下午可以在古城内随意漫步，感受白族建筑的独特魅力。</p>
    <p>必打卡点：<strong>洋人街</strong>、<strong>人民路</strong>、<strong>复兴路</strong>。晚上可以在古城内找一家白族餐厅，品尝酸辣鱼和乳扇。</p>
    
    <h2>Day 2：环洱海骑行</h2>
    <p>租一辆电动车或自行车，从古城出发环洱海。沿途可以经过：</p>
    <ul>
      <li><strong>喜洲古镇</strong>：白族民居建筑群，品尝喜洲粑粑</li>
      <li><strong>双廊古镇</strong>：洱海边最美的古镇，杨丽萍的太阳宫所在地</li>
      <li><strong>挖色码头</strong>：绝佳的日落观赏点</li>
    </ul>
    
    <h2>Day 3：苍山徒步</h2>
    <p>乘坐索道上苍山，游览<strong>洗马潭</strong>和<strong>天龙八部影视城</strong>。苍山上的空气清新，可以俯瞰整个洱海。</p>
    
    <h2>出行小贴士</h2>
    <ul>
      <li>大理海拔约2000米，注意防晒</li>
      <li>早晚温差大，记得带外套</li>
      <li>洱海骑行注意安全，全程约120公里</li>
    </ul>`,
    tags: ['大理', '洱海', '骑行', '古城'],
    likes: 256,
    comments: 32,
    bookmarks: 89,
    createTime: '2026-06-15',
    status: 'published'
  },
  {
    id: 2,
    destId: 2,
    title: '京都红叶季完全攻略：7天打卡经典寺庙',
    author: '和风旅人',
    avatar: '和',
    category: '人文历史',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kyoto+Japan+traditional+temple+with+cherry+blossoms+and+wooden+architecture+beautiful+spring+day&image_size=landscape_4_3',
    summary: '在最美的季节遇见京都，从清水寺到岚山，一路红叶一路诗。',
    content: `<h2>Day 1-2：东山地区</h2>
    <p>从<strong>清水寺</strong>开始，沿着<strong>二年坂</strong>和<strong>三年坂</strong>漫步，感受京都的古韵。参拜<strong>八坂神社</strong>，晚上逛<strong>祇园</strong>，有机会看到艺伎的身影。</p>
    
    <h2>Day 3-4：岚山地区</h2>
    <p>乘坐JR到岚山，游览<strong>天龙寺</strong>和<strong>竹林小径</strong>。乘坐<strong>岚山小火车</strong>欣赏保津峡的红叶绝景。</p>
    
    <h2>Day 5-7：市区及周边</h2>
    <p>参拜<strong>金阁寺</strong>、<strong>银阁寺</strong>和<strong>龙安寺</strong>的枯山水庭园。最后一天可以去<strong>伏见稻荷大社</strong>，千本鸟居是必打卡的拍照点。</p>
    
    <h2>美食推荐</h2>
    <ul>
      <li>抹茶甜品：中村藤吉本店</li>
      <li>怀石料理：菊乃井</li>
      <li>拉面：一兰拉面京都河原町店</li>
    </ul>`,
    tags: ['京都', '红叶', '寺庙', '日本'],
    likes: 432,
    comments: 56,
    bookmarks: 178,
    createTime: '2026-05-20',
    status: 'published'
  },
  {
    id: 3,
    destId: 4,
    title: '成都三天两夜美食之旅：从火锅到串串',
    author: '吃货小分队',
    avatar: '吃',
    category: '美食之旅',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu+Sichuan+China+with+panda+and+hotpot+and+traditional+teahouse+urban+travel+photography&image_size=landscape_4_3',
    summary: '在成都，每一顿都是味蕾的盛宴。从早到晚，吃遍成都最地道的美食。',
    content: `<h2>Day 1：市中心美食探索</h2>
    <p>上午去<strong>大熊猫繁育研究基地</strong>看国宝，中午在<strong>宽窄巷子</strong>品尝各种小吃。下午去<strong>人民公园</strong>喝盖碗茶，体验成都慢生活。晚上吃一顿正宗的<strong>四川火锅</strong>。</p>
    
    <h2>Day 2：老成都味道</h2>
    <p>早餐：<strong>龙抄手</strong>或<strong>担担面</strong>。上午逛<strong>锦里</strong>和<strong>武侯祠</strong>。午餐在<strong>玉林路</strong>找一家苍蝇馆子。下午去<strong>杜甫草堂</strong>，晚上吃<strong>串串香</strong>。</p>
    
    <h2>Day 3：周边美食</h2>
    <p>去<strong>都江堰</strong>看水利工程，在<strong>青城山</strong>品尝道家素斋。回城后最后一顿来一顿<strong>钵钵鸡</strong>。</p>
    
    <h2>必吃清单</h2>
    <ul>
      <li>火锅：小龙坎、蜀大侠</li>
      <li>串串：冒椒火辣</li>
      <li>小吃：三大炮、糖油果子、蛋烘糕</li>
    </ul>`,
    tags: ['成都', '美食', '火锅', '熊猫'],
    likes: 389,
    comments: 45,
    bookmarks: 156,
    createTime: '2026-06-01',
    status: 'published'
  },
  {
    id: 4,
    destId: 6,
    title: '三亚亲子游终极攻略：带娃玩转热带海岛',
    author: '宝妈旅行记',
    avatar: '宝',
    category: '海岛度假',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya+Hainan+China+tropical+beach+with+palm+trees+and+blue+ocean+sunny+paradise+travel&image_size=landscape_4_3',
    summary: '带娃出行不慌乱，三亚最全亲子游攻略，从酒店到景点一网打尽。',
    content: `<h2>住宿推荐</h2>
    <p>亲子游首选<strong>海棠湾</strong>或<strong>亚龙湾</strong>的度假酒店，大部分酒店都有儿童俱乐部和水上乐园。推荐：亚特兰蒂斯、天域度假酒店。</p>
    
    <h2>Day 1-2：海滩时光</h2>
    <p>在酒店沙滩上玩沙子、游泳。下午可以去<strong>三亚千古情</strong>看演出，孩子会很喜欢。</p>
    
    <h2>Day 3：热带天堂森林公园</h2>
    <p>走<strong>过江龙索桥</strong>，参观<strong>鸟巢</strong>，在热带雨林中探索自然。</p>
    
    <h2>亲子贴士</h2>
    <ul>
      <li>带好防晒霜和驱蚊液</li>
      <li>准备儿童泳衣和游泳圈</li>
      <li>注意饮食卫生，选择正规餐厅</li>
    </ul>`,
    tags: ['三亚', '亲子', '海滩', '度假'],
    likes: 198,
    comments: 23,
    bookmarks: 67,
    createTime: '2026-04-10',
    status: 'published'
  },
  {
    id: 5,
    destId: 3,
    title: '清迈慢生活体验：寺庙、丛林和夜市',
    author: '东南亚达人',
    avatar: '东',
    category: '休闲度假',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chiang+Mai+Thailand+beautiful+temple+with+elephants+and+tropical+scenery+sunny+day+travel&image_size=landscape_4_3',
    summary: '在清迈，不赶时间才是最好的旅行方式。寺庙、咖啡、夜市，享受泰北慢生活。',
    content: `<h2>Day 1：古城探索</h2>
    <p>清迈古城不大，步行即可游览。必打卡的寺庙：<strong>帕辛寺</strong>、<strong>契迪龙寺</strong>。下午找一家咖啡馆发呆，傍晚去<strong>周日夜市</strong>。</p>
    
    <h2>Day 2：丛林飞跃</h2>
    <p>报一个<strong>丛林飞跃</strong>一日游，在热带雨林中穿梭，刺激又好玩。晚上去<strong>宁曼路</strong>逛文艺小店。</p>
    
    <h2>Day 3：大象保护营</h2>
    <p>选择一家负责任的大象保护营，与大象亲密互动，给它们喂食和洗澡。</p>
    
    <h2>美食推荐</h2>
    <ul>
      <li>泰北咖喱面 Khao Soi</li>
      <li>芒果糯米饭</li>
      <li>清迈香肠 Sai Oua</li>
    </ul>`,
    tags: ['清迈', '泰国', '寺庙', '丛林'],
    likes: 312,
    comments: 28,
    bookmarks: 134,
    createTime: '2026-05-08',
    status: 'published'
  },
  {
    id: 6,
    destId: 8,
    title: '西藏拉萨朝圣之旅：高原上的心灵之旅',
    author: '高原行者',
    avatar: '高',
    category: '自然风光',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lhasa+Tibet+China+Potala+Palace+with+snow+mountains+and+blue+sky+spiritual+travel+photography&image_size=landscape_4_3',
    summary: '在离天堂最近的地方，感受信仰的力量和自然的壮美。',
    content: `<h2>行前准备</h2>
    <p>提前一周服用<strong>红景天</strong>，抵达后第一天不要剧烈运动，多休息适应高原。</p>
    
    <h2>Day 1-2：拉萨市区</h2>
    <p>参观<strong>布达拉宫</strong>（需提前预约），去<strong>大昭寺</strong>看虔诚的朝拜者，在<strong>八廓街</strong>转经。</p>
    
    <h2>Day 3-5：纳木错</h2>
    <p>包车前往<strong>纳木错</strong>，西藏三大圣湖之一。湖面海拔4718米，湖水湛蓝如宝石。</p>
    
    <h2>注意事项</h2>
    <ul>
      <li>注意高原反应，随身携带氧气瓶</li>
      <li>尊重当地宗教习俗</li>
      <li>不要随意拍摄寺庙内的佛像</li>
    </ul>`,
    tags: ['西藏', '拉萨', '布达拉宫', '高原'],
    likes: 445,
    comments: 67,
    bookmarks: 210,
    createTime: '2026-03-22',
    status: 'published'
  }
];

// 景点数据（用于搜索）
const attractions = [
  // 云南大理
  { id: 1, name: '苍山洱海', destId: 1, rating: 4.9, category: '自然风光', city: '大理' },
  { id: 101, name: '大理古城', destId: 1, rating: 4.7, category: '古城', city: '大理' },
  { id: 102, name: '喜洲古镇', destId: 1, rating: 4.6, category: '古镇', city: '大理' },
  { id: 103, name: '双廊古镇', destId: 1, rating: 4.7, category: '古镇', city: '大理' },
  { id: 104, name: '崇圣寺三塔', destId: 1, rating: 4.5, category: '寺庙', city: '大理' },
  { id: 105, name: '天龙八部影视城', destId: 1, rating: 4.3, category: '主题公园', city: '大理' },
  // 日本京都
  { id: 2, name: '清水寺', destId: 2, rating: 4.8, category: '寺庙', city: '京都' },
  { id: 201, name: '金阁寺', destId: 2, rating: 4.7, category: '寺庙', city: '京都' },
  { id: 202, name: '伏见稻荷大社', destId: 2, rating: 4.9, category: '神社', city: '京都' },
  { id: 203, name: '岚山竹林', destId: 2, rating: 4.8, category: '自然风光', city: '京都' },
  { id: 204, name: '祇园', destId: 2, rating: 4.6, category: '街区', city: '京都' },
  { id: 205, name: '二条城', destId: 2, rating: 4.5, category: '历史建筑', city: '京都' },
  // 泰国清迈
  { id: 3, name: '契迪龙寺', destId: 3, rating: 4.7, category: '寺庙', city: '清迈' },
  { id: 301, name: '帕辛寺', destId: 3, rating: 4.6, category: '寺庙', city: '清迈' },
  { id: 302, name: '清迈夜间动物园', destId: 3, rating: 4.5, category: '动物园', city: '清迈' },
  { id: 303, name: '素贴山双龙寺', destId: 3, rating: 4.8, category: '寺庙', city: '清迈' },
  { id: 304, name: '宁曼路', destId: 3, rating: 4.4, category: '街区', city: '清迈' },
  { id: 305, name: '清迈夜市', destId: 3, rating: 4.5, category: '集市', city: '清迈' },
  // 四川成都
  { id: 4, name: '大熊猫基地', destId: 4, rating: 4.9, category: '动物园', city: '成都' },
  { id: 401, name: '宽窄巷子', destId: 4, rating: 4.6, category: '街区', city: '成都' },
  { id: 402, name: '锦里古街', destId: 4, rating: 4.5, category: '街区', city: '成都' },
  { id: 403, name: '武侯祠', destId: 4, rating: 4.6, category: '历史建筑', city: '成都' },
  { id: 404, name: '杜甫草堂', destId: 4, rating: 4.4, category: '历史建筑', city: '成都' },
  { id: 405, name: '都江堰', destId: 4, rating: 4.8, category: '自然风光', city: '成都' },
  { id: 406, name: '青城山', destId: 4, rating: 4.7, category: '自然风光', city: '成都' },
  // 意大利罗马
  { id: 5, name: '罗马斗兽场', destId: 5, rating: 4.8, category: '历史建筑', city: '罗马' },
  { id: 501, name: '梵蒂冈博物馆', destId: 5, rating: 4.9, category: '博物馆', city: '罗马' },
  { id: 502, name: '特雷维喷泉', destId: 5, rating: 4.7, category: '地标', city: '罗马' },
  { id: 503, name: '万神殿', destId: 5, rating: 4.7, category: '历史建筑', city: '罗马' },
  { id: 504, name: '西班牙广场', destId: 5, rating: 4.5, category: '广场', city: '罗马' },
  // 海南三亚
  { id: 6, name: '亚龙湾', destId: 6, rating: 4.7, category: '海滩', city: '三亚' },
  { id: 601, name: '天涯海角', destId: 6, rating: 4.4, category: '自然风光', city: '三亚' },
  { id: 602, name: '蜈支洲岛', destId: 6, rating: 4.7, category: '海岛', city: '三亚' },
  { id: 603, name: '南山文化旅游区', destId: 6, rating: 4.6, category: '文化景区', city: '三亚' },
  { id: 604, name: '亚特兰蒂斯水世界', destId: 6, rating: 4.8, category: '主题公园', city: '三亚' },
  // 法国巴黎
  { id: 7, name: '埃菲尔铁塔', destId: 7, rating: 4.8, category: '地标建筑', city: '巴黎' },
  { id: 701, name: '卢浮宫', destId: 7, rating: 4.9, category: '博物馆', city: '巴黎' },
  { id: 702, name: '凯旋门', destId: 7, rating: 4.6, category: '地标建筑', city: '巴黎' },
  { id: 703, name: '巴黎圣母院', destId: 7, rating: 4.7, category: '教堂', city: '巴黎' },
  { id: 704, name: '凡尔赛宫', destId: 7, rating: 4.8, category: '历史建筑', city: '巴黎' },
  { id: 705, name: '蒙马特高地', destId: 7, rating: 4.5, category: '街区', city: '巴黎' },
  // 西藏拉萨
  { id: 8, name: '布达拉宫', destId: 8, rating: 5.0, category: '历史建筑', city: '拉萨' },
  { id: 801, name: '大昭寺', destId: 8, rating: 4.8, category: '寺庙', city: '拉萨' },
  { id: 802, name: '八廓街', destId: 8, rating: 4.6, category: '街区', city: '拉萨' },
  { id: 803, name: '纳木错', destId: 8, rating: 4.9, category: '自然风光', city: '拉萨' },
  { id: 804, name: '哲蚌寺', destId: 8, rating: 4.5, category: '寺庙', city: '拉萨' },
  // 阿联酋迪拜
  { id: 9, name: '哈利法塔', destId: 9, rating: 4.7, category: '地标建筑', city: '迪拜' },
  { id: 901, name: '迪拜购物中心', destId: 9, rating: 4.6, category: '购物', city: '迪拜' },
  { id: 902, name: '棕榈岛', destId: 9, rating: 4.7, category: '海岛', city: '迪拜' },
  { id: 903, name: '迪拜沙漠保护区', destId: 9, rating: 4.5, category: '自然风光', city: '迪拜' },
  // 浙江杭州
  { id: 10, name: '西湖', destId: 10, rating: 4.8, category: '自然风光', city: '杭州' },
  { id: 1001, name: '灵隐寺', destId: 10, rating: 4.7, category: '寺庙', city: '杭州' },
  { id: 1002, name: '雷峰塔', destId: 10, rating: 4.5, category: '历史建筑', city: '杭州' },
  { id: 1003, name: '西溪湿地', destId: 10, rating: 4.6, category: '自然风光', city: '杭州' },
  { id: 1004, name: '宋城', destId: 10, rating: 4.4, category: '主题公园', city: '杭州' },
  // 冰岛
  { id: 11, name: '蓝湖温泉', destId: 11, rating: 4.9, category: '温泉', city: '雷克雅未克' },
  { id: 1101, name: '黄金圈', destId: 11, rating: 4.8, category: '自然风光', city: '雷克雅未克' },
  { id: 1102, name: '冰河湖', destId: 11, rating: 4.9, category: '自然风光', city: '雷克雅未克' },
  { id: 1103, name: '黑沙滩', destId: 11, rating: 4.7, category: '海滩', city: '雷克雅未克' },
  // 广西桂林
  { id: 12, name: '漓江', destId: 12, rating: 4.7, category: '自然风光', city: '桂林' },
  { id: 1201, name: '阳朔西街', destId: 12, rating: 4.5, category: '街区', city: '桂林' },
  { id: 1202, name: '象鼻山', destId: 12, rating: 4.4, category: '自然风光', city: '桂林' },
  { id: 1203, name: '龙脊梯田', destId: 12, rating: 4.8, category: '自然风光', city: '桂林' },
  // 通用景点
  { id: 2001, name: '当地博物馆', destId: 0, rating: 4.3, category: '博物馆', city: '通用' },
  { id: 2002, name: '市中心广场', destId: 0, rating: 4.2, category: '广场', city: '通用' },
  { id: 2003, name: '当地夜市', destId: 0, rating: 4.4, category: '集市', city: '通用' },
  { id: 2004, name: '城市公园', destId: 0, rating: 4.3, category: '自然风光', city: '通用' },
  { id: 2005, name: '购物中心', destId: 0, rating: 4.1, category: '购物', city: '通用' },
  { id: 2006, name: '本地美食街', destId: 0, rating: 4.5, category: '美食', city: '通用' },
  { id: 2007, name: '观景台', destId: 0, rating: 4.3, category: '自然风光', city: '通用' },
  { id: 2008, name: '网红打卡点', destId: 0, rating: 4.2, category: '地标', city: '通用' },
];

// 分类列表
const categories = ['全部', '自然风光', '人文历史', '休闲度假', '美食之旅', '海岛度假', '浪漫都市', '奢华体验'];

// 地区列表
const regions = ['全部', '国内', '国际'];