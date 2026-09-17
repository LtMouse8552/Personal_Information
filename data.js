// ============================================================
// 个人展示平台 - 数据配置文件(IDE 主题版)
// ------------------------------------------------------------
// 使用说明:
//   1. 只需修改本文件即可更新整个网站内容,无需改动 index.html
//   2. 字符串请用引号包裹,数组用 [ ],每一项之间用逗号分隔
//   3. 不需要的字段可以留空字符串 "" 或空数组 [ ]
//   4. 修改保存后刷新浏览器即可看到效果
// ============================================================

window.SITE_DATA = {

  // ---------- 基本信息 ----------
  name: "你的名字",              // 显示在标题、Hero 大字、页脚
  logoText: "portfolio",         // 左上角 Logo 显示 ~/xxx
  heroHello: "你好,世界",        // Hero 顶部小字 ● 后面的问候语
  tagline: "上海杉达学院 · 计算机科学与技术(卓越班)",  // 名字下方一句话
  version: "1.0.0",              // 底部状态栏版本号

  // ---------- 终端打字机内容(Hero 左侧) ----------
  // type: "cmd" = 命令行(带 $ 提示符,逐字打出)
  //       "out" = 输出行(text 纯文本 / html 可带高亮标签)
  terminal: [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "上海杉达学院 · 计算机科学与技术 · 卓越班在读" },
    { type: "out", text: "热爱编程,乐于把想法变成能运行的东西。" },
    { type: "cmd", text: "cat ./interests.txt" },
    { type: "out", html: '<span class="hl-c">[</span> 后端开发, 算法, 开源 <span class="hl-c">]</span>' },
    { type: "cmd", text: "echo \"欢迎来到我的数字实验室 ✨\"" },
    { type: "out", html: '<span class="hl-s">欢迎来到我的数字实验室 ✨</span>' },
  ],

  // 联系方式(邮箱会自动显示为 Contact 区的大号邮箱)
  contacts: [
    { label: "邮箱", text: "your_email@example.com" },
    { label: "GitHub", text: "https://github.com/你的用户名" },
    // { label: "博客", text: "https://..." },
  ],

  // ---------- 关于我(Bento Grid) ----------
  about: {
    name: "你的名字",
    school: "上海杉达学院",
    major: "计算机科学与技术(卓越班)",
    role: "学生开发者",
    // 简介行:每行一条,会渲染成 JSON 数组
    bioLines: [
      "在这里写第一句:你是谁、正在做什么。",
      "第二句:你的技术方向与热情所在。",
      "第三句:你的目标或正在追求的东西。",
    ],
    openToWork: true,
    status: "在读 · 接受实习/合作机会",   // current_status 卡片
    keywords: ["算法", "后端", "开源", "终身学习"],   // 关键词标签
    facts: [   // 趣味事实,可任意增删
      "键盘上 W A S D 磨损最快",
      "提交代码前必先 git pull",
      "凌晨的 bug 修得特别快(错觉)",
    ],
  },

  // ---------- 技能(package.json 风格) ----------
  // key 是分组名(如 dependencies / devDependencies / currentlyLearning)
  // 每项:name 技能名 / level 熟练度(如 ★★★★☆ 或 熟练)/ tip 悬停提示(可留空)
  skillGroups: [
    {
      key: "dependencies",
      items: [
        { name: "C/C++", level: "熟练", tip: "数据结构课程主力语言,写过课程设计项目。" },
        { name: "Java", level: "熟练", tip: "面向对象、集合、多线程。" },
        { name: "Python", level: "掌握", tip: "脚本、爬虫、数据处理。" },
      ],
    },
    {
      key: "devDependencies",
      items: [
        { name: "Git", level: "日常", tip: "分支管理、协作开发。" },
        { name: "Linux", level: "日常", tip: "常用命令、服务器部署。" },
        { name: "MySQL", level: "掌握", tip: "建表、查询优化。" },
      ],
    },
    {
      key: "currentlyLearning",
      items: [
        { name: "Spring Boot", level: "学习中", tip: "" },
        { name: "Docker", level: "学习中", tip: "" },
      ],
    },
  ],

  // ---------- 经历(git log 时间线) ----------
  // tag 可选:feat / fix / refactor / merge / docs(决定徽章颜色)
  // hash 是模拟的 commit 哈希,随意填写或留空(有默认值)
  experience: [
    {
      tag: "feat",
      hash: "a1b2c3d",
      time: "20XX 年 9 月 — 至今",
      title: "上海杉达学院 · 计算机科学与技术(卓越班)",
      description: "在这里填写学习情况、绩点排名、主要课程、奖学金等。",
    },
    {
      tag: "merge",
      hash: "e4f5g6h",
      time: "20XX 年 X 月",
      title: "某段竞赛 / 实习 / 项目经历(示例,请替换)",
      description: "具体描述这段经历的职责与成果。",
    },
  ],

  // ---------- 项目(repo 卡片) ----------
  // name / description / languages(决定语言色条和主语言,见内置色表)/
  // tech 技术标签 / stars / forks(展示数字,随意填)/ links 相关链接
  projects: [
    {
      name: "项目一(示例,请替换)",
      description: "项目背景、你负责的部分、实现的难点与亮点、最终成果等。",
      languages: ["Java", "Vue"],
      tech: ["Spring Boot", "MySQL", "Redis"],
      stars: "12",
      forks: "3",
      links: [
        { label: "GitHub", url: "https://github.com/你的用户名/项目仓库" },
      ],
    },
    {
      name: "项目二(示例,请替换)",
      description: "继续添加更多项目:复制一段并修改即可,卡片自动排列。",
      languages: ["Python"],
      tech: ["爬虫", "Pandas"],
      stars: "5",
      forks: "1",
      links: [],
    },
  ],

  // ---------- 页脚(留空则显示默认 build with ❤ and code) ----------
  footer: "",
};
