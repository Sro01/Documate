import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Chatbot } from '../../../types/admin/chatbot';
import Button from '../../../components/common/Button';
import ChatbotTable from '../../../components/admin/chatbot/ChatbotList/ChatbotTable';

function ChatbotListPage() {
  const navigate = useNavigate();

  // 임시 데이터 (나중에 API 호출로 대체)
  const [chatbots, setChatbots] = useState<Chatbot[]>([
  {
    "chatbot_id": "bot_0001", // 서버 자동 생성
    "name": "사내 매뉴얼 챗봇",
    "description": "사내 매뉴얼 관련한 응답을 주는 챗봇",
    "is_public": true,
    "tag": "직원",
    "created_at": "2025-01-01T00:00:00Z",
  },
  {
    "chatbot_id": "bot_0002",
    "name": "외부 고객 FAQ 봇",
    "description": "외부 고객용 FAQ 응답 챗봇",
    "is_public": false,
    "tag": "소비자",
    "created_at": "2025-02-15T00:00:00Z",
  }
  ]);

  const handleCreateChatbot = () => {
    navigate('/admin/chatbot/create');
  };

  const handleAddManual = (chatbotId: string) => {
    navigate(`/admin/chatbot/${chatbotId}/manual`);
  };

  const handleEditManual = (chatbotId: string) => {
    console.log('매뉴얼 수정:', chatbotId);
    // TODO: 매뉴얼 수정 로직
  };

  const handleDeleteManual = (chatbotId: string) => {
    console.log('매뉴얼 삭제:', chatbotId);
    // TODO: 매뉴얼 삭제 확인 모달 + 삭제 로직
  };

  const handleTogglePublic = (chatbotId: string, isPublic: boolean) => {
    // TODO: API 호출로 공개 상태 변경
    setChatbots(prevChatbots =>
      prevChatbots.map(chatbot =>
        chatbot.chatbot_id === chatbotId
          ? { ...chatbot, is_public: isPublic }
          : chatbot
      )
    );
  };

  return (
    <>
      <main className="flex-1 p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">챗봇 리스트</h1>
            <Button variant="outline" onClick={handleCreateChatbot}>
              챗봇 생성
            </Button>
        </div>

        <ChatbotTable
          chatbots={chatbots}
          onAddManual={handleAddManual}
          onEditManual={handleEditManual}
          onDeleteManual={handleDeleteManual}
          onTogglePublic={handleTogglePublic}
        />
      </main>
    </>
  );
}

export default ChatbotListPage;
