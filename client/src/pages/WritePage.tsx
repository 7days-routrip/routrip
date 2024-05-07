import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Button from "@/components/common/Button";
import { theme } from "@/styles/theme";
import icons from "@/icons/icons";

// 이미지를 리사이징 및 압축
function resizeImage(file: Blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        img.src = e.target.result;
      } else {
        reject(new Error("FileReader result is not a string"));
      }

      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 조정된 최대 너비 및 높이
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;

        let width = img.width;
        let height = img.height;

        // 이미지 비율에 따라 크기 조정
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 이미지를 캔버스에 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // Canvas에서 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to blob conversion failed"));
            }
          },
          "image/jpeg",
          0.4,
        );
      };
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
// Base64 업로드 어댑터 구현
class Base64UploadAdapter {
  loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  // 파일을 읽고 Base64로 변환하는 로직
  async upload() {
    const file = await this.loader.file;
    const resizedImage = await resizeImage(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ default: reader.result });
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      if (resizedImage instanceof Blob) {
        reader.readAsDataURL(resizedImage);
      } else {
        reject(new Error("Expected Blob, got something else"));
      }
    });
  }
  // 업로드 중단 처리
  abort() {
    console.log("Upload aborted.");
  }
}

// CKEditor에 플러그인으로 어댑터 추가
function MyCustomUploadAdapterPlugin(editor: {
  plugins: {
    get: (arg0: string) => { (): any; new (): any; createUploadAdapter: (loader: any) => Base64UploadAdapter };
  };
}) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new Base64UploadAdapter(loader);
  };
}

const WritePage = () => {
  const [data, setData] = useState("");
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { CalendarIcon } = icons;

  const handleSave = () => {
    console.log("저장된 데이터:", data);
  };

  const formatDate = (date: string) => date.split("-").join(".");

  return (
    <WritePageStyle>
      <div className="title-content">
        <select>
          <option>옵션1</option>
          <option>옵션2</option>
        </select>
        <select>
          <option>옵션1</option>
          <option>옵션2</option>
        </select>
        <input type="text" className="title" placeholder="제목을 입력하세요." />
      </div>
      <div className="info-container">
        <label>
          여행한 날짜
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              const [start, end] = update;
              // 각 날짜를 독립적으로 업데이트
              if (start) setStartDate(start);
              if (end) setEndDate(end);
            }}
            dateFormat="yyyy.MM.dd"
          />
        </label>
        <label>
          총 여행 경비
          <input type="text" placeholder="금액을 입력해주세요.(₩)" />
        </label>
        <label>내 일정 불러오기</label>
      </div>
      <CKEditor
        editor={ClassicEditor}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "fontFamily",
            "fontSize",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "imageUpload",
            "blockQuote",
          ],
        }}
        data={data}
        onChange={(event, editor) => {
          const newData = editor.getData();
          if (newData !== data) {
            setData(newData);
            setIsDataUpdated(true);
          }
        }}
      />
      <div className="button-container">
        <Button size="large" scheme="secondary" radius="default">
          취소
        </Button>
        <Button size="large" scheme="primary" radius="default" onClick={handleSave}>
          저장
        </Button>
      </div>
    </WritePageStyle>
  );
};

const WritePageStyle = styled.div`
  .title-content {
    display: flex;
    margin-top: 20px;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
  .title-content select {
    height: 20px;
  }

  .title {
    width: 100%;
    border: none;
    border-bottom: 1px solid #e7e7e7;
    font-size: ${theme.fontSize.xlarge};
  }
  .info-container {
    display: flex;
    height: 20px;

    padding: 30px 0px;
    align-items: center;
    justify-content: space-between;
  }

  .info-container input {
    margin-left: 10px;
    width: 200px;
  }
  .ck-editor__editable {
    min-height: 400px;
    max-height: 600px;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
`;

export default WritePage;
