import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button } from "@/components/common/Button";
import { theme } from "@/styles/theme";
import { Country, regions } from "@/data/region";
import RegionCountrySelector from "@/components/common/RegionCountrySelector";
import ScheduleCard from "@/components/common/scheduleCard";
import { useSchedule } from "@/hooks/useMypage";
import { useScheduleDetails } from "@/hooks/useScheduleDetails";
import icons from "@/icons/icons";
import { showAlert } from "@/utils/showAlert";
import { httpClient } from "@/apis/https";

// 이미지 업로드 함수
const uploadImage = async (file: File) => {
  try {
    if (!file) return null;
    const formData = new FormData();
    formData.append("posts", file);

    const response = await httpClient.post("/posts/1/upload/img", formData, {
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

const WritePage = () => {
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [expense, setExpense] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showSidebar, setShowSidebar] = useState(false); // 사이드바 상태
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>(undefined);

  const sidebarRef = useRef<HTMLDivElement>(null); // 사이드바 참조 생성

  const { schedules, isEmptySchedules, scheduleRefetch } = useSchedule(); // 일정 데이터 가져오기
  const { scheduleDetailData, isScheduleDetailsLoading } = useScheduleDetails(selectedScheduleId); // 일정 세부 데이터 가져오기
  const { PinIcon } = icons;

  useEffect(() => {
    if (showSidebar) {
      scheduleRefetch();
    }
  }, [showSidebar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  const handleDateChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSave = async () => {
    const editorContent = new DOMParser().parseFromString(data, "text/html");
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
      title: title || "기본 제목",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      expense: expense || 0,
      author: "작성자 이름",
      continent: selectedRegion.toString(),
      country: selectedCountry.toString(),
      journeyId: selectedScheduleId || undefined,
      contents: cleanedContent,
      postsImg: firstImageUrl,
    };

    console.log("Payload to be sent to the server:", JSON.stringify(payload, null, 2));

    try {
      const response = await httpClient.post("/posts", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error(`Failed to save post. Status code: ${response.status}`);
      }
      console.log("저장 성공:", response.data);
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

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

  const handleRegionChange = (event: { target: { value: string } }) => {
    const regionId = parseInt(event.target.value);
    const region = regions.find((region) => region.id === regionId);
    setCountries(region ? region.countries : []);
    setSelectedRegion(regionId);
    setSelectedCountry(0);
  };

  const handleCountryChange = (event: { target: { value: string } }) => {
    setSelectedCountry(parseInt(event.target.value));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleScheduleClick = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId.toString());
  };

  return (
    <WritePageStyle>
      <div className="title-content">
        <RegionCountrySelector
          regions={regions}
          selectedRegion={selectedRegion}
          selectedCountry={selectedCountry}
          countries={countries}
          onRegionChange={handleRegionChange}
          onCountryChange={handleCountryChange}
        />
        <input
          type="text"
          className="title"
          placeholder="제목을 입력하세요."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="info-container">
        <label>
          여행한 날짜
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            dateFormat="yyyy.MM.dd"
            isClearable={true}
            placeholderText="날짜 범위를 선택하세요"
          />
        </label>
        <label>
          총 여행 경비
          <input
            type="number"
            placeholder="금액을 입력해주세요.(숫자만 입력)"
            onChange={(e) => setExpense(parseInt(e.target.value))}
          />
        </label>
        <p className="plan" onClick={toggleSidebar}>
          내 일정 불러오기
        </p>
      </div>
      {selectedScheduleId && !isScheduleDetailsLoading && scheduleDetailData && (
        <div className="daily-schedule">
          {scheduleDetailData.days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <PinIcon />

              <span>Day {dayIndex + 1} - </span>
              <span>
                {day.spots.map((spot, spotIndex) => (
                  <span key={spotIndex}>
                    {spotIndex > 0 && "•"}
                    {spot.placeName}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
      <CKEditor
        editor={ClassicEditor}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
        }}
        data={data}
        onChange={(event, editor) => {
          const newData = editor.getData();
          if (newData !== data) {
            setData(newData);
          }
        }}
      />
      <div className="button-container">
        <Button $size="large" $scheme="secondary" $radius="default">
          취소
        </Button>
        <Button $size="large" $scheme="primary" $radius="default" onClick={handleSave}>
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
                  <ScheduleCard scheduleProps={schedule} view="list" />
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
    </WritePageStyle>
  );
};

const WritePageStyle = styled.div`
  .title-content,
  .info-container {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .title {
    width: 100%;
    border: none;
    border-bottom: 1px solid #e7e7e7;
    font-size: ${theme.fontSize.xlarge};
    color: black;
    font-family: inherit;
  }
  input {
    width: 200px;
  }
  .info-container label,
  .button-container {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
  .continent-country {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .continent,
  .country {
    width: 120px;
    padding: 8px 12px;
  }

  select {
    padding: 8px;
  }
  .day-plan {
    margin-top: -20px;
  }
  .plan {
    color: ${({ theme }) => theme.color.primary};
    cursor: pointer;
  }
  .info-container {
    justify-content: space-between;
  }
  .ck-editor__editable {
    min-height: 400px;
    max-height: 600px;
  }

  .button-container {
    margin-top: 20px;
  }
  .daily-schedule {
    color: ${({ theme }) => theme.color.routeGray};
  }
  .close-button {
    text-align: center;
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

export default WritePage;
