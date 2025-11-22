import { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, Pin, PinOff, Pencil, Trash2 } from 'lucide-react';

interface ChatListItemProps {
  title: string;
  lastMessage: string;
  isSelected: boolean;
  isPinned?: boolean;
  onClick: () => void;
  onPin?: () => void;
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
}

function ChatListItem({
  title,
  lastMessage,
  isSelected,
  isPinned = false,
  onClick,
  onPin,
  onRename,
  onDelete,
}: ChatListItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // 이름 변경 모드 진입 시 input에 포커스
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin?.();
    setShowMenu(false);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setShowMenu(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
    setShowMenu(false);
  };

  const handleRenameSubmit = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onRename?.(editedTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setEditedTitle(title);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-full text-left px-3 py-2 rounded-2xl transition-colors cursor-pointer ${
          isSelected
            ? 'bg-blue-200'
            : 'hover:bg-gray-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex-1 min-w-0"
            onClick={onClick}
          >
            {isRenaming ? (
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 text-sm font-medium border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className={`text-sm font-medium truncate ${
                isSelected
                  ? 'text-blue-600'
                  : 'text-gray-800 group-hover:text-blue-600'
              }`}>
                {title}
              </p>
            )}
            {lastMessage && !isRenaming && (
              <p className="text-xs text-gray-400 mt-1 truncate">
                {lastMessage}
              </p>
            )}
          </div>

          {/* 고정 아이콘 또는 메뉴 버튼 */}
          <div className="relative flex-shrink-0 self-center" ref={menuRef}>
            {isPinned && !isHovered && !showMenu ? (
              <div className="p-1">
                <Pin size={16} className="text-gray-800" />
              </div>
            ) : (
              <div className={`transition-opacity ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={handleMenuClick}
                  className="p-1 hover:bg-gray-400 rounded-full transition-colors"
                >
                  <EllipsisVertical size={16} className="text-gray-600" />
                </button>
              </div>
            )}

            {/* 드롭다운 메뉴 */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {onPin && (
                  <button
                    onClick={handlePinClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    {isPinned ? (
                      <>
                        <PinOff size={16} />
                        <span>고정 해제</span>
                      </>
                    ) : (
                      <>
                        <Pin size={16} />
                        <span>고정하기</span>
                      </>
                    )}
                  </button>
                )}
                {onRename && (
                  <button
                    onClick={handleRenameClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    <span>제목 변경</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={16} />
                    <span>채팅 삭제</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
