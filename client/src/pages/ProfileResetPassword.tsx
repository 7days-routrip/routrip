import styled from "styled-components";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useForm } from "react-hook-form";
import { passwordOptions } from "@/config/registerOptions";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
interface ResetPasswordProps {
  originPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

const ProfileResetPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordProps>();
  const { userNewPasswordReset } = useAuth();

  const onSubmit = (data: ResetPasswordProps) => {
    if (data.newPassword === data.passwordConfirm) {
      userNewPasswordReset(data.originPassword, data.newPassword);
    } else setError("passwordConfirm", { message: "비밀번호가 일치 하지 않습니다." }, { shouldFocus: true });
  };
  return (
    <WrapperStyle>
      <ProfileResetPasswordStyle>
        <Title size="medium">비밀번호 변경</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-form">
            <div className="input-info">
              <small className="text-color">
                다른 아이디/ 사이트에서 사용한적 없는 비밀번호, 이전에 사용한 적 없는 비밀번호가{" "}
              </small>
              <small>안전합니다.</small>
            </div>
            <fieldset>
              <small className="input-text">현재 비밀번호</small>
              <InputText
                inputType="password"
                {...register("originPassword", passwordOptions)}
                placeholder="현재 비밀번호를 입력해주세요"
              />
              {errors.originPassword && <small className="error-text">{errors.originPassword.message}</small>}
            </fieldset>
            <fieldset>
              <small className="input-text">새 비밀번호</small>
              <InputText
                inputType="password"
                {...register("newPassword", passwordOptions)}
                placeholder="새 비밀번호를 입력해주세요"
              />
              {errors.newPassword && <small className="error-text">{errors.newPassword.message}</small>}
            </fieldset>
            <fieldset>
              <small className="input-text">새 비밀번호 확인</small>
              <InputText
                inputType="password"
                {...register("passwordConfirm", passwordOptions)}
                placeholder="새 비밀번호를 한번 더 입력해주세요"
              />
              {errors.passwordConfirm && <small className="error-text">{errors.passwordConfirm.message}</small>}
            </fieldset>
          </div>
          <div className="input-button">
            <Button $radius="default" $scheme="normal" $size="medium" type="button">
              <Link to={"/me"}>취소</Link>
            </Button>
            <Button $radius="default" $scheme="primary" $size="medium" type="submit">
              확인
            </Button>
          </div>
        </form>
      </ProfileResetPasswordStyle>
    </WrapperStyle>
  );
};
const WrapperStyle = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ProfileResetPasswordStyle = styled.div`
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .input-form {
    padding: 1rem 0;
    border-top: 1px solid ${({ theme }) => theme.color.black};
    border-bottom: 1px solid ${({ theme }) => theme.color.black};

    .input-text {
      font-weight: 600;
    }
    .input-info {
      width: 90%;
      font-weight: 300;
      margin-bottom: 1.5rem;
    }
    .text-color {
      color: ${({ theme }) => theme.color.orange};
    }

    .error-text {
      color: ${({ theme }) => theme.color.red};
    }
  }
  fieldset {
    border: 0;
  }

  .input-button {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    a {
      color: ${({ theme }) => theme.color.black};
    }
  }

  @media (max-width: 768px) {
    width: auto;
    height: 400px;
  }
`;

export default ProfileResetPassword;
