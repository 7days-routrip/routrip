import { JoinPageStyle, WrapperStyle, domainAuth, placeholderHander } from "./JoinPage";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { emailOptions, passwordOptions } from "@/config/registerOptions";
import { Button } from "@/components/common/Button";
import { LoginProps, useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import icons from "@/icons/icons";
import { useEffect, useState } from "react";
import { emailRegex } from "@/constants/regexPatterns";

interface ResetPasswordProps extends LoginProps {
  passwordConfirm: string;
}

const RestPage = () => {
  const LoginIcon = icons.LoginIcon;
  const { userEmailCheck, userPasswordReset } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordProps>();

  const [notAuthenticated, setNotAuthenticated] = useState(true);
  const watchEmail = watch("email");
  const onEmailConfirm = () => {
    const email = getValues().email;
    if (!emailRegex.test(email)) {
      setError("email", { message: "이메일형식이 올바르지 않습니다." }, { shouldFocus: true });
      return;
    }
    if (!domainAuth(email)) {
      setError("email", { message: "허용되지 않는 이메일 도메인입니다." }, { shouldFocus: true });
      return;
    }
    userEmailCheck(email).then(() => {
      // res 가 성공 메시지면 이거
      setNotAuthenticated((prev) => !prev);
      clearErrors("email");
    });
  };

  const onSubmit = (data: LoginProps) => {
    if (notAuthenticated) {
      setError("email", { message: "이메일 인증 되지 않습니다." }, { shouldFocus: true });
      return;
    }

    userPasswordReset(data);
  };

  useEffect(() => {
    setNotAuthenticated(true);
  }, [watchEmail]);

  return (
    <WrapperStyle>
      <JoinPageStyle>
        <Title size="large">비밀번호 찾기</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("가입한 이메일을")}
              inputType="email"
              {...register("email", emailOptions)}
              isButton={true}
              buttonText={notAuthenticated ? "인증 확인" : "인증완료"}
              onConfirm={onEmailConfirm}
              isDisabled={notAuthenticated ? false : true}
            />

            {errors.email && <small className="error-text">{errors.email.message}</small>}
            {!notAuthenticated && <small className="successs-text">인증이 완료 되었습니다.</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호를")}
              inputType="password"
              $inputsize="large"
              {...register("password", passwordOptions)}
            />
            {errors.password && <small className="error-text">{errors.password.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호 확인")}
              inputType="password"
              $inputsize="large"
              {...register("passwordConfirm", passwordOptions)}
            />
            {errors.passwordConfirm && <small className="error-text">{errors.passwordConfirm.message}.</small>}
          </fieldset>
          <fieldset className="input-section">
            <Button $scheme="primary" $radius="default" $size={"large"}>
              변경
            </Button>
          </fieldset>
          <div className="login-info">
            <div className="join-login">
              <span>가입되어 있으신가요?</span>
              <div className="login-link">
                <LoginIcon />
                <Link to="/login">로그인하러 가기</Link>
              </div>
            </div>
          </div>
        </form>
      </JoinPageStyle>
    </WrapperStyle>
  );
};

export default RestPage;
