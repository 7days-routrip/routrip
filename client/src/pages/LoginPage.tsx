import { JoinPageStyle, WrapperStyle, allowedDomains, placeholderHander } from "./JoinPage";
import Title from "@/components/common/Title";
import { LoginProps, useAuth } from "@/hooks/useAuth";
import icons from "@/icons/icons";
import { useForm } from "react-hook-form";
import InputText from "@/components/common/Input";
import { emailOptions } from "@/config/registerOptions";
import { Button } from "@/components/common/Button";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { userLogin } = useAuth();
  const UserIcon = icons.MobileUserIcon;
  const ResetIcon = icons.ResetIcon;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = (data: LoginProps) => {
    const [, domain] = data.email.split("@");
    if (!allowedDomains.includes(domain)) {
      setError("email", { message: "허용되지 않는 이메일 도메인입니다." }, { shouldFocus: true });
      return;
    }
    userLogin(data);
  };

  return (
    <WrapperStyle>
      <JoinPageStyle>
        <Title size="large">로그인</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("이메일")}
              inputType="email"
              {...register("email", emailOptions)}
            />
            {errors.email && <small className="error-text">{errors.email.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호")}
              inputType="password"
              $inputsize="large"
              {...register("password")}
            />
            {errors.password && <small className="error-text">{errors.password.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <Button $scheme="primary" $radius="default" $size={"large"}>
              로그인
            </Button>
          </fieldset>
          <div className="login-info">
            <div className="join-login">
              <span>아직 회원이 아니신가요?</span>
              <div className="login-link">
                <UserIcon />
                <Link to="/join">회원가입 가기</Link>
              </div>
            </div>
            <div className="reset-ps">
              <span>비밀번호를 찾으실건가요? </span>
              <div className="ps-link">
                <ResetIcon />
                <Link to="/reset">비밀번호 찾기</Link>
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

export default LoginPage;
