import Layout from "@/components/layout/Layout";
import ErrorPage from "@/pages/ErrorPage";
import JoinPage from "@/pages/JoinPage";
import LoginPage from "@/pages/LoginPage";
import MainPage from "@/pages/MainPage";
import PostDetailPage from "@/pages/PostDetailPage";
import PostEditPage from "@/pages/PostEditPage";
import Mypage from "@/pages/Mypage";
import PostPage from "@/pages/PostPage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import ProfileResetPassword from "@/pages/ProfileResetPassword";
import ResetPage from "@/pages/ResetPassword";
import ScheduleDetailPage from "@/pages/ScheduleDetailPage";
import ScheduleEditPage from "@/pages/ScheduleEditPage";
import SchedulePage from "@/pages/SchedulePage";
import WritePage from "@/pages/WritePage";
import { Navigate, createBrowserRouter, useNavigate } from "react-router-dom";
import { showAlert } from "@/utils/showAlert";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  if (!token) { 
    showAlert("로그인이 필요한 서비스입니다.\n로그인 후 이용해주세요.", "logo", ()=> navigate("/login"))
    return;
  } 

  return <>{children}</>;
};

const ErrorLayoutWrapper = () => (
  <Layout>
    <ErrorPage />
  </Layout>
);

const routerArr = [
  {
    path: "/",
    element: <Layout children={<MainPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/join",
    element: <Layout children={<JoinPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/login",
    element: <Layout children={<LoginPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/reset",
    element: <Layout children={<ResetPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/post",
    element: <Layout children={<PostPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/post/:id",
    element: <Layout children={<PostDetailPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/post/:id/edit",
    element: <Layout children={<PostEditPage />} />,
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/write",
    element: (
      <PrivateRoute>
        <Layout children={<WritePage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/schedule",
    element: (
      <PrivateRoute>
        <Layout isFull={true} children={<SchedulePage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/schedule/:id",
    element: (
      <PrivateRoute>
        <Layout children={<ScheduleDetailPage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/schedule/:id/edit",
    element: (
      <PrivateRoute>
        <Layout isFull={true} children={<ScheduleEditPage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/mypage",
    element: (
      <PrivateRoute>
        <Layout children={<Mypage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/me",
    element: (
      <PrivateRoute>
        <Layout children={<ProfileEditPage />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/me/reset",
    element: (
      <PrivateRoute>
        <Layout children={<ProfileResetPassword />} />
      </PrivateRoute>
    ),
    errorElement: <ErrorLayoutWrapper />,
  },
  {
    path: "/error",
    element: <ErrorLayoutWrapper />,
  },
];

export const router = createBrowserRouter(routerArr);
