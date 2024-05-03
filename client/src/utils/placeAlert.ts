import Swal from "sweetalert2";
import "@/styles/customPlace.css";
import logoImage from "/assets/images/logo-profile.png"; // assuming this is the logo image

const dummyDate = {
  title: "CU 충무로점",
  address: "대한민국 서울특별시 중구 충무로 3가 57-6",
  phone: "02-2274-4345",
};

export const swalStyleButton = Swal.mixin({
  customClass: {
    popup: "popup",
    confirmButton: "confirmButton",
    cancelButton: "cancelButton",
    title: "title",
    htmlContainer: "htmlContainer",
  },
  buttonsStyling: false,
});

export const showFavoriteModal = (title: string, address: string, phone: string) => {
  const imageUrl = new URL(logoImage, import.meta.url).toString();

  swalStyleButton
    .fire({
      title: `<strong>${title}</strong>`,
      html: `<img src="/mnt/data/image.png" alt="Location Image" class="image" /><div><strong>Address:</strong> ${address}</div><div><strong>Phone:</strong> ${phone}</div>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Favorite",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        console.log("Location favorited!");
      }
    });
};
