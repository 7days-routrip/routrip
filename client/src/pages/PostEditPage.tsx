import { useParams, useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { httpClient } from "@/apis/https";
import { DetailPost } from "@/models/post.model";
import { Button } from "@/components/common/Button";
import { showAlert } from "@/utils/showAlert";
import icons from "@/icons/icons";
import { theme } from "@/styles/theme";
import ScheduleCard from "@/components/common/scheduleCard";
import { useSchedule } from "@/hooks/useMypage";
import { useScheduleDetails } from "@/hooks/useScheduleDetails";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import WriteTopBtn from "@/components/common/WriteTopBtn";

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
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [totalExpense, setTotalExpense] = useState<number | string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>(undefined);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule();
  const { scheduleDetailData } = useScheduleDetails(selectedScheduleId);
  const nav = useNavigate();
  const { PinIcon, LikeIcon, CommentIcon, EditIcon } = icons;

  const [region, setRegion] = useState(0);
  const [country, setCountry] = useState(0);

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

        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setRegion(fetchedPost.continent.id);
        setCountry(fetchedPost.country.id);
        setContent(fetchedPost.contents);
        setTotalExpense(fetchedPost.totalExpense || "");

        if (fetchedPost.date) {
          const [start, end] = fetchedPost.date.split(" - ").map((date: string) => new Date(date));
          setDateRange([isNaN(start.getTime()) ? null : start, isNaN(end.getTime()) ? null : end]);
        }
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
      setDateRange([start, end]);
    }
  }, [selectedScheduleId, scheduleDetailData]);

  const handleSave = async () => {
    try {
      const editorContent = new DOMParser().parseFromString(content, "text/html");
      const images = editorContent.querySelectorAll("img");
      let firstImageUrl = "";
      const imageUrls = [];

      // 이미지 업로드 처리
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.src.startsWith("data:")) {
          const blob = dataURLtoBlob(img.src);
          if (blob) {
            const file = new File([blob], `image_${i}.png`, { type: blob.type });
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
              img.src = imageUrl; // src를 업로드된 이미지 URL로 대체
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
            firstImageUrl = img.src; // 첫 번째 이미지를 썸네일로 사용
          }
        }
      }

      // 이미지 URL 업데이트 후 콘텐츠를 새로 가져옴
      const updatedContent = new XMLSerializer().serializeToString(editorContent);

      // XML 네임스페이스 제거
      const cleanedContent = updatedContent.replace('xmlns="http://www.w3.org/1999/xhtml"', "");

      const payload = {
        title: title,
        contents: cleanedContent,
        date: `${dateRange[0]?.toISOString().split("T")[0]} - ${dateRange[1]?.toISOString().split("T")[0]}`,
        totalExpense: totalExpense.toString(),
        continent: region,
        country: country,
        journeyId: selectedScheduleId,
      };

      await httpClient.patch(`/posts/${postId}`, payload);
      showAlert("게시물이 수정되었습니다.", "logo", () => {
        nav(`/post/${postId}`);
      });
    } catch (error) {
      console.error("Error updating post:", error);
      showAlert("게시물 수정에 실패했습니다.", "error");
    }
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
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
      setDateRange([start, end]);
      setShowSidebar(false); // Close the sidebar after selecting a schedule
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (sidebarRef.current && !sidebarRef.current.contains(target)) {
      setShowSidebar(false);
    }
    if (isDatePickerOpen && !target.closest(".react-datepicker")) {
      setIsDatePickerOpen(false);
    }
  };

  useEffect(() => {
    if (isDatePickerOpen || showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen, showSidebar]);

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
        <div className="info-container">
          <p color={theme.color.commentGray}>작성일 : {post.date}</p>
          <div className="btn-wrapper">
            <div>
              <LikeIcon /> {post.likesNum}
            </div>
            <div>
              <CommentIcon /> {post.commentsNum}
            </div>
            {post.author}
          </div>
        </div>
        <div className="trip-container">
          <div className="edit-date">
            <span>여행한 날짜</span>
            <div>
              {isDatePickerOpen
                ? `${dateRange[0]?.toLocaleDateString()} - ${dateRange[1]?.toLocaleDateString()}`
                : post.date}
            </div>
            <div>
              <EditIcon onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} />
            </div>
          </div>
          {isDatePickerOpen && (
            <div className="date-picker-container">
              <DatePicker
                selected={dateRange[0]}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateChange}
                selectsRange
                inline
                dateFormat="yyyy.MM.dd"
                onClickOutside={() => setIsDatePickerOpen(false)}
              />
            </div>
          )}
          <div className="edit-expense">
            <span>총 여행 경비</span>
            <input
              type="number"
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
        <div className="place-container">
          {scheduleDetailData?.days.map((day, index) => (
            <div key={index}>
              <PinIcon /> DAY {index + 1} -{" "}
              {day.spots.map((spot, i) => (
                <span key={i}>
                  {spot.placeName} {i < day.spots.length - 1 && "• "}{" "}
                </span>
              ))}
              <br />
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
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>
        <div className="btn-wrapper">
          <Button $size="medium" $scheme="primary" $radius="default" onClick={handleSave}>
            저장
          </Button>
          <Button $size="medium" $scheme="secondary" $radius="default" onClick={() => nav(-1)}>
            취소
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

const PostEditPageStyle = styled.div`
  .info-container {
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    margin-top: -20px;
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
    gap: 10px;
  }
  span {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
  }

  .place-container {
    color: ${({ theme }) => theme.color.routeGray};
  }

  .edit-date {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .edit-expense {
    display: flex;
    gap: 10px;
    align-items: center;
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
    padding: 0.25rem;
    font-size: ${({ theme }) => theme.fontSize.medium};
  }

  textarea {
    min-height: 200px;
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
`;

export default PostEditPage;
