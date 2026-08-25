# 🏫 高校微信公众号 Markdown 排版神器 (MDWechat)

<div align="center">

![Version](https://img.shields.io/badge/version-v1.5.1-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

**专为高校教师、辅导员、学工行政团队与自媒体创作者深度优化的公众号排版工具。**  
让排版像写作一样自然流畅，所见即所得，一键无缝复制到微信公众平台后台！

[👉 立即在线体验（无需安装，打开即用）](https://mdwechat-dzq.pages.dev/)

</div>

---

## ✨ 为什么选择这款排版工具？

在高校宣传、公文通知与学生活动推文撰写中，常常遇到**格式错乱、样式繁琐、代码掉色、流程图难做**等痛点。本工具通过在浏览器本地实时解析 Markdown，并将预设样式以 **内联 CSS (Inline Styles)** 的方式深度注入，彻底解决微信后台格式丢失问题！

### 核心亮点

* 🚀 **纯前端安全架构**：100% 浏览器本地解析与渲染，无需注册，不收集任何文章数据，草稿自动保存在本地 `localStorage`，断网刷新不丢稿。
* 🎨 **多套高校专属主题**：内置学术严谨、校园活力、行政公文、极简科研等多种经过视觉优化的经典配色。
* 📊 **Mermaid 11.x 图表支持**：原生支持流程图、时序图、甘特图等，自动渲染为 2x 高清 PNG 图片，微信中清晰展示。内置 5 款图表配色风格（经典浅蓝、严谨素雅、清新森林、紫韵优雅、极客暗黑）。
* 💻 **Mac 视窗代码块**：自动生成 Mac 风格顶栏（🔴 🟡 🟢）与语言标签，内置 One Dark、GitHub Light、VS Code Dark、Monokai Pro、Nord 等 7 款主流高亮配色，**粘贴到微信后台颜色 100% 完整保留**。
* 📷 **便捷图片管理**：支持直接使用快捷键 `Command + V` / `Ctrl + V` 粘贴图片、拖拽上传，自动内嵌渲染。
* 📱 **双模实时预览**：支持 PC 网页视图与移动端真机外壳视图一键自由切换。

---

## 🎯 快速上手（3步搞定微信推文）

1. **进入网站**：打开 [在线体验地址](https://mdwechat-dzq.pages.dev/)；
2. **撰写内容**：在左侧输入 Markdown 文本（支持点击右上角「加载示例」快速熟悉语法）；
3. **一键复制**：点击右上角 **「复制到微信公众号」** 按钮，直接在微信公众号后台编辑器按 `Ctrl + V` / `⌘ + V` 粘贴即可！

---

## 🛠️ 本地开发与私有化部署

如果您希望将本项目部署在自己的服务器或本地运行：

### 1. 克隆代码到本地
```bash
git clone https://github.com/gongzyes/mdwechat.git
cd mdwechat
```

### 2. 安装依赖并启动
```bash
npm install
npm run dev
```
打开浏览器访问 `http://localhost:5173` 即可开始本地开发。

### 3. 构建打包
```bash
npm run build
```
打包产物位于 `dist/` 目录，可直接托管于任何静态服务器（Cloudflare Pages、Vercel、GitHub Pages、Nginx 等）。

---

## 🔒 安全与隐私承诺

* **零服务器通信**：本应用没有任何后端接口，不会将您的文章内容、标题或图片上传至任何第三方服务器。
* **数据完全归属用户**：所有内容均留存在您的本地浏览器中，请放心撰写各类内部公文与学术材料。

---

## 🤝 参与贡献与支持

如果您觉得本工具对您或身边的高校同仁有所帮助：
- 🌟 欢迎给本仓库点一个 **Star** 支持作者！
- 🐛 如遇到排版兼容性问题或有新功能需求，欢迎提交 [Issues](https://github.com/gongzyes/mdwechat/issues) 或 Pull Requests。

---

<div align="center">

*Made with ❤️ for Educators & Creators.*

</div>
