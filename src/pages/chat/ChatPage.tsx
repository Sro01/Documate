import { useChatContext } from '../../contexts/ChatContext';
import { useChatMessages } from '../../hooks/useChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import UserMessage from '../../components/chat/UserMessage';
import BotMessage from '../../components/chat/BotMessage';
import { simulateBotResponse } from '../../utils/dummyData';

function ChatPage() {
  const { currentSessionId, createNewChat, refreshChatHistories } = useChatContext();

  const {
    messages,
    sendUserMessage,
    addBotResponse,
    editMessage,
    isLoading,
    setIsLoading,
  } = useChatMessages({ sessionId: currentSessionId, onMessagesChange: refreshChatHistories });

  const handleSendMessage = (message: string, chatbotId: string) => {
    console.log('메시지 전송:', message, '챗봇 ID:', chatbotId);

    // 세션이 없으면 새 채팅 생성
    if (!currentSessionId) {
      createNewChat(chatbotId);
      // 새 세션이 생성된 후에는 다음 렌더링에서 메시지가 저장되므로
      // useChatMessages가 새 세션을 감지할 때까지 기다림
      setTimeout(() => {
        sendUserMessage(message);
        setIsLoading(true);
        simulateBotResponse(message, (response) => {
          addBotResponse(response);
          setIsLoading(false);
        }, 1000);
      }, 100);
      return;
    }

    sendUserMessage(message);

    // 더미 봇 응답 시뮬레이션
    setIsLoading(true);
    simulateBotResponse(message, (response) => {
      addBotResponse(response);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditMessage = (index: number, newContent: string) => {
    editMessage(index, newContent);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="h-[calc(100vh-70px)] flex flex-col relative">
      {hasMessages ? (
        // 메시지가 있을 때
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
                    chatbotName="DoQ-Mate"
                  />
                )
              ))}
              {isLoading && (
                <BotMessage
                  content="..."
                  chatbotName="DoQ-Mate"
                />
              )}
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
        // 메시지가 없을 때
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
