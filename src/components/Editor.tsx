import { useState, useEffect, useRef } from 'react';
import type { ClipboardEvent, DragEvent } from 'react';
import { Copy, Monitor, Smartphone, ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import { themes, getTheme } from '../utils/themes';
import { parseMarkdown } from '../utils/markdownParser';
import 'highlight.js/styles/github.css'; // 使用 GitHub 风格作为高亮基础

export const SAMPLE_ARTICLE = `# 🏫 欢迎使用高校微信 Markdown 排版神器

> **导语 / 编者按**  
> “教育是一棵树摇动另一棵树，一朵云推动另一朵云。” 一篇排版优雅、结构清晰的公众号推文，能让高校政策通知更温情、学生活动更具号召力、学术成果更有穿透力。

---

## 01 / 为什么选择高校专用排版工具？

对于高校辅导员、行政老师与宣传部骨干同学而言，日常推文排版往往面临**格式错乱、样式繁琐、图表难做**等痛点。本工具专为高校场景深度优化：

* 🚀 **极简高效**：专注于内容撰写，Markdown 实时自动转为微信公众号优雅样式；
* 🎨 **多套主题**：学术严谨、校园活力、行政规范等多款预设配色随心切换；
* 📊 **图表秒转**：原生支持 Mermaid 流程图，自动高清渲染；
* 📋 **一键复制**：内置富文本与内联样式转换，在微信公众平台粘贴 100% 还原。

---

## 02 / 核心功能与排版组件展示

### 1. 任务流转与流程图示例 (Mermaid)

\`\`\`mermaid
graph LR
    A[策划撰稿] --> B[学院审核]
    B --> C[排版优化]
    C --> D[一键复制]
    D --> E[公众号发布]
\`\`\`

### 2. 开学季重要日程安排清单

* **9 月 1 日：** 本科及研究生新生报到注册、一站式绿色通道开通；
* **9 月 2 日 - 9 月 14 日：** 新生军事技能训练与入学国防教育；
* **9 月 15 日：** 全校秋季学期开学典礼暨“开学第一课”。

### 3. 学工事务协同责任清单

| 部门 | 负责人 | 核心职责 | 联系方式 |
| :--- | :--- | :--- | :--- |
| **教务处** | 张老师 | 课程注册与选课协调 | 025-88881234 |
| **学工部** | 李老师 | 迎新接站与宿舍分配 | 025-88885678 |
| **团委** | 王老师 | 志愿服务与社团招新 | 025-88889012 |

### 4. 宣传工作通知代码片段

\`\`\`python
def publish_notice(title: str, dept: str) -> bool:
    """
    高校微信公众号通知发布自动化脚本
    """
    print(f"[{dept}] 通知《{title}》已成功同步至高校融媒体中心！")
    return True

publish_notice("2026年秋季学期迎新工作方案", "校党委宣传部")
\`\`\`

---

## 03 / 快速上手小贴士

1. 📷 **粘贴图片**：直接使用快捷键 \`Command + V\` 或点击上方“插入图片”，自动无损内嵌；
2. 🔄 **实时缓存**：每次编辑自动保存至浏览器，刷新网页不丢稿；
3. 📱 **双模预览**：支持 PC 视图与移动端真机外壳视图一键切换。

---

### 💬 【留言互动】
新学期新气象！针对新学期的宣传工作，你最希望增加哪些排版模板或实用功能？欢迎在评论区留言交流～
`;

export default function Editor() {
  const [markdown, setMarkdown] = useState(() => {
    const cached = localStorage.getItem('mdwechat_draft');
    if (cached !== null && cached.trim().length > 0) {
      return cached;
    }
    return SAMPLE_ARTICLE;
  });

  // 监听 markdown 变化，统一同步到本地缓存，包括插入图片等通过代码修改的情况
  useEffect(() => {
    localStorage.setItem('mdwechat_draft', markdown);
  }, [markdown]);
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
      const imgId = `img_${Math.random().toString(36).substring(2, 9)}`;
      
      // 使用 \n\n 确保 marked 解析器将其识别为独立的引用链接定义，而不是普通段落文本
      const imageRef = `\n\n[${imgId}]: ${base64}\n\n`;
      const imageInsert = `![图片][${imgId}]`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        setMarkdown((prev) => {
          const before = prev.substring(0, start);
          const after = prev.substring(end);
          return before + imageInsert + after + imageRef;
        });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + imageInsert.length;
            textareaRef.current.focus();
          }
        }, 0);
      } else {
        setMarkdown((prev) => prev + '\n' + imageInsert + '\n' + imageRef);
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
    let isCancelled = false;
    const theme = getTheme(activeThemeId);
    
    // 使用异步调用解析 Markdown
    parseMarkdown(markdown, theme).then(parsedHtml => {
      if (!isCancelled) {
        setHtmlContent(parsedHtml);
      }
    }).catch(err => {
      console.error('Markdown parse error:', err);
    });

    return () => {
      isCancelled = true;
    };
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">🏫 高校微信排版工具</h1>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">v1.3</span>
          </div>
          
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (markdown.trim().length === 0 || window.confirm('加载示例文章将覆盖当前编辑区内容，是否继续？')) {
                    setMarkdown(SAMPLE_ARTICLE);
                  }
                }}
                className="cursor-pointer text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="加载预置高校示例文章"
              >
                <RotateCcw size={13} />
                <span>加载示例</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (markdown.trim().length > 0 && window.confirm('确定要清空编辑区内容吗？')) {
                    setMarkdown('');
                  }
                }}
                className="cursor-pointer text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                title="清空当前所有内容"
              >
                <Trash2 size={13} />
                <span>清空</span>
              </button>
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
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 w-full p-4 resize-none outline-none text-gray-700 font-mono text-sm leading-relaxed"
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
            }}
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
