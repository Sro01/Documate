import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DateQueryCount } from '../../../types/admin/stats';

interface QueriesByDateChartProps {
  data: DateQueryCount[];
}

function QueriesByDateChart({ data }: QueriesByDateChartProps) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formattedData = sortedData.map((item) => ({
    ...item,
    displayDate: item.date.slice(5), // "2025-11-15" -> "11-15"
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">날짜별 질의 추이</h3>
      <div style={{ width: '100%', minHeight: 256 }}>
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(label) => `날짜: ${label}`}
              formatter={(value: number) => [value.toLocaleString(), '질의 수']}
            />
            <Line
              type="monotone"
              dataKey="queries"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default QueriesByDateChart;
