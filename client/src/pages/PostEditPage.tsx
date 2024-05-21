import { httpClient } from "@/apis/https";
import { Button } from "@/components/common/Button";
import WriteTopBtn from "@/components/common/WriteTopBtn";
import ScheduleCard from "@/components/common/scheduleCard";
import { useSchedule } from "@/hooks/useMypage";
import { useScheduleDetails } from "@/hooks/useScheduleDetails";
import icons from "@/icons/icons";
import { DetailPost } from "@/models/post.model";
import { theme } from "@/styles/theme";
import { showAlert } from "@/utils/showAlert";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

// 이미지 업로드 함수
const uploadImage = async (file: File) => {
  try {
    if (!file) return null;
    const formData = new FormData();
    formData.append("posts", file);

    const response = await httpClient.post("/posts/upload/img", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to upload image. Status code: ${response.status}`);
    }

    return response.data.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// CKEditor 업로드 어댑터
class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      const imageUrl = await uploadImage(file);
      return { default: imageUrl };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  abort() {
    console.log("File upload aborted.");
  }
}

// CKEditor 플러그인
function MyCustomUploadAdapterPlugin(editor: {
  plugins: { get: (arg0: string) => { createUploadAdapter: (loader: any) => MyUploadAdapter } };
}) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

const PostEditPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const [post, setPost] = useState<DetailPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalExpense, setTotalExpense] = useState<number | string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>(undefined);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule();
  const { scheduleDetailData } = useScheduleDetails(selectedScheduleId);
  const nav = useNavigate();
  const { PinIcon, LikeIcon, CommentIcon, EditIcon, RightArrowIcon } = icons;

  const [region, setRegion] = useState(0);
  const [country, setCountry] = useState(0);
  const [newSchedule, setNewSchedule] = useState(false);

  useEffect(() => {
    if (showSidebar) {
      scheduleRefetch();
    }
  }, [showSidebar]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await httpClient.get(`/posts/${postId}`);
        const fetchedPost = response.data;
        console.log(fetchedPost);

        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setRegion(fetchedPost.continent.id);
        setCountry(fetchedPost.country.id);
        setContent(fetchedPost.contents);

        const [start, end] = fetchedPost.date.split("-").map((dateStr: string | number | Date) => new Date(dateStr));
        setStartDate(start);
        setEndDate(end);

        setTotalExpense(fetchedPost.totalExpense || "");
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId !== undefined) {
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    if (selectedScheduleId && scheduleDetailData) {
      const start = new Date(scheduleDetailData.startDate);
      const end = new Date(scheduleDetailData.endDate);
      setStartDate(start);
      setEndDate(end);
      setNewSchedule(true);
    }
  }, [selectedScheduleId, scheduleDetailData]);

  const handleSave = async () => {
    try {
      const editorContent = new DOMParser().parseFromString(content, "text/html");
      const images = editorContent.querySelectorAll("img");
      let firstImageUrl = "";
      const imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.src.startsWith("data:")) {
          const blob = dataURLtoBlob(img.src);
          if (blob) {
            const file = new File([blob], `image_${i}.png`, { type: blob.type });
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
              img.src = imageUrl;
              imageUrls.push(imageUrl);
              if (!firstImageUrl) {
                firstImageUrl = imageUrl;
              }
            }
          } else {
            console.error("Failed to convert data URL to Blob.");
          }
        } else {
          imageUrls.push(img.src);
          if (!firstImageUrl) {
            firstImageUrl = img.src;
          }
        }
      }

      const updatedContent = new XMLSerializer().serializeToString(editorContent);
      const cleanedContent = updatedContent.replace('xmlns="http://www.w3.org/1999/xhtml"', "");

      const payload = {
        title: title,
        contents: cleanedContent,
        startDate: startDate?.toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0],
        expense: totalExpense.toString(),
        continent: region,
        country: country,
        journeyId: selectedScheduleId,
      };

      await httpClient.patch(`/posts/${postId}`, payload);
      showAlert("게시물이 수정되었습니다.", "logo", () => {
        nav(`/post/${postId}`);
      });

      // 업데이트된 날짜와 총 여행 경비를 반영하기 위해 상태를 갱신
      setPost((prevPost) => {
        if (prevPost) {
          return {
            ...prevPost,
            startDate: payload.startDate,
            endDate: payload.endDate,
            totalExpense: payload.expense,
          };
        }
        return prevPost;
      });
    } catch (error) {
      console.error("Error updating post:", error);
      showAlert("게시물 수정에 실패했습니다.", "error");
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleScheduleClick = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId.toString());
    const selectedSchedule = schedules.find((schedule) => schedule.id === scheduleId);
    if (selectedSchedule) {
      const start = new Date(selectedSchedule.startDate);
      const end = new Date(selectedSchedule.endDate);
      setStartDate(start);
      setEndDate(end);
      setShowSidebar(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (sidebarRef.current && !sidebarRef.current.contains(target)) {
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  const dataURLtoBlob = (dataurl: string) => {
    const parts = dataurl.split(",");
    const match = parts[0].match(/:(.*?);/);
    const mime = match ? match[1] : "application/octet-stream";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  if (!post) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <WriteTopBtn isWriting={false} />
      <PostEditPageStyle>
        <div className="country">
          <PinIcon />
          {post.continent.name} ﹥ {post.country.name}
        </div>
        <h1>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </h1>

        <div className="trip-container">
          <div className="edit-info">
            <div className="edit-date">
              <div className="date-title">여행한 날짜</div>
              <div>
                {startDate ? startDate.toLocaleDateString() : ""} - {endDate ? endDate.toLocaleDateString() : ""}
              </div>
            </div>
            <div className="edit-expense">
              <div className="expense-title">총 여행 경비</div>
              <input
                type="type"
                value={totalExpense}
                onChange={(e) => setTotalExpense(parseInt(e.target.value))}
                className="small-input"
              />
            </div>
            <div className="edit-plan">
              <p className="edit-schedule" onClick={toggleSidebar}>
                내 일정 수정하기
              </p>
            </div>
          </div>
        </div>

        <div className="place-container">
          {!newSchedule && post.journeys && post.journeys.spots && post.journeys.spots.length > 0 && (
            <div className="place-container">
              {post.journeys.spots.map((spotData, dayIndex) => (
                <div key={dayIndex} className="days">
                  <div className="day">
                    <PinIcon /> DAY {dayIndex + 1}{" "}
                  </div>
                  <div className="route">
                    {spotData.spot.length > 0 ? (
                      spotData.spot.map((spot, spotIndex) => (
                        <span key={spotIndex} className="item">
                          {spotIndex > 0 && (
                            <span className="arrow-item">
                              {" "}
                              <RightArrowIcon />
                            </span>
                          )}
                          {spot.name}
                        </span>
                      ))
                    ) : (
                      <div className="plan-item no-schedule">추가된 일정이 없습니다.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {newSchedule &&
            scheduleDetailData?.days.map((day, index) => (
              <div key={index} className="days">
                <div className="day">
                  <PinIcon /> DAY {index + 1}{" "}
                </div>
                <div className="route">
                  {day.spots.length > 0 ? (
                    day.spots.map((spot, i) => (
                      <span key={i} className="item">
                        {i > 0 && (
                          <span className="arrow-item">
                            <RightArrowIcon />
                          </span>
                        )}
                        {spot.placeName}
                      </span>
                    ))
                  ) : (
                    <div className="plan-item no-schedule">추가된 일정이 없습니다.</div>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="content-container">
          <CKEditor
            editor={ClassicEditor}
            config={{
              extraPlugins: [MyCustomUploadAdapterPlugin],
            }}
            data={content}
            onChange={(_event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>
        <div className="btn-wrapper">
          <Button $size="medium" $scheme="secondary" $radius="default" onClick={() => nav(-1)}>
            취소
          </Button>
          <Button $size="medium" $scheme="primary" $radius="default" onClick={handleSave}>
            저장
          </Button>
        </div>
        {showSidebar && (
          <Sidebar ref={sidebarRef}>
            <h3>내 일정</h3>
            <ul>
              {isEmptySchedules ? (
                <li>일정이 없습니다.</li>
              ) : (
                schedules?.map((schedule, index) => (
                  <li key={index} onClick={() => handleScheduleClick(schedule.id)}>
                    <ScheduleCard scheduleProps={schedule} view="list" disableLink={true} />
                  </li>
                ))
              )}
            </ul>
            <div className="close-button">
              <Button $size="small" $scheme="secondary" $radius="default" onClick={toggleSidebar}>
                닫기
              </Button>
            </div>
          </Sidebar>
        )}
      </PostEditPageStyle>
    </ThemeProvider>
  );
};

// 스타일 정의는 동일하게 유지합니다.
const PostEditPageStyle = styled.div`
  .info-container {
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
  }
  h1 {
    margin: 0px;
  }
  .country {
    margin-top: 10px;
    color: ${({ theme }) => theme.color.routeGray};
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: 400;
  }
  .btn-wrapper {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    margin: 20px 0px;
  }
  .trip-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin: 0 0 10px 0;
    }
  }
  .date-title,
  .expense-title {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
    display: flex;
  }
  .expense-title {
    margin-right: 0.5rem;
  }

  .edit-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .place-container {
    color: ${({ theme }) => theme.color.black};
    margin-bottom: 20px;
  }
  .edit-expense {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-date {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .date-picker-container {
    margin-top: 10px;
  }

  .edit-schedule {
    color: ${({ theme }) => theme.color.primary};
    cursor: pointer;
  }
  .plan,
  .content-container,
  .comment-container {
    border-bottom: 1px solid #e7e7e7;
  }
  .content-container img {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  input[type="text"],
  input[type="date"],
  input[type="number"],
  textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: ${({ theme }) => theme.fontSize.large};
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin-top: 10px;
  }

  input[type="number"].small-input {
    width: 50%;
    font-size: ${({ theme }) => theme.fontSize.medium};
  }
  .item {
    font-weight: 400;
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }
  .item-plan {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }

  .days {
    display: flex;
    gap: 10px;
  }
  .day {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.routeGray};
    gap: 4px;
  }

  textarea {
    min-height: 200px;
  }
  .no-schedule {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    .edit-info {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 10px;
      gap: 1rem;
    }
    .edit-expense,
    .edit-date {
      justify-content: flex-start;
      gap: 10px;
    }
    .days {
      flex-direction: column;
      gap: 4px;
    }

    .day {
      white-space: nowrap;
    }
    input[type="number"].small-input {
      width: 100%;
    }
    .btn-wrapper {
      gap: 10px;
    }
    .trip-container {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    .date-title,
    .expense-title {
      font-size: ${({ theme }) => theme.fontSize.small};
    }
    .edit-date,
    .edit-expense {
      justify-content: flex-start;
    }
  }
`;

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 330px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;

  h3 {
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    cursor: pointer;
  }

  button {
    margin-top: 20px;
  }

  @media ${({ theme }) => theme.mediaQuery.mobile} {
    width: 100%;
    height: 50%;
    top: auto;
    bottom: 0;
  }
`;

export default PostEditPage;
