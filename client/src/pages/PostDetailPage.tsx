import { useParams } from "react-router-dom";
import styled from "styled-components";

const PostDetailPage = () => {
  const { id } = useParams();

  return <PostDetailPageStyle>개별 페이지</PostDetailPageStyle>;
};

const PostDetailPageStyle = styled.div``;

export default PostDetailPage;
