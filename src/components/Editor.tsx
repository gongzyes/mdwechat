import { useState, useEffect, useRef, ClipboardEvent, DragEvent } from 'react';
import { Copy, Monitor, Smartphone, ImagePlus } from 'lucide-react';
import { themes, getTheme } from '../utils/themes';
import { parseMarkdown } from '../utils/markdownParser';
import 'highlight.js/styles/github.css'; // 使用 GitHub 风格作为高亮基础

const DEFAULT_MARKDOWN = `# 欢迎使用高校微信 Markdown 编辑器

这是一份面向高校行政和学生阅读优化的排版示例。您可以从顶部切换不同的主题体验。

## 为什么选择这款编辑器

对于很多学生干部和行政老师来说，排版一篇公众号文章耗时耗力。使用 Markdown 结合本编辑器的预设样式，可以让你**专注于内容创作**，不再纠结于格式调整。

### 核心功能

1. **一键生成**：实时预览，所见即所得。
2. **多主题支持**：内置学术经典、校园活力、行政严谨等多种风格。
3. **完美适配微信**：所有样式通过内联注入，复制后在微信后台粘贴格式不丢失。

> "工欲善其事，必先利其器。优秀的排版能让信息的传达事半功倍。" —— 校党委宣传部

## 排版元素展示

### 列表展示

下面是开学季活动清单：

* **9月1日**：新生报到与注册
* **9月2日-9月14日**：新生军训
* **9月15日**：正式上课

1. 第一步：完成线上缴费
2. 第二步：前往学院大厅领取资料袋
3. 第三步：入住宿舍

### 表格与代码

| 部门 | 负责人 | 联系方式 |
| --- | --- | --- |
| 教务处 | 张老师 | 8888-1234 |
| 学工部 | 李老师 | 8888-5678 |

\`\`\`javascript
// 核心配置示例
const config = {
  theme: 'academic',
  fontSize: '16px',
  isStudentOriented: true
};
console.log('配置加载成功', config);
\`\`\`

如有任何问题，请联系系统管理员。

---
*版权所有 © 2026 XX大学*
`;

export default function Editor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id);
  const [htmlContent, setHtmlContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc');

  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const imgId = `img_${Math.random().toString(36).substr(2, 9)}`;
      
      const imageRef = `\n[${imgId}]: ${base64}\n`;
      const imageInsert = `![图片][${imgId}]`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const before = markdown.substring(0, start);
        const after = markdown.substring(end);
        
        setMarkdown(before + imageInsert + after + imageRef);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + imageInsert.length;
          textarea.focus();
        }, 0);
      } else {
        setMarkdown(prev => prev + '\n' + imageInsert + '\n' + imageRef);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
        break; // 只处理第一张图片
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleImageUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
      // 清空 input，以便重复上传同一张图片
      e.target.value = '';
    }
  };

  useEffect(() => {
    const theme = getTheme(activeThemeId);
    const parsedHtml = parseMarkdown(markdown, theme);
    setHtmlContent(parsedHtml);
  }, [markdown, activeThemeId]);

  const handleCopy = async () => {
    if (!previewRef.current) return;
    
    try {
      // 获取要复制的 HTML 内容
      const htmlStr = previewRef.current.innerHTML;
      
      // 使用 Clipboard API 复制富文本
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlStr], { type: 'text/html' }),
        'text/plain': new Blob([previewRef.current.innerText], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">🏫 高校微信排版工具</h1>
          
          <select 
            value={activeThemeId} 
            onChange={(e) => setActiveThemeId(e.target.value)}
            className="ml-4 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button 
              onClick={() => setViewMode('pc')}
              className={`p-1.5 rounded ${viewMode === 'pc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              title="PC 预览视图"
            >
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              title="手机预览视图"
            >
              <Smartphone size={18} />
            </button>
          </div>

          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              copySuccess 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Copy size={16} />
            {copySuccess ? '已复制！请去微信粘贴' : '复制到微信公众号'}
          </button>
        </div>
      </header>

      {/* 主体编辑区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧 Markdown 编辑区 */}
        <div className="w-1/2 h-full flex flex-col border-r border-gray-200 bg-white">
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 flex justify-between items-center">
            <span className="uppercase tracking-wider">Markdown 输入</span>
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <ImagePlus size={14} />
              <span>插入图片</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileInput} 
              />
            </label>
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 w-full p-4 resize-none outline-none text-gray-700 font-mono text-sm leading-relaxed"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            placeholder="在这里输入 Markdown... (支持直接粘贴或拖拽图片)"
            spellCheck={false}
          />
        </div>

        {/* 右侧实时预览区 */}
        <div className="w-1/2 h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>微信渲染预览</span>
            <span>{themes.find(t => t.id === activeThemeId)?.name}</span>
          </div>
          
          <div className="flex-1 p-8 flex justify-center items-center bg-gray-100 overflow-hidden">
            {/* 模拟手机外壳或 PC 页面 */}
            <div 
              className={`bg-white shadow-lg relative flex flex-col ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[30px] border-[8px] border-gray-800 flex-shrink-0' : 'w-full h-full max-w-[800px] rounded-lg'} transition-all duration-300 ease-in-out`}
            >
              <div 
                ref={previewRef}
                className={`flex-1 overflow-y-auto p-6 w-full overflow-x-hidden ${viewMode === 'mobile' ? 'mt-4 mb-4' : ''}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
