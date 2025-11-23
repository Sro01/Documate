import { useState } from 'react';

/**
 * 아이디 찾기 훅
 */
export const useFindUsername = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string[] | null>(null);

  const findUsername = async (_name: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: API 호출
      // const response = await fetch('/api/auth/find-username', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name } as FindUsernameRequest),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('아이디 찾기에 실패했습니다');
      // }
      //
      // const data: ApiResponse<FindUsernameResponseData> = await response.json();
      // const usernames = data.data.candidates.map(c => c.username_masked);

      // Mock 데이터 (개발용)
      await new Promise(resolve => setTimeout(resolve, 800));
      const usernames = ['test***', 'user***'];

      setResult(usernames);
      return usernames;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '아이디 찾기에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    findUsername,
    isLoading,
    error,
    result,
    reset,
  };
};

/**
 * 비밀번호 재설정 훅
 */
export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const resetPassword = async (_username: string, _name: string) => {
    setIsLoading(true);
    setError(null);
    setTempPassword(null);

    try {
      // TODO: API 호출
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, name } as ResetPasswordRequest),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('비밀번호 재설정에 실패했습니다');
      // }
      //
      // const data: ApiResponse<ResetPasswordResponseData> = await response.json();
      // const password = data.data.temp_password;

      // Mock 데이터 (개발용)
      await new Promise(resolve => setTimeout(resolve, 800));
      const password = 'temp1234!@';

      setTempPassword(password);
      return password;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setTempPassword(null);
    setError(null);
  };

  return {
    resetPassword,
    isLoading,
    error,
    tempPassword,
    reset,
  };
};
