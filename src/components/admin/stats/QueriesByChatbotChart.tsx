import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChatbotQueryCount } from '../../../types/admin/stats';

interface QueriesByChatbotChartProps {
  data: ChatbotQueryCount[];
}

function QueriesByChatbotChart({ data }: QueriesByChatbotChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.queries - a.queries)
    .map((item) => ({
      ...item,
      chatbot_name: item.chatbot_name || item.chatbot_id.slice(0, 8),
    }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">챗봇별 질의 분포</h3>
      <div style={{ width: '100%', minHeight: 256 }}>
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chatbot_name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), '질의 수']}
            />
            <Bar dataKey="queries" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default QueriesByChatbotChart;
