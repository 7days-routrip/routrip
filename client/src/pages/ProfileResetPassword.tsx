import styled from "styled-components";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useForm } from "react-hook-form";
import { passwordOptions } from "@/config/registerOptions";
import { fetchProfileRestPassword } from "@/apis/auth.api";
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

  const onSubmit = (data: ResetPasswordProps) => {
    if (data.newPassword === data.passwordConfirm) {
      fetchProfileRestPassword({ originPassword: data.originPassword, newPassword: data.newPassword });
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
            <Button $radius="default" $scheme="normal" $size="medium">
              취소
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
    padding: 10px 0;
    border-top: 1px solid ${({ theme }) => theme.color.black};
    border-bottom: 1px solid ${({ theme }) => theme.color.black};
    .input-text {
      font-weight: 600;
    }
    .input-info {
      width: 90%;
      font-weight: 300;
    }
    .text-color {
      color: ${({ theme }) => theme.color.orange};
    }

    .error-text {
      padding-left: 1rem;
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
  }

  @media (max-width: 768px) {
    width: auto;
    height: 400px;
  }
`;

export default ProfileResetPassword;
