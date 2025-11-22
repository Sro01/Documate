import { SquarePen } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { updateSessionTitle, togglePinSession } from '../../utils/chatStorage';
import ChatListItem from './ChatListItem';

interface UserSidebarContentProps {
  isCollapsed: boolean;
}

function UserSidebarContent({
  isCollapsed,
}: UserSidebarContentProps) {
  const {
    chatHistories,
    currentSessionId,
    createNewChat,
    selectChat,
    deleteChat,
    refreshChatHistories,
  } = useChatContext();

  const handleNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (sessionId: string) => {
    selectChat(sessionId);
  };

  const handleRename = (sessionId: string, newTitle: string) => {
    updateSessionTitle(sessionId, newTitle);
    refreshChatHistories();
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('이 채팅을 삭제하시겠습니까?')) {
      deleteChat(sessionId);
    }
  };

  const handlePin = (sessionId: string) => {
    togglePinSession(sessionId);
    refreshChatHistories();
  };

  const sortedChats = [...chatHistories].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <>
      <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isCollapsed && (
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-300 rounded-4xl transition-colors"
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
              {sortedChats.length === 0 ? (
                <p className="text-sm text-gray-400 px-2 py-4 text-center">
                  채팅 기록이 없습니다
                </p>
              ) : (
                sortedChats.map((chat) => {
                  const lastMessage = chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].content
                    : '';

                  return (
                    <ChatListItem
                      key={chat.session_id}
                      title={chat.title}
                      lastMessage={lastMessage}
                      isSelected={currentSessionId === chat.session_id}
                      isPinned={chat.isPinned}
                      onClick={() => handleChatSelect(chat.session_id)}
                      onPin={() => handlePin(chat.session_id)}
                      onRename={(newTitle) => handleRename(chat.session_id, newTitle)}
                      onDelete={() => handleDelete(chat.session_id)}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default UserSidebarContent;
