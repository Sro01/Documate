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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">챗봇별 상세</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">챗봇명</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">질의 수</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">비율</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((chatbot) => (
              <tr
                key={chatbot.chatbot_id}
                onClick={() => onSelectChatbot(chatbot.chatbot_id)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedChatbotId === chatbot.chatbot_id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-3 px-4 text-gray-900">{chatbot.chatbot_name || chatbot.chatbot_id.slice(0, 8)}</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {chatbot.queries.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-gray-500">
                  {calculatePercent(chatbot.queries)}%
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
