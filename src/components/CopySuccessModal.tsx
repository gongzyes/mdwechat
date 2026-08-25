import React from 'react';
import { CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react';
import { sponsorConfig } from '../config/sponsors';

interface CopySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopySuccessModal: React.FC<CopySuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slideUp">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-5 overflow-hidden relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* 复制成功提示 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <span>富文本排版已成功复制！</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-normal">微信专用</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              前往微信公众平台后台，直接按 <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-700">Ctrl+V</kbd> / <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-700">⌘+V</kbd> 粘贴即可。
            </p>
          </div>
        </div>

        {/* 场景化推广推荐卡片 */}
        {sponsorConfig.copySuccessAd && (
          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <a
              href={sponsorConfig.copySuccessAd.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 hover:from-blue-100/80 hover:to-indigo-100/80 border border-blue-100/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                  <Sparkles size={11} />
                  <span>{sponsorConfig.copySuccessAd.tag}</span>
                </span>
                <span className="text-[11px] font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>{sponsorConfig.copySuccessAd.btnText}</span>
                  <ArrowRight size={12} />
                </span>
              </div>
              <h5 className="text-xs font-semibold text-gray-800 mt-1 group-hover:text-blue-700 transition-colors">
                {sponsorConfig.copySuccessAd.title}
              </h5>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {sponsorConfig.copySuccessAd.description}
              </p>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
