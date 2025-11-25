import { useState, useEffect } from 'react';
import type { Admin } from '../../../types/auth/auth';
import Button from '../../../components/common/Button';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useGetAdmins, useDeleteAdmin } from '../../../hooks/admin/useAdmin';

function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const { getAdmins, isLoading: isLoadingAdmins, error: fetchError } = useGetAdmins();
  const { deleteAdmin, isLoading: isDeleting, error: deleteError } = useDeleteAdmin();

  // 컴포넌트 마운트 시 관리자 목록 조회
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    const data = await getAdmins();
    if (data && data.admins) {
      setAdmins(data.admins);
    }
  };

  const handleRemove = async () => {
    if (!selectedAdmin) return;

    const success = await deleteAdmin(selectedAdmin.admin_id);

    if (success) {
      setAdmins(prev => prev.filter(a => a.admin_id !== selectedAdmin.admin_id));
      alert(`${selectedAdmin.name}님이 추방되었습니다.`);
    } else {
      alert(deleteError || '추방에 실패했습니다.');
    }

    setShowRemoveModal(false);
    setSelectedAdmin(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <main className="flex-1 p-8">
        <PageHeader title="관리자 목록" />

        {isLoadingAdmins ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-red-500">{fetchError}</p>
            <Button className="mt-4" onClick={loadAdmins}>다시 시도</Button>
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">등록된 관리자가 없습니다</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                <tr>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    No.
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    이름
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    아이디
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    가입 일시
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin.admin_id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <td className="px-6 py-5 text-center text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-800">
                      {admin.name}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-800 font-semibold">
                      {admin.username}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-600">
                      {admin.created_at ? formatDate(admin.created_at) : '-'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="red"
                          size="small"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowRemoveModal(true);
                          }}
                          disabled={isDeleting}
                        >
                          추방
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* 추방 확인 모달 */}
      <ConfirmModal
        isOpen={showRemoveModal}
        title="관리자 추방"
        message={`${selectedAdmin?.name}(${selectedAdmin?.username})님을 추방하시겠습니까?`}
        confirmText="추방"
        cancelText="취소"
        onConfirm={handleRemove}
        onCancel={() => {
          setShowRemoveModal(false);
          setSelectedAdmin(null);
        }}
      />
    </>
  );
}

export default AdminListPage;
