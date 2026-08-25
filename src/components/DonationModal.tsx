import React from 'react';
import { X, Heart, Coffee, ExternalLink } from 'lucide-react';
import { sponsorConfig } from '../config/sponsors';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-100 animate-scaleUp">
        {/* 顶部彩色装饰条 */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-pink-500 to-amber-400" />
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Heart size={20} className="fill-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{sponsorConfig.donation.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{sponsorConfig.donation.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 赞赏与支持通道 */}
          <div className="my-5 p-5 bg-gradient-to-b from-amber-50/60 to-orange-50/30 rounded-xl border border-amber-100/80 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-2.5 shadow-sm">
              <Coffee size={28} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">免费支持作者的方式 💡</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
              如果您有云服务器、算力或建站需求，可以通过以下官方特惠通道选购，您可享受专属折扣，同时也能为作者提供一份支持：
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={sponsorConfig.bottomStatusAd.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-200/70 hover:border-blue-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    ☁️ 腾讯云 WorkBuddy 上云专区
                  </span>
                </div>
                <span className="text-[11px] text-blue-600 font-medium flex items-center gap-0.5">
                  <span>直达特惠</span>
                  <ExternalLink size={11} />
                </span>
              </a>

              <a
                href={sponsorConfig.copySuccessAd.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-200/70 hover:border-orange-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    🔶 阿里云跨端算力专享礼包
                  </span>
                </div>
                <span className="text-[11px] text-orange-600 font-medium flex items-center gap-0.5">
                  <span>领取权益</span>
                  <ExternalLink size={11} />
                </span>
              </a>
            </div>
            
            <p className="text-[11px] text-amber-800/70 mt-3.5">
              感谢每一位老师、同学与创作者的陪伴与支持！
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              稍后再说
            </button>
            <a
              href="https://github.com/gongzyes/mdwechat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              <span>GitHub Star 支持</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
