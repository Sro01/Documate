import type { ChatHistory, Message } from '../types/chat';

const STORAGE_KEY = 'doqmate_chat_histories';

/**
 * 로컬 스토리지에서 모든 채팅 기록을 가져옵니다.
 */
export function getAllChatHistories(): ChatHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const histories = JSON.parse(stored) as ChatHistory[];
    // Date 객체로 변환
    return histories.map(history => ({
      ...history,
      created_at: new Date(history.created_at),
      updated_at: new Date(history.updated_at),
    }));
  } catch (error) {
    console.error('채팅 기록 로드 실패:', error);
    return [];
  }
}

/**
 * 특정 세션의 채팅 기록을 가져옵니다.
 */
export function getChatHistory(sessionId: string): ChatHistory | null {
  const histories = getAllChatHistories();
  return histories.find(h => h.session_id === sessionId) || null;
}

/**
 * 새로운 채팅 세션을 생성합니다.
 */
export function createChatSession(chatbotId: string): ChatHistory {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  const newSession: ChatHistory = {
    session_id: crypto.randomUUID(),
    title: `새 채팅 ${year}/${month}/${day} ${hour}:${minute}`,
    messages: [],
    chatbot_id: chatbotId,
    created_at: now,
    updated_at: now,
  };

  const histories = getAllChatHistories();
  histories.unshift(newSession); // 최신 채팅을 앞에 추가
  saveAllChatHistories(histories);

  return newSession;
}

/**
 * 채팅 세션에 메시지를 추가합니다.
 */
export function addMessageToSession(
  sessionId: string,
  message: Message
): ChatHistory | null {

  const histories = getAllChatHistories();
  const sessionIndex = histories.findIndex(h => h.session_id === sessionId);

  if (sessionIndex === -1) {
    return null;
  }

  const session = histories[sessionIndex];
  session.messages.push(message);
  session.updated_at = new Date();

  // 첫 번째 사용자 메시지를 제목으로 설정
  if (session.title.startsWith('새 채팅') && message.role === 'user' && session.messages.length === 1) {
    session.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
  }

  saveAllChatHistories(histories);

  // 커스텀 이벤트 발생 (useChatMessages에서 감지)
  const event = new CustomEvent('chatStorageUpdated', {
    detail: { sessionId }
  });
  window.dispatchEvent(event);

  return session;
}

/**
 * 채팅 세션의 메시지를 업데이트합니다.
 */
export function updateSessionMessages(
  sessionId: string,
  messages: Message[]
): ChatHistory | null {
  const histories = getAllChatHistories();
  const sessionIndex = histories.findIndex(h => h.session_id === sessionId);

  if (sessionIndex === -1) return null;

  const session = histories[sessionIndex];
  session.messages = messages;
  session.updated_at = new Date();

  saveAllChatHistories(histories);
  return session;
}

/**
 * 채팅 세션의 제목을 업데이트합니다.
 */
export function updateSessionTitle(
  sessionId: string,
  title: string
): ChatHistory | null {
  const histories = getAllChatHistories();
  const sessionIndex = histories.findIndex(h => h.session_id === sessionId);

  if (sessionIndex === -1) return null;

  const session = histories[sessionIndex];
  session.title = title;
  session.updated_at = new Date();

  saveAllChatHistories(histories);
  return session;
}

/**
 * 채팅 세션을 삭제합니다.
 */
export function deleteChatSession(sessionId: string): boolean {
  const histories = getAllChatHistories();
  const filtered = histories.filter(h => h.session_id !== sessionId);

  if (filtered.length === histories.length) return false;

  saveAllChatHistories(filtered);
  return true;
}

/**
 * 모든 채팅 기록을 로컬 스토리지에 저장합니다.
 */
function saveAllChatHistories(histories: ChatHistory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
  } catch (error) {
  }
}

/**
 * 채팅 세션의 고정 상태를 토글합니다.
 */
export function togglePinSession(sessionId: string): ChatHistory | null {
  const histories = getAllChatHistories();
  const sessionIndex = histories.findIndex(h => h.session_id === sessionId);

  if (sessionIndex === -1) return null;

  const session = histories[sessionIndex];
  session.isPinned = !session.isPinned;
  session.updated_at = new Date();

  saveAllChatHistories(histories);
  return session;
}

/**
 * 모든 채팅 기록을 삭제합니다.
 */
export function clearAllChatHistories(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('채팅 기록 삭제 실패:', error);
  }
}
