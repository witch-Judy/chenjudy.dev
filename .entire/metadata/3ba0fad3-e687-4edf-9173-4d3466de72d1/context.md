# Session Context

Session ID: 3ba0fad3-e687-4edf-9173-4d3466de72d1
Commit Message: [Image: source: /Users/chenbihan/.claude/image-cache/3ba0fad3-e687-4edf-

## Prompts

### Prompt 1

我们在projects里加一个scibot，新加坡本地科学教育体系AI辅导家教 /Users/chenbihan/Desktop/截屏2026-05-18 上午11.22.05 图用这个 然后地址是：https://scibot-sg.vercel.app/ 有免费试用credits 这个项目可以强调百分百匹配教材之类的 这是一个和实际市场需求强结合的落地项目 然后这个项目可以放到[Image #7] 替换这个buzzscope 历史透视的位置，也就是这个历史透视的可以先不放，改成这个scibot

### Prompt 2

[Image: source: /Users/chenbihan/.claude/image-cache/3ba0fad3-e687-4edf-9173-4d3466de72d1/7.png]

## Summary

处理完了：

**代码改动**
- `src/components/Projects.astro` 里原来的 `buzzscope-historical` 卡片替换为 SciBot
- 截图 `截屏2026-05-18 上午11.22.05.png` 复制到 `public/assets/projects/scibot.png`
- type 设为 `creative`（live product → 会展示 Interactive 标签），不是 github repo
- tech 标签写 `AI Tutor · MOE-Aligned`
- 文案双语都强调了三个核心卖点：① 100% 对齐 MOE 教材 / 章节 / 考核 ② 不是通用 AI 问答而是讲本地课纲语言 ③ 注册即送免费试用 credits ④ 瞄准市场真实存在的本地化 + 教材级精度缺口

**记忆系统更新**
- 新增 `project_scibot.md` 详细记录 SciBot 的定位、URL、市场卖点、与 IRIS / SIGINT 的角色分工（IRIS = 认知/人文，SIGINT = 全球情报，SciBot = 本地教育市场落地）
- `MEMORY.md` 索引加入 SciBot 一行
- `project_illucio_status.md` 把 flagship 从"两个"更新为"三个"

dev server 已经跑在 http://localhost:4321/ 了，浏览器会自动滚到 #projects 看新卡片。需要调文案、tech tag 措辞、或者把 BuzzScope 历史透视回来都告诉我。
