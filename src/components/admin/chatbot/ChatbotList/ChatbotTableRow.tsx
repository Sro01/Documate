import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Chatbot } from '../../../../types/admin/chatbot';
import ToggleSwitch from '../../../common/ToggleSwitch';
import ConfirmModal from '../../../common/ConfirmModal';

interface ChatbotTableRowProps {
  chatbot: Chatbot;
  index: number;
  onAddManual?: (chatbotId: string) => void;
  onEditManual?: (chatbotId: string) => void;
  onDeleteManual?: (chatbotId: string) => void;
  onTogglePublic?: (chatbotId: string, isPublic: boolean) => void;
}

function ChatbotTableRow({
  chatbot,
  index,
  onTogglePublic
}: ChatbotTableRowProps) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPublicState, setPendingPublicState] = useState(false);

  const handleToggleClick = (newState: boolean) => {
    setPendingPublicState(newState);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    onTogglePublic?.(chatbot.chatbot_id, pendingPublicState);
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleRowClick = () => {
    navigate(`/admin/chatbot/${chatbot.chatbot_id}/manual`);
  };

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200 hover:cursor-pointer"
        onClick={handleRowClick}
      >
        <td className="px-6 py-5 text-center text-gray-600 font-medium">{index + 1}</td>
        <td className="px-6 py-5 text-center text-gray-800 font-semibold">
          {chatbot.name}
        </td>
        <td className="px-6 py-5 text-center text-gray-600">
          {chatbot.tag || <span className="text-gray-400">-</span>}
        </td>
        <td className="px-6 py-5 text-center text-gray-600">
          {chatbot.description || <span className="text-gray-400">-</span>}
        </td>
        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-2">
            <ToggleSwitch
              checked={chatbot.is_public}
              onChange={handleToggleClick}
            />
            <span className={`w-12 text-left ${chatbot.is_public ? 'text-green-600' : 'text-gray-500'}`}>
              {chatbot.is_public ? '공개' : '비공개'}
            </span>
          </div>
        </td>
      </tr>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="공개 상태 변경"
        message={`해당 챗봇을 ${pendingPublicState ? '공개' : '비공개'}로 전환합니다.`}
        confirmText="확인"
        cancelText="취소"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default ChatbotTableRow;
