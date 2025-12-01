import { useState } from 'react';
import { Bot } from 'lucide-react';
import CopyButton from '../common/CopyButton';
import type { ChatImage } from '../../types/chat/chat';

interface BotMessageProps {
  content?: string;
  isLoading?: boolean;
  chatbotName?: string;
  images?: ChatImage[];
}

function BotMessage({ content, isLoading = false, chatbotName = 'DoQ-Mate', images }: BotMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasContent = !isLoading && content;

  return (
    <div
      className="flex gap-4 mb-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 봇 아이콘 */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Bot size={25} className="text-blue-700" />
        </div>

        {/* 로딩 애니메이션 */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-10 h-10 animate-spin" viewBox="0 0 40 40">
              <defs>
                <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-blue-600 opacity-25"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="url(#spinnerGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="90 150"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 min-w-0 relative">
        {/* 챗봇 이름 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">
          {chatbotName}
        </div>

        {/* 이미지 표시 */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img) => (
              <img
                key={img.id}
                src={`data:${img.mime_type};base64,${img.data}`}
                alt={img.description || ''}
                className="h-24 sm:h-32 md:h-40 rounded-lg object-contain border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(`data:${img.mime_type};base64,${img.data}`, '_blank')}
              />
            ))}
          </div>
        )}

        {/* 응답 상태 또는 내용 */}
        {isLoading ? (
          <div className="text-gray-500 italic">응답 중...</div>
        ) : content ? (
          <>
            <div className="text-gray-800 whitespace-pre-wrap break-words">
              {content}
            </div>

            {/* 복사 버튼 */}
            {hasContent && (
              <div
                className={`mt-3 transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <CopyButton content={content} />
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default BotMessage;
