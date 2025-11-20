import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import Container from '../../components/common/Container';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 아이디 변경 시 중복 확인 초기화
    if (name === 'username') {
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
    }

    // 비밀번호 확인 실시간 검증
    if (name === 'confirmPassword' && value) {
      if (formData.password !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // 비밀번호 변경 시 비밀번호 확인란도 재검증
    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // 에러 메시지 초기화 (비밀번호 확인란 제외)
    if (errors[name] && name !== 'confirmPassword') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setErrors(prev => ({ ...prev, username: '아이디를 입력해주세요' }));
      return;
    }

    setIsCheckingUsername(true);

    try {
      // TODO: API 호출 (GET /api/signup/check-username?username={username})
      await new Promise(resolve => setTimeout(resolve, 500));
      const available = formData.username.length >= 3;
      setIsUsernameAvailable(available);
      setIsUsernameChecked(true);

      if (!available) {
        setErrors(prev => ({ ...prev, username: '이미 사용 중인 아이디입니다' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, username: '중복 확인에 실패했습니다' }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요';
    } else if (!isUsernameChecked) {
      newErrors.username = '아이디 중복 확인을 해주세요';
    } else if (!isUsernameAvailable) {
      newErrors.username = '사용할 수 없는 아이디입니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
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
      // TODO: API 호출 (POST /api/signup)
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('가입 신청이 완료되었습니다.\n관리자 승인 후 로그인이 가능합니다.');
      navigate('/login');
    } catch (error) {
      alert('가입 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fullHeight centered maxWidth="md" padding="medium" shadow="lg" rounded="2xl">
      <div className="text-center mb-8">
        <Logo className="justify-center mb-4" fontSize={30} />
        <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
        <p className="text-sm text-gray-500 mt-2">관리자 승인 후 사용 가능합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 아이디 */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            아이디 *
          </label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                success={isUsernameChecked && isUsernameAvailable ? '✓ 사용 가능한 아이디입니다' : undefined}
                placeholder="아이디 입력"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={handleUsernameCheck}
              disabled={isCheckingUsername || !formData.username}
              className="whitespace-nowrap"
            >
              {isCheckingUsername ? '확인 중...' : '중복 확인'}
            </Button>
          </div>
        </div>

        {/* 비밀번호 */}
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          label="비밀번호"
          error={errors.password}
          placeholder="비밀번호 입력 (6자 이상)"
          required
        />

        {/* 비밀번호 확인 */}
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          label="비밀번호 확인"
          error={errors.confirmPassword}
          placeholder="비밀번호 재입력"
          required
        />

        {/* 이름 */}
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          label="이름"
          error={errors.name}
          placeholder="이름 입력"
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
            {isSubmitting ? '신청 중...' : '가입 신청'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            로그인 페이지로
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default SignupPage;
