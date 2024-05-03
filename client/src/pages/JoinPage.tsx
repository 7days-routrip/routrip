import InputText from "@/components/common/Input";
import { DEFAULT_IMAGE } from "@/components/common/ProfileCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { JoinProps, useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

import icons from "@/icons/icons";
import Title from "@/components/common/Title";
import { BigButton } from "@/components/common/Button";

export const errorTextHander = (text: string) => {
  return text === "비밀번호" ? `${text}가 입력되지 않았습니다.` : `${text}이 입력되지 않았습니다.`;
};

export const placeholderHander = (text: string) => {
  return `${text} 입력해주세요.`;
};

const JoinPage = () => {
  const { userJoin } = useAuth();
  const UserIcon = icons.MobileUserIcon;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinProps>();

  const onSubmit = (data: JoinProps) => {
    userJoin(data);
  };
  return (
    <WrapperStyle>
      <JoinPageStyle>
        <Title size="large">회원가입</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("이메일")}
              inputType="email"
              {...register("email", { required: true })}
              isButton={true}
            />
            {errors.email && <small className="error-text">{errorTextHander("이메일")}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("닉네임")}
              inputType="email"
              {...register("email", { required: true })}
              isButton={true}
            />
            {errors.email && <small className="error-text">{errorTextHander("닉네임")}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호")}
              inputType="password"
              $inputsize="large"
              {...register("password", { required: true })}
            />
            {errors.email && <small className="error-text">{errorTextHander("비밀번호")}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호 확인")}
              inputType="password"
              $inputsize="large"
              {...register("password", { required: true })}
            />
            {errors.email && <small className="error-text">{errorTextHander("비밀번호")}.</small>}
          </fieldset>
          <fieldset className="input-section">
            <BigButton $scheme="primary" $radius="default">
              회원가입
            </BigButton>
          </fieldset>

          <div className="info">
            <div className="join-login">
              <span>가입되어 있으신가요?</span>
              <div className="login-link">
                <UserIcon />
                <Link to="/login">로그인하러 가기</Link>
              </div>
            </div>
            <div className="social-login">
              <div className="hr-sect">
                <div className="hr-line"></div>
                <span>간편 로그인</span>
                <div className="hr-line"></div>
              </div>
              <div className="social-icon">
                <div className="iconImge"></div>
                <div className="iconImge"></div>
              </div>
            </div>
          </div>
        </form>
      </JoinPageStyle>
    </WrapperStyle>
  );
};

const WrapperStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const JoinPageStyle = styled.div`
  width: 28.28rem;
  height: auto;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }
  .join-login {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    gap: 1rem;
  }
  .error-text {
    padding-left: 1rem;
    color: ${({ theme }) => theme.color.red};
  }

  .hr-sect {
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 300px;
    height: 20px;
    margin: 0.5rem 0;
  }
  .hr-sect > span {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    color: ${({ theme }) => theme.color.primary};
    /* white-space: nowrap; */
    height: 20px;
    width: 100px;
    text-align: center;
  }
  .hr-line {
    height: 1px;
    width: 100px;
    background: ${({ theme }) => theme.color.borderGray};
  }
  .input-section {
    border: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1;
    margin: 0;
  }

  .social-icon {
    margin: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .iconImge {
    background-image: url(${DEFAULT_IMAGE});
    width: 2.5rem;
    height: 2.5rem;
    background-size: 100% 80%;
    background-position: center;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-radius: 50%;
  }
`;

export default JoinPage;
