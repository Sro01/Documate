import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import Container from '../../components/common/Container';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API 호출 (POST /api/auth/login)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: 로그인 성공 시 토큰 저장 및 페이지 이동
      navigate('/admin/chatbotlist');
    } catch (error) {
      setErrors({ username: '아이디 또는 비밀번호가 올바르지 않습니다' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fullHeight centered maxWidth="md" padding="medium" shadow="lg" rounded="2xl">
      <div className="text-center mb-8">
        <Logo className="justify-center mb-4" fontSize={30} clickable={false} />
        <h1 className="text-2xl font-bold text-gray-800">로그인</h1>
        <p className="text-sm text-gray-500 mt-2">DoQ-Mate 관리자 시스템</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 아이디 */}
        <Input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          label="아이디"
          error={errors.username}
          placeholder="아이디 입력"
          required
        />

        {/* 비밀번호 */}
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          label="비밀번호"
          error={errors.password}
          placeholder="비밀번호 입력"
          required
        />

        {/* 버튼들 */}
        <div className="space-y-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default LoginPage;
