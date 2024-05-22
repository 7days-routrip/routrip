import { deleteSchedule } from "@/apis/schedule.api";
import { showAlert } from "@/utils/showAlert";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useScheduleDelete = (id: string | undefined) => {
  const navigate = useNavigate();

  const { mutate: deleteScheduleMutate } = useMutation({
    mutationFn: () => (id ? deleteSchedule(id) : Promise.resolve(null)),
    onSuccess: () => navigate("/mypage?tag=schedules"),
    onError: (err: any) => {
      showAlert("알 수 없는 오류가 발생했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
      console.error(err);
    },
  });

  return { deleteScheduleMutate };
};
