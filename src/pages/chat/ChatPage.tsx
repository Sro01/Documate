import { useState } from 'react';
import ChatInput from '../../components/chat/ChatInput';
import UserMessage from '../../components/chat/UserMessage';
import BotMessage from '../../components/chat/BotMessage';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  isLoading?: boolean;
}

function ChatPage() {
  // TODO: 채팅 메시지 표시 및 API 연동
  const [messages] = useState<ChatMessage[]>([
    { role: 'user', content: '로컬푸드에 대해서 설명해줘' },
    { role: 'bot', content: "로컬푸드(Local Food)란 장거리 운송을 거치지 않고 생산지로부터 반경 50km 이내의 가까운 지역에서 소비되는 농산물을 의미합니다.\n\n[주요 특징 및 장점]\n1. 신선도와 안전성: 복잡한 유통 과정을 생략하여 수확 후 소비까지의 시간이 짧아 신선하며, 누가 생산했는지 알 수 있어 신뢰할 수 있습니다.\n2. 환경 보호: 이동 거리를 뜻하는 '푸드 마일리지'가 줄어들어 운송 과정에서 발생하는 이산화탄소 배출을 억제합니다.\n3. 지역 경제 상생: 유통 마진을 줄임으로써 생산자에게는 정당한 소득을, 소비자에게는 합리적인 가격을 제공하여 지역 경제를 활성화합니다.\n\n즉, 로컬푸드는 건강한 식탁과 지속 가능한 농업 환경을 만드는 윤리적 소비 운동입니다." },
    { role: 'user', content: '길기길고길기딘유저메세지 '.repeat(100) },
    { role: 'bot', content: '', isLoading: true },
  ]); // 임시 메시지 상태

  const handleSendMessage = (message: string, chatbotId: string) => {
    console.log('메시지 전송:', message, '챗봇 ID:', chatbotId);
    // TODO: API 호출 - 메시지 전송
  };

  const handleEditMessage = (index: number, newContent: string) => {
    console.log('메시지 수정:', index, newContent);
    // TODO: 메시지 수정 로직
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="h-[calc(100vh-70px)] flex flex-col relative">
      {hasMessages ? (
        // 메시지가 있을 때: 일반 레이아웃
        <>
          <div className="flex-1 overflow-y-auto p-6 pb-[200px]">
            <div className="max-w-4xl mx-auto">
              {messages.map((msg, index) => (
                msg.role === 'user' ? (
                  <UserMessage
                    key={index}
                    content={msg.content}
                    onEdit={(newContent) => handleEditMessage(index, newContent)}
                  />
                ) : (
                  <BotMessage
                    key={index}
                    content={msg.content}
                    isLoading={msg.isLoading}
                    chatbotName="DoQ-Mate"
                  />
                )
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <div className="h-16 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            <div className="pointer-events-auto">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </>
      ) : (
        // 메시지가 없을 때: 입력창을 중앙에 배치
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </main>
  );
}

export default ChatPage;
