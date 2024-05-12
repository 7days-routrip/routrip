import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button } from "@/components/common/Button";
import { theme } from "@/styles/theme";

// Custom Upload Adapter
class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      if (file instanceof Blob) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            resolve({ default: reader.result });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else {
        throw new Error("The file is not a Blob object.");
      }
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  abort() {
    console.log("File upload aborted.");
  }
}
function MyCustomUploadAdapterPlugin(editor: {
  plugins: { get: (arg0: string) => { (): any; new (): any; createUploadAdapter: (loader: any) => MyUploadAdapter } };
}) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

const WritePage = () => {
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [expense, setExpense] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    console.log("Start Date:", startDate, "End Date:", endDate);
  }, [startDate, endDate]);

  const handleDateChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", title || "기본 제목");
    formData.append("startDate", startDate.toISOString().split("T")[0]);
    formData.append("endDate", endDate.toISOString().split("T")[0]);
    formData.append("expense", expense || "0");
    formData.append("author", "작성자 이름");
    formData.append("continent", "1");
    formData.append("country", "1");
    formData.append("journeyId", "3");

    const editorContent = new DOMParser().parseFromString(data, "text/html");
    const images = editorContent.querySelectorAll("img");
    let imageIndex = 0;

    images.forEach((img) => {
      if (img.src.startsWith("data:")) {
        const blob = dataURLtoBlob(img.src);
        if (blob) {
          formData.append(`image_${imageIndex++}`, blob, `image_${imageIndex}.png`);
        } else {
          console.error("Failed to convert data URL to Blob.");
        }
      }
    });

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const textBlob = new Blob([data], { type: "text/html" });
    formData.append("contents", textBlob);

    fetch("http://localhost:1234/api/posts", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    })
      .then((response) => response.json())
      .then((result) => console.log("저장 성공:", result))
      .catch((error) => console.error("저장 실패:", error));
  };

  const dataURLtoBlob = (dataurl: string) => {
    const parts = dataurl.split(","),
      match = parts[0].match(/:(.*?);/);

    const mime = match ? match[1] : "application/octet-stream";
    const bstr = atob(parts[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <WritePageStyle>
      <div className="title-content">
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
            type="text"
            placeholder="금액을 입력해주세요.(숫자만 입력)"
            onChange={(e) => setExpense(e.target.value)}
          />
        </label>
        <p>내 일정 불러오기</p>
      </div>
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
`;

export default WritePage;
