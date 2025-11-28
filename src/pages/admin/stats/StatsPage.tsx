import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import TabNav from '../../../components/common/TabNav';
import StatCard from '../../../components/admin/stats/StatCard';
import DateRangeFilter, { type DateRange } from '../../../components/admin/stats/DateRangeFilter';
import QueriesByDateChart from '../../../components/admin/stats/QueriesByDateChart';
import QueriesByChatbotChart from '../../../components/admin/stats/QueriesByChatbotChart';
import ChatbotStatsTable from '../../../components/admin/stats/ChatbotStatsTable';
import { useGetOverviewStats, useGetChatbotStats } from '../../../hooks/admin/useStats';
import type { OverviewStatsResponseData, ChatbotStatsResponseData, DateQueryCount } from '../../../types/admin/stats';

type StatsTab = 'date' | 'chatbot';

const STATS_TABS = [
  { key: 'date' as const, label: '날짜별' },
  { key: 'chatbot' as const, label: '챗봇별' },
];

function StatsPage() {
  const [activeTab, setActiveTab] = useState<StatsTab>('date');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [overviewStats, setOverviewStats] = useState<OverviewStatsResponseData | null>(null);
  const [selectedChatbotId, setSelectedChatbotId] = useState<string | null>(null);
  const [chatbotStats, setChatbotStats] = useState<ChatbotStatsResponseData | null>(null);

  const { getOverviewStats, isLoading: isOverviewLoading, error: overviewError } = useGetOverviewStats();
  const { getChatbotStats, isLoading: isChatbotLoading } = useGetChatbotStats();

  useEffect(() => {
    const fetchOverview = async () => {
      const data = await getOverviewStats();
      if (data) {
        setOverviewStats(data);
        // 첫 번째 챗봇 자동 선택
        if (data.by_chatbot.length > 0) {
          setSelectedChatbotId(data.by_chatbot[0].chatbot_id);
        }
      }
    };
    fetchOverview();
  }, []);

  useEffect(() => {
    if (!selectedChatbotId) {
      setChatbotStats(null);
      return;
    }

    const fetchChatbotStats = async () => {
      const data = await getChatbotStats(selectedChatbotId);
      if (data) {
        setChatbotStats(data);
      }
    };
    fetchChatbotStats();
  }, [selectedChatbotId]);

  const filterByDateRange = (data: DateQueryCount[]): DateQueryCount[] => {
    if (dateRange === 'all') return data;

    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return data.filter((item) => new Date(item.date) >= cutoffDate);
  };

  const filteredDateData = useMemo(() => {
    if (!overviewStats) return [];
    return filterByDateRange(overviewStats.by_date);
  }, [overviewStats, dateRange]);

  const filteredChatbotDateData = useMemo(() => {
    if (!chatbotStats) return [];
    return filterByDateRange(chatbotStats.by_date);
  }, [chatbotStats, dateRange]);

  const handleSelectChatbot = (chatbotId: string) => {
    setSelectedChatbotId(chatbotId);
  };

  if (isOverviewLoading) {
    return (
      <main className="flex-1 p-8">
        <PageHeader title="통계 대시보드" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (overviewError) {
    return (
      <main className="flex-1 p-8">
        <PageHeader title="통계 대시보드" />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{overviewError}</p>
        </div>
      </main>
    );
  }

  if (!overviewStats) {
    return (
      <main className="flex-1 p-8">
        <PageHeader title="통계 대시보드" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">데이터가 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="flex items-center ">
        <PageHeader title="통계 대시보드" />
      </div>

      <div className="flex items-center justify-end mb-6">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="전체 질의 수" value={overviewStats.total_queries} />
        <StatCard title="고유 사용자 수" value={overviewStats.unique_clients} />
        <StatCard title="챗봇 수" value={overviewStats.by_chatbot.length} />
      </div>

      {/* 탭 네비게이션 */}
      <TabNav tabs={STATS_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* 날짜별 탭 */}
      {activeTab === 'date' && (
        <div className="mt-6">
          <QueriesByDateChart data={filteredDateData} />
        </div>
      )}

      {/* 챗봇별 탭 */}
      {activeTab === 'chatbot' && (
        <div className="mt-6 space-y-6">
          {/* 챗봇별 분포 차트 */}
          <QueriesByChatbotChart data={overviewStats.by_chatbot} />

          {/* 챗봇별 상세 테이블 */}
          <ChatbotStatsTable
            data={overviewStats.by_chatbot}
            totalQueries={overviewStats.total_queries}
            onSelectChatbot={handleSelectChatbot}
            selectedChatbotId={selectedChatbotId}
          />

          {/* 선택된 챗봇의 날짜별 추이 */}
          {selectedChatbotId && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {chatbotStats?.chatbot_name || chatbotStats?.chatbot_id.slice(0, 8) || '선택된 챗봇'} - 날짜별 질의 추이
              </h3>
              {isChatbotLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">로딩 중...</p>
                </div>
              ) : chatbotStats ? (
                <QueriesByDateChart data={filteredChatbotDateData} />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">데이터를 불러오는 중...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default StatsPage;
