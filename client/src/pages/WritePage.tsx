import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button } from "@/components/common/Button";
import { theme } from "@/styles/theme";
import icons from "@/icons/icons";

// Base64 업로드 어댑터 구현
class FileUploadAdapter {
  loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return new Promise((resolve, reject) => {
      // Promise 생성자 내부에서 resolve와 reject를 사용
      this.loader.file.then((file: string | Blob) => {
        console.log("Uploading file:", file); // 업로드 직전 Blob 상태 확인
        const formData = new FormData();
        formData.append("file", file);

        fetch("http://localhost:1234/api/posts", {
          method: "POST",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIm5pY2tOYW1lIjoiNnVhbXkiLCJpYXQiOjE3MTUyNDg2NjcsImV4cCI6MTcxNTI1MDQ2N30.3zUJI0wtgJJ_cwbWUZX-cs9vZOf8hP0SbgKl0hBrX4s",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            console.log("Upload success, server response:", result); // 서버 응답 로그
            resolve({ default: result.url }); // 성공적으로 업로드되면 서버에서 받은 URL을 resolve로 전달
          })
          .catch((error) => {
            console.error("File upload error:", error);
            reject(error); // 오류 발생 시 reject 함수를 호출하여 오류 전달
          });
      });
    });
  }
  // 업로드 중단 처리
  abort() {
    console.log("Upload aborted.");
  }
}

// CKEditor에 플러그인으로 어댑터 추가
function MyCustomUploadAdapterPlugin(editor: {
  plugins: { get: (arg0: string) => { (): any; new (): any; createUploadAdapter: (loader: any) => FileUploadAdapter } };
}) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new FileUploadAdapter(loader);
  };
}

const WritePage = () => {
  const [data, setData] = useState("");
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
              if (Array.isArray(update)) {
                const [start, end] = update;
                if (start) setStartDate(start);
                if (end) setEndDate(end);
              }
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
