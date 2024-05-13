import "@/styles/customConfirm.css";
import logoImage from "/assets/images/logo-profile.png";
import ErrorImage from "/assets/images/logo-error.png";
import { swalStyleButton } from "./showConfirm";

// type 값에 따라 일반 로고, error 로고가 나옴
export const showAlert = (title: string, type: "logo" | "error", confirmCallback?: () => void) => {
  const image = type === "logo" ? logoImage : ErrorImage;
  const imageClass = type === "logo" ? "image" : "errorImage";
  const imageUrl = new URL(image, import.meta.url).toString();

  swalStyleButton
    .fire({
      html: `<img src="${imageUrl}" class="${imageClass}" />`,
      title: title,
      confirmButtonText: "확인",
      reverseButtons: true,
      allowOutsideClick: false,
    })
    .then((result) => {
      if (result.isConfirmed && confirmCallback) {
        confirmCallback();
      }
    });
};
