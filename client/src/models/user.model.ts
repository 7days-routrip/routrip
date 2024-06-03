export interface User {
  id: number;
  nickName: string;
  email: string;
}

// 로그인
export interface LoginProps {
  email: string;
  password: string;
}

// 회원가입
export interface JoinProps extends LoginProps {
  nickname: string;
}

// 회원가입 폼
export interface joinFormProps extends JoinProps {
  passwordConfirm: string;
}

// 비밀번호 변경 폼
export interface ResetPasswordProps extends LoginProps {
  passwordConfirm: string;
}
