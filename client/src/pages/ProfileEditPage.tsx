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
import { nicknameOptions } from "@/config/registerOptions";
import constructWithOptions from "styled-components/dist/constructors/constructWithOptions";

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
  image: FileList;
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
  const fileToBlobURL = async (file: File) => {
    const blob = new Blob([file], { type: file.type });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  };

  const onSubmit = (data: ProfileEditProps) => {
    // 로직 아직 미구현
    // fileToBlobURL(data.image[0]);
  };
  return (
    <ProfileEditPageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <main className="edit-main">
        <Title size="large">사용자 프로필 수정</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="edit-form">
            <div className="image-form">
              <div className="orofile-image">
                <Title size="medium">프로필 사진</Title>
                <ProfileEditImageStyle $image={""}> </ProfileEditImageStyle>
              </div>
              <div className="image-btn">
                <AttachFileLabel htmlFor="profile-image">사진 변경</AttachFileLabel>
                <AttachFileInput
                  type="file"
                  id="profile-image"
                  {...register("image")}
                  accept="image/*"
                ></AttachFileInput>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-nickname">
                <span>닉네임</span>
                <InputText
                  isButton={true}
                  inputType="text"
                  {...register("nickname", nicknameOptions)}
                  buttonText={nicknameUniqueCheck ? "인증 완료" : "중복 확인"}
                  onConfirm={checkNickname}
                  $inputsize="small"
                ></InputText>
              </div>
              <div className="profile-password">
                <span>비밀번호</span>
                <Button $radius="default" $scheme="primary" $size="medium">
                  <Link to={"/me/reset"}>비밀번호 변경</Link>
                </Button>
              </div>
              <div className="profile-resign">
                <span>회원 정보를 삭제하시겠어요?</span>
                <Link to={"/"}>회원 탈퇴</Link>
              </div>
            </div>
          </div>
          <div className="btn-section">
            <Button $radius="default" type="submit" $scheme="primary" $size="large">
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

  a {
    color: ${({ theme }) => theme.color.white};
  }

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
      display: flex;
      justify-content: center;
    }
    .image-btn {
      display: flex;
      align-items: flex-end;
      padding-bottom: 1rem;
    }

    .profile-form {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      align-items: center;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem 0;
    }

    .profile-password,
    .profile-resign {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .profile-resign,
    .profile-resign > a {
      color: ${({ theme }) => theme.color.commentGray};
    }

    .btn-section {
      margin: 1rem 0;
      display: flex;
      justify-content: end;
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
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};
`;
const AttachFileInput = styled.input`
  display: none;
`;

export default ProfileEditPage;
