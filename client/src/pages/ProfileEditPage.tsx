import styled from "styled-components";
import ProfileCard, { DEFAULT_IMAGE } from "@/components/common/ProfileCard";
import { Profile } from "@/models/profile.model";
import Title from "@/components/common/Title";
import InputText from "@/components/common/Input";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { nicknameRegex } from "@/constants/regexPatterns";
import { profileNicknameOptions } from "@/config/registerOptions";
import { useProfile } from "@/hooks/useMypage";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { useAuthStore } from "@/stores/authStore";

const dummyData: Profile = {
  nickName: "",
  profileImg: "",
  journeysNum: 0,
  postsNum: 0,
  commentsNum: 0,
  likePostsNum: 0,
  likeSpotsNum: 0,
};

interface ProfileEditProps {
  image: FileList;
  nickname: string;
}

const ProfileEditPage = () => {
  const { userNicknameCheck, userResign } = useAuth();
  const { storeLogout } = useAuthStore();
  const { profileInfo, profileRefetch } = useProfile();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileEditProps>();
  const [nicknameUniqueCheck, setNicknameUniqueCheck] = useState(false);
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>("");
  const [formImage, setFormImage] = useState<File | undefined>();
  const { userUpdate, userProfileImage } = useAuth();
  const navigate = useNavigate();

  const checkNickname = async () => {
    const nickname = getValues().nickname;
    if (!nicknameRegex.test(nickname)) {
      setError(
        "nickname",
        { message: "최소 2글자 ~ 최대 8글자, 영문 대소문자, 한글, 숫자입니다." },
        { shouldFocus: true },
      );
      return;
    }
    const res = await userNicknameCheck(nickname);
    if (res.status === 200) {
      setNicknameUniqueCheck((prev) => !prev);
      clearErrors("nickname");
    } else {
      setError("nickname", { message: `${res.data.message}` }, { shouldFocus: true });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImgFile(file);
    } else {
      setImgFile(undefined);
    }
  };

  const handleResign = () => {
    showConfirm("정말 회원 탈퇴 하시겠습니까?", () =>
      userResign()?.then(() => {
        storeLogout();
        navigate("/");
      }),
    );
  };

  const onSubmit = async (data: ProfileEditProps) => {
    if (formImage === undefined && data.nickname === "") {
      showAlert("변경 사항이 없습니다.", "logo");
      return;
    }
    if (data.nickname && !nicknameUniqueCheck) {
      setError("nickname", { message: "닉네임 중복 검사를 먼저 해주세요." }, { shouldFocus: true });
      return;
    }

    const profileImageUrl = formImage ? await userProfileImage(formImage) : undefined;
    const updateNickname = data.nickname ? data.nickname : undefined;

    await userUpdate(updateNickname, profileImageUrl);
    showAlert("수정이 완료되었습니다.", "logo", () => {
      clearErrors();
      profileRefetch();
    });
  };

  useEffect(() => {
    if (imgFile) {
      setFormImage(imgFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgString = reader.result as string;
        setPreview(imgString);
      };
      reader.readAsDataURL(imgFile);
    } else {
      setPreview("");
    }
  }, [imgFile]);

  useEffect(() => {
    if (profileInfo?.profileImg) setPreview(profileInfo?.profileImg);
  }, [profileInfo]);
  return (
    <ProfileEditPageStyle>
      <ProfileCard ProfileProps={profileInfo ? profileInfo : dummyData} />
      <main className="edit-main">
        <Title size="large">사용자 프로필 수정</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="edit-form">
            <div className="image-form">
              <div className="profile-image">
                <Title size="medium">프로필 사진</Title>
                <img className="profile-preveiw" src={preview ? preview : DEFAULT_IMAGE} alt="Uploaded File" />
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
                <span className="nickname-label">닉네임</span>
                <div className="nickname-input">
                  <div className="test">
                    <InputText
                      inputType="text"
                      {...register("nickname", profileNicknameOptions)}
                      $inputsize="small"
                      onChange={() => setNicknameUniqueCheck(false)}
                    />
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
                  <div className="">
                    {errors.nickname && <small className="error-text">{errors.nickname.message}</small>}
                    {nicknameUniqueCheck && <small className="success-text">사용 가능한 닉네임입니다!</small>}
                  </div>
                </div>
              </div>
              <div className="profile-password">
                <span>비밀번호</span>
                <Button $radius="default" $scheme="primary" $size="medium" type="button">
                  <Link to={"/me/reset"}>비밀번호 변경</Link>
                </Button>
              </div>
              <div className="profile-resign">
                <span>회원 정보를 삭제하시겠어요?</span>
                <span onClick={() => handleResign()}>회원 탈퇴</span>
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

const ProfileEditPageStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .main {
    width: 100%;
  }

  .contents {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  a {
    color: ${({ theme }) => theme.color.white};
  }
  .nickname-label,
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
    }
    .image-btn {
      display: flex;
      align-items: flex-end;
      padding-bottom: 1rem;
    }

    .profile-form {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem 0;
    }
    .error-text {
      color: ${({ theme }) => theme.color.red};
    }
    .success-text {
      color: ${({ theme }) => theme.color.successGreen};
    }

    .test {
      display: flex;
      width: 100%;
      gap: 0.5rem;
      > input {
        flex: 1;
        width: 100%;
      }
    }

    .profile-preveiw {
      width: 200px;
      height: 200px;
      background-size: cover;
      border-radius: 50%;
      border: 1px solid ${({ theme }) => theme.color.borderGray};
    }

    .nickname-input {
      display: flex;
      width: 100%;
      flex-direction: column;
    }
    .profile-nickname {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .profile-password button {
      height: 40px;
    }

    .profile-password,
    .profile-resign {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-nickname {
      gap: 0.1rem;
    }

    .profile-nickname > button {
      margin-top: 1rem;
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
      }
    }
  }
`;

const AttachFileLabel = styled.label`
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;

export default ProfileEditPage;
