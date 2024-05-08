import styled from "styled-components";
import { MypageStyle } from "./Mypage";
import ProfileCard, { ProfileImageStyle, ProfileImageStyleProps } from "@/components/common/ProfileCard";
import { ProfileCard as IProfileCard } from "@/models/profile.model";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { nicknameRegex } from "@/constants/regexPatterns";
import { nicknameOptions } from "@/config/registerOptions";
import { useQuery } from "@tanstack/react-query";

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
  const [imgFile, setImgFile] = useState<File | null>();
  const [preview, setPreview] = useState<string>("");
  const { userUpdate } = useAuth();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile(file);
      } else {
        setImgFile(null);
      }
    }
  };

  const onSubmit = (data: ProfileEditProps) => {
    if (preview === "" && data.nickname === "") return;
    if (data.nickname && !nicknameUniqueCheck) {
      setError("nickname", { message: "닉네임 중복 검사를 먼저 해주세요." }, { shouldFocus: true });
      return;
    }
    userUpdate({ nickname: data.nickname, profile: preview });
    clearErrors;
  };

  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgString = reader.result as string;
        setPreview(imgString.substring(11));
      };
      reader.readAsDataURL(imgFile);
    } else {
      setPreview("");
    }
  }, [imgFile]);

  return (
    <ProfileEditPageStyle>
      <ProfileCard ProfileProps={dummyData} />
      <main className="edit-main">
        <Title size="large">사용자 프로필 수정</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="edit-form">
            <div className="image-form">
              <div className="profile-image">
                <Title size="medium">프로필 사진</Title>
                <ProfileEditImageStyle $image={preview}> </ProfileEditImageStyle>
              </div>
              <div className="image-btn">
                <AttachFileLabel htmlFor="profile-image">사진 변경</AttachFileLabel>
                <AttachFileInput
                  type="file"
                  id="profile-image"
                  {...register("image")}
                  accept="image/*"
                  onChange={handleFileChange}
                ></AttachFileInput>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-nickname">
                <div className="nickname-input">
                  <span>닉네임</span>
                  <InputText
                    inputType="text"
                    {...register("nickname", nicknameOptions)}
                    $inputsize="small"
                    onChange={() => setNicknameUniqueCheck(false)}
                  />
                  {errors.nickname && <small className="error-text">{errors.nickname.message}</small>}
                </div>
                <Button
                  $size="medium"
                  $radius="default"
                  $scheme="primary"
                  type="button"
                  onClick={checkNickname}
                  disabled={nicknameUniqueCheck ? true : false}
                >
                  {nicknameUniqueCheck ? "인증 완료" : "중복 확인"}
                </Button>
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

  span {
    font-weight: 600;
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

    .nickname-input {
      width: 61%;
    }
    .profile-nickname,
    .profile-password,
    .profile-resign {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }

    .profile-nickname {
      align-items: center;
      gap: 1rem;
      small {
        color: ${({ theme }) => theme.color.red};
      }
    }

    .profile-nickname > button {
      margin-top: 1rem;
    }

    .profile-resign {
      margin-top: 2rem;
    }

    .profile-resign > :last-child {
      margin-right: 2rem;
    }

    .profile-resign > span,
    .profile-resign > a {
      color: ${({ theme }) => theme.color.commentGray};
      font-weight: 100;
    }

    .btn-section {
      margin: 1rem 0;
      display: flex;
      justify-content: end;
    }

    @media (max-width: 768px) {
      width: 350px;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .edit-form {
        flex-direction: column;
        height: auto;
      }
      .image-form {
        justify-content: space-between;
        padding: 0 1rem;
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
