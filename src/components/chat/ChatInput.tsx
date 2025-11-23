import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import type { Chatbot } from '../../types/admin/chatbot';
import { dummyChatbots } from '../../utils/dummyData';

interface ChatInputProps {
  onSendMessage: (message: string, chatbotId: string) => void;
  disabled?: boolean;
}

function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatbots] = useState<Chatbot[]>(dummyChatbots);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(dummyChatbots[0]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (!message.trim() || !selectedChatbot || disabled) return;

    onSendMessage(message.trim(), selectedChatbot.chatbot_id);
    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 조합 중일 때는 Enter 키를 무시
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-4xl border border-gray-300 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask DoQ-Mate"
            disabled={disabled}
            rows={1}
            className="w-full px-6 pt-5 pb-4 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
            style={{ maxHeight: '200px' }}
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-2xl transition-colors"
                disabled={disabled}
              >
                <span>
                  {selectedChatbot ? selectedChatbot.name : 'Chatbots'}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto z-10">
                  {chatbots.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      사용 가능한 챗봇이 없습니다
                    </div>
                  ) : (
                    chatbots.map((chatbot) => (
                      <button
                        key={chatbot.chatbot_id}
                        onClick={() => {
                          setSelectedChatbot(chatbot);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                          selectedChatbot?.chatbot_id === chatbot.chatbot_id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-800'
                        }`}
                      >
                        <div className="font-medium">{chatbot.name}</div>
                        {chatbot.description && (
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {chatbot.description}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={disabled || !message.trim() || !selectedChatbot}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
