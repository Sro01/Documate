import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import type { ChatItem } from '../../types/chat';

interface UserSidebarContentProps {
  isCollapsed: boolean;
}

function UserSidebarContent({ isCollapsed }: UserSidebarContentProps) {
  // TODO: 나중에 커스텀 Hook으로 분리 예정 (예: useChatList)
  const [chatList] = useState<ChatItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  const handleNewChat = () => {
    const newSessionId = crypto.randomUUID();
    setCurrentSessionId(newSessionId);
    // TODO: API 호출 - 새 채팅 세션 생성
  };

  const handleChatSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // TODO: API 호출 - 선택한 채팅 세션 불러오기
  };

  return (
    <>
      <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isCollapsed && (
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/10 rounded-lg transition-colors"
          >
            <SquarePen size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">새 채팅</span>
          </button>
        )}
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {!isCollapsed && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 px-2 mb-3">최근 채팅</h3>
              {chatList.length === 0 ? (
                <p className="text-sm text-gray-400 px-2 py-4 text-center">
                  채팅 기록이 없습니다
                </p>
              ) : (
                chatList.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.session_id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                      currentSessionId === chat.session_id
                        ? 'bg-white border border-blue-300'
                        : 'hover:bg-white'
                    }`}
                  >
                    <p className={`text-sm font-medium truncate ${
                      currentSessionId === chat.session_id
                        ? 'text-blue-600'
                        : 'text-gray-800 group-hover:text-blue-600'
                    }`}>
                      {chat.title}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {chat.lastMessage}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.timestamp.toLocaleDateString('ko-KR')}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default UserSidebarContent;
