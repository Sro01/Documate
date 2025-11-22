export interface Message {
  role: 'user' | 'admin' | 'assistant';
  content: string;
  is_first?: boolean;
}

export interface ChatRequest {
  chatbot_id: string;
  session_id: string;
  messages: Message[];
}

export interface SupportingChunk {
  chunk_id: string;
  score: number;
  meta: {
    filename: string;
    page: number;
    manual_id: string;
  };
}

export type UncertaintyLevel = 'low' | 'medium' | 'high';

export interface ChatResponse {
  answer: string;
  supporting_chunks: SupportingChunk[];
  uncertainty: UncertaintyLevel;
  suggested_title?: string;
}

export interface ChatItem {
  id: string;
  session_id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  chatbot_id: string;
}

export interface ChatHistory {
  session_id: string;
  title: string;
  messages: Message[];
  chatbot_id: string;
  created_at: Date;
  updated_at: Date;
  isPinned?: boolean;
}
