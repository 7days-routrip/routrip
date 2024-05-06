import Layout from "@/components/layout/Layout";
import ErrorPage from "@/pages/ErrorPage";
import JoinPage from "@/pages/JoinPage";
import LoginPage from "@/pages/LoginPage";
import MainPage from "@/pages/MainPage";
import Mypage from "@/pages/Mypage";
import PostPage from "@/pages/PostPage";
import RestPage from "@/pages/ResetPassword";
import SchedulePage from "@/pages/SchedulePage";
import { createBrowserRouter } from "react-router-dom";

const routerArr = [
  {
    path: "/",
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/join",
    element: (
      <Layout>
        <JoinPage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/reset",
    element: (
      <Layout>
        <RestPage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/post",
    element: (
      <Layout>
        <PostPage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/schedule",
    element: (
      <Layout isFull={true}>
        <SchedulePage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/mypage",
    element: (
      <Layout>
        <Mypage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/error",
    element: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
];

export const router = createBrowserRouter(routerArr);
