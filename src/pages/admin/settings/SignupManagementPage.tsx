import { useState } from 'react';
import type { Signup } from '../../../types/auth/signup';
import Button from '../../../components/common/Button';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';

function SignupManagementPage() {
  // TODO: API로 가입 신청 목록 가져오기 (GET /api/signup)
  const [signups, setSignups] = useState<Signup[]>([
    {
      signup_id: 'signup_0001',
      username: 'testuser1',
      name: '김테스트',
      created_at: '2025-01-15T10:30:00Z',
    },
    {
      signup_id: 'signup_0002',
      username: 'testuser2',
      name: '이테스트',
      created_at: '2025-01-16T14:20:00Z',
    },
  ]);

  const [selectedSignup, setSelectedSignup] = useState<Signup | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async () => {
    if (!selectedSignup) return;

    try {
      // TODO: API 호출 (POST /api/signup/{signup_id}/approve)
      await new Promise(resolve => setTimeout(resolve, 500));

      setSignups(prev => prev.filter(s => s.signup_id !== selectedSignup.signup_id));
      alert(`${selectedSignup.name}님의 가입이 승인되었습니다.`);
    } catch (error) {
      alert('승인에 실패했습니다.');
    } finally {
      setShowApproveModal(false);
      setSelectedSignup(null);
    }
  };

  const handleReject = async () => {
    if (!selectedSignup) return;

    try {
      // TODO: API 호출 (POST /api/signup/{signup_id}/reject)
      await new Promise(resolve => setTimeout(resolve, 500));

      setSignups(prev => prev.filter(s => s.signup_id !== selectedSignup.signup_id));
      alert(`${selectedSignup.name}님의 가입 신청이 반려되었습니다.`);
    } catch (error) {
      alert('반려에 실패했습니다.');
    } finally {
      setShowRejectModal(false);
      setSelectedSignup(null);
    }
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
        <PageHeader title="가입 신청 관리" />

        {signups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">대기 중인 가입 신청이 없습니다</p>
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
                    아이디
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    이름
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    신청일시
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-black-700">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup, index) => (
                  <tr
                    key={signup.signup_id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <td className="px-6 py-5 text-center text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-800 font-semibold">
                      {signup.username}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-800">
                      {signup.name}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-600">
                      {formatDate(signup.created_at)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => {
                            setSelectedSignup(signup);
                            setShowApproveModal(true);
                          }}
                        >
                          승인
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            setSelectedSignup(signup);
                            setShowRejectModal(true);
                          }}
                        >
                          반려
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

      {/* 승인 확인 모달 */}
      <ConfirmModal
        isOpen={showApproveModal}
        title="가입 승인"
        message={`${selectedSignup?.name}(${selectedSignup?.username})님의 가입을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
        onConfirm={handleApprove}
        onCancel={() => {
          setShowApproveModal(false);
          setSelectedSignup(null);
        }}
      />

      {/* 반려 확인 모달 */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="가입 반려"
        message={`${selectedSignup?.name}(${selectedSignup?.username})님의 가입 신청을 반려하시겠습니까?`}
        confirmText="반려"
        cancelText="취소"
        onConfirm={handleReject}
        onCancel={() => {
          setShowRejectModal(false);
          setSelectedSignup(null);
        }}
      />
    </>
  );
}

export default SignupManagementPage;
