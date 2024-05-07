import styled from "styled-components";
import { MypageStyle } from "./Mypage";
import ProfileCard, { ProfileImageStyle, ProfileImageStyleProps } from "@/components/common/ProfileCard";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { nicknameRegex } from "@/constants/regexPatterns";

const dummyData: IProfileCard = {
  nickname: "김하늘누리",
  profile: "",
  journeysNum: 5,
  postsNum: 5,
  commentsNum: 88,
  likePostsNum: 81,
  likeSpotsNum: 50,
};

interface ProfileEditProps {
  image: string;
  nickname: string;
}

const ProfileEditPage = () => {
  const { userNickCheck } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileEditProps>();
  const [nicknameUniqueCheck, setNicknameUniqueCheck] = useState(false);
  const fileInput = useRef("");

  const checkNickname = () => {
    const nickname = getValues().nickname;
    if (!nicknameRegex.test(nickname)) {
      setError(
        "nickname",
        { message: "최소 2 ~ 최대 8 글자, 영문 대소문자, 글자 단위 한글, 숫자" },
        { shouldFocus: true },
      );
      return;
    }
    userNickCheck(nickname).then((res) => {
      // res 가 성공 메시지면 이거
      setNicknameUniqueCheck((prev) => !prev);
      clearErrors("nickname");
    });
  };

  const onSubmit = (data: ProfileEditProps) => {
    // 로직 아직 미구현
  };
  return (
    <ProfileEditPageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <main className="edit-main">
        <Title size="large">사용자 프로필 수정</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="edit-form">
            <div className="image-form">
              <Title size="medium">프로필 사진</Title>
              <ProfileEditImageStyle $image={""}> </ProfileEditImageStyle>
              <AttachFileLabel htmlFor="profile-image">사진 변경</AttachFileLabel>
              <AttachFileInput type="file" id="profile-image" accept="image/*"></AttachFileInput>
            </div>

            <div className="profile-form">
              <div className="profile-nickname">
                <span>닉네임</span>
                <InputText
                  isButton={true}
                  inputType="text"
                  buttonText={nicknameUniqueCheck ? "인증 완료" : "중복 확인"}
                  onConfirm={checkNickname}
                  $inputsize="small"
                ></InputText>
              </div>
              <div className="profile-password">
                <span>비밀번호</span>
                <Button $radius="default" $scheme="primary" $size="medium" onClick={() => console.log("안냥")}>
                  변경
                </Button>
              </div>
              <div className="profile-resign">
                <span>회원 정보를 삭제하시겠어요?</span>
                <Link to={"/me"}>회원 탈퇴</Link>
              </div>
            </div>
          </div>
          <div className="buttonSection">
            <Button $radius="default" $scheme="primary" $size="large">
              저장
            </Button>
          </div>
        </form>
      </main>
    </ProfileEditPageStyle>
  );
};

const ProfileEditPageStyle = styled(MypageStyle)`
  width: 100%;
  .edit-main {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width: 800px;

    .edit-form {
      display: flex;
      border-top: 1px solid ${({ theme }) => theme.color.black};
      border-bottom: 1px solid ${({ theme }) => theme.color.black};
      width: 100%;
      height: 300px;
    }
    .image-form {
      width: 100%;
    }

    .profile-form {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      align-items: center;
      flex-direction: column;
    }

    @media (max-width: 768px) {
      width: 300px;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .edit-form {
        flex-direction: column;
      }
    }
  }
`;

const ProfileEditImageStyle = styled(ProfileImageStyle)<ProfileImageStyleProps>`
  width: 200px;
  height: 200px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;
const AttachFileLabel = styled.label`
  width: 500px;
  height: 500px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};
`;
const AttachFileInput = styled.input`
  display: none;
`;

export default ProfileEditPage;
