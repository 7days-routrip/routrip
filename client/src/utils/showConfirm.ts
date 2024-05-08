import Swal from "sweetalert2";
import "@/styles/customConfirm.css";
import logoImage from "/assets/images/logo-profile.png";

export const swalStyleButton = Swal.mixin({
  customClass: {
    popup: "popup", // 전체
    confirmButton: "confirmButton", // 확인
    cancelButton: "cancelButton", // 취소
    title: "title", // 타이틀
    htmlContainer: "htmlContainer", // 내용
  },
  buttonsStyling: false, // SweetAlert2의 기본 버튼 스타일링 비활성화
});

export const showConfirm = (title: string, callback: () => void) => {
  const imageUrl = new URL(logoImage, import.meta.url).toString();

  swalStyleButton
    .fire({
      html: `<img src="${imageUrl}" class="image" />`,
      title: title,
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "확인",
      reverseButtons: true, // 취소 확인 버튼 위치 반대로
    })
    .then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
};
