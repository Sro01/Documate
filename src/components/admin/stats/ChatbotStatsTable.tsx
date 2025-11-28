import type { ChatbotQueryCount } from '../../../types/admin/stats';

interface ChatbotStatsTableProps {
  data: ChatbotQueryCount[];
  totalQueries: number;
  onSelectChatbot: (chatbotId: string) => void;
  selectedChatbotId: string | null;
}

function ChatbotStatsTable({
  data,
  totalQueries,
  onSelectChatbot,
  selectedChatbotId,
}: ChatbotStatsTableProps) {
  const sortedData = [...data].sort((a, b) => b.queries - a.queries);

  const calculatePercent = (queries: number) => {
    if (totalQueries === 0) return '0.0';
    return ((queries / totalQueries) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">챗봇별 상세</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 rounded-lg">
              <th className="text-left py-4 px-5 font-semibold text-gray-600 rounded-l-lg">챗봇명</th>
              <th className="text-center py-4 px-5 font-semibold text-gray-600">질의 수</th>
              <th className="text-center py-4 px-5 font-semibold text-gray-600 rounded-r-lg">비율</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((chatbot, index) => (
              <tr
                key={chatbot.chatbot_id}
                onClick={() => onSelectChatbot(chatbot.chatbot_id)}
                className={`cursor-pointer transition-all ${
                  selectedChatbotId === chatbot.chatbot_id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                } ${index !== sortedData.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                      {(chatbot.chatbot_id.slice(0, 2)).slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-900">{chatbot.chatbot_name || chatbot.chatbot_id.slice(0, 8)}</span>
                  </div>
                </td>
                <td className="py-4 px-5 text-center font-semibold text-gray-900">
                  {chatbot.queries.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {calculatePercent(chatbot.queries)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChatbotStatsTable;
