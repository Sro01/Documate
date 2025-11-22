import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types/chat';
import {
  getChatHistory,
  addMessageToSession,
  updateSessionMessages,
} from '../utils/chatStorage';

interface UseChatMessagesProps {
  sessionId: string | null;
  onMessagesChange?: () => void;
}

/**
 * 특정 세션의 메시지를 관리하는 커스텀 훅
 */
export function useChatMessages({ sessionId, onMessagesChange }: UseChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 세션이 변경되면 해당 세션의 메시지 로드
  useEffect(() => {
    console.log('useChatMessages - sessionId 변경됨:', sessionId);
    if (sessionId) {
      const session = getChatHistory(sessionId);
      console.log('useChatMessages - 로드된 세션:', session);
      if (session) {
        console.log('useChatMessages - 메시지 개수:', session.messages.length);
        setMessages(session.messages);
      } else {
        console.log('useChatMessages - 세션을 찾을 수 없음');
        setMessages([]);
      }
    } else {
      console.log('useChatMessages - sessionId가 null');
      setMessages([]);
    }
  }, [sessionId]);

  /**
   * 새 메시지 추가
   */
  const addMessage = useCallback((message: Message) => {
    if (!sessionId) return;

    const updatedSession = addMessageToSession(sessionId, message);
    if (updatedSession) {
      setMessages(updatedSession.messages);
      onMessagesChange?.();
    }
  }, [sessionId, onMessagesChange]);

  /**
   * 사용자 메시지 전송 (로컬에만 저장)
   */
  const sendUserMessage = useCallback((content: string) => {
    if (!sessionId || !content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
    };

    addMessage(userMessage);
  }, [sessionId, addMessage]);

  /**
   * 봇 응답 추가 (로컬에만 저장)
   */
  const addBotResponse = useCallback((content: string) => {
    if (!sessionId) return;

    const botMessage: Message = {
      role: 'assistant',
      content,
    };

    addMessage(botMessage);
  }, [sessionId, addMessage]);

  /**
   * 메시지 수정
   */
  const editMessage = useCallback((index: number, newContent: string) => {
    if (!sessionId || index < 0 || index >= messages.length) return;

    const updatedMessages = [...messages];
    updatedMessages[index] = {
      ...updatedMessages[index],
      content: newContent,
    };

    const updatedSession = updateSessionMessages(sessionId, updatedMessages);
    if (updatedSession) {
      setMessages(updatedSession.messages);
      onMessagesChange?.();
    }
  }, [sessionId, messages, onMessagesChange]);

  /**
   * 메시지 삭제
   */
  const deleteMessage = useCallback((index: number) => {
    if (!sessionId || index < 0 || index >= messages.length) return;

    const updatedMessages = messages.filter((_, i) => i !== index);
    const updatedSession = updateSessionMessages(sessionId, updatedMessages);
    if (updatedSession) {
      setMessages(updatedSession.messages);
      onMessagesChange?.();
    }
  }, [sessionId, messages, onMessagesChange]);

  /**
   * 모든 메시지 삭제
   */
  const clearMessages = useCallback(() => {
    if (!sessionId) return;

    const updatedSession = updateSessionMessages(sessionId, []);
    if (updatedSession) {
      setMessages([]);
      onMessagesChange?.();
    }
  }, [sessionId, onMessagesChange]);

  return {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    sendUserMessage,
    addBotResponse,
    editMessage,
    deleteMessage,
    clearMessages,
  };
}
