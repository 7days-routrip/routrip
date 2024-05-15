import { emailRegex, nicknameRegex, passwordRegex } from "@/constants/regexPatterns";

export const emailOptions = {
  required: { value: true, message: "이메일은 필수 입력 정보입니다." },
  pattern: {
    value: emailRegex,
    message: "이메일형식이 올바르지 않습니다.",
  },
};

export const passwordOptions = {
  minLength: {
    value: 8,
    message: "8~16자여야 하며 숫자 또는 특수 문자가 포함해야 합니다.",
  },
  maxLength: {
    value: 16,
    message: "8~16자여야 하며 숫자 또는 특수 문자가 포함해야 합니다.",
  },
  pattern: {
    value: passwordRegex,
    message: "8~16자여야 하며 숫자 또는 특수 문자가 포함해야 합니다.",
  },
  required: { value: true, message: "비밀번호는 필수 입력 정보입니다." },
};

export const nicknameOptions = {
  minLength: {
    value: 2,
    message: "닉네임은 최소 2 글자 이상입니다.",
  },
  maxLength: {
    value: 8,
    message: "닉네임은 최대 8글자 이하입니다.",
  },
  pattern: {
    value: nicknameRegex,
    message: "가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자",
  },
  required: { value: true, message: "닉네임은 필수 입력 정보입니다." },
};

export const profileNicknameOptions = {
  minLength: {
    value: 2,
    message: "닉네임은 최소 2 글자 이상입니다.",
  },
  maxLength: {
    value: 8,
    message: "닉네임은 최대 8글자 이하입니다.",
  },
  pattern: {
    value: nicknameRegex,
    message: "가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자",
  },
};
