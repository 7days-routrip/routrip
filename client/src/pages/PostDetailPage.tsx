import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import icons from "@/icons/icons";
import Dropdown from "@/components/common/Dropdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { httpClient } from "@/apis/https";
import { DetailPost } from "@/models/post.model";
import { showAlert } from "@/utils/showAlert";
import { showConfirm } from "@/utils/showConfirm";
import { PostComment } from "@/models/comment.model";
import PostCommentCard from "@/components/common/PostComment";
import PlaceModal from "@/components/common/PlaceModal";
import { PlaceDetails } from "@/models/place.model";
import WriteTopBtn from "@/components/common/WriteTopBtn";

const StyledLikeIcon = styled(icons.LikeIcon)`
  fill: ${({ theme }) => theme.color.primary};
`;

const StyledCommentIcon = styled(icons.CommentIcon)`
  fill: ${({ theme }) => theme.color.primary};
`;

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const { DotIcon, PinIcon } = icons;
  const [post, setPost] = useState<DetailPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const nav = useNavigate();

  const fetchPost = async () => {
    try {
      const response = await httpClient.get(`/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async () => {
    if (postId === undefined) {
      console.error("Post ID is undefined");
      return;
    }

    try {
      const response = await httpClient.get(`/posts/${postId}/comments`);
      if (response.status === 404) {
        console.warn("Comments not found for post:", postId);
        setComments([]);
      } else {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const nickName = localStorage.getItem("nickName");
    setCurrentUser(nickName);

    if (postId !== undefined) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const handleDelete = async () => {
    try {
      await httpClient.delete(`/posts/${postId}`);
      showAlert("게시물이 삭제되었습니다.", "error", () => {
        if (post?.country.id === 1) {
          nav("/post?area=home");
        } else {
          nav("/post?area=abroad");
        }
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  const confirmDelete = () => {
    showConfirm("정말 삭제하시겠습니까?", handleDelete);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await httpClient.post("/comments", { postId, content: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await httpClient.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentEdit = async (commentId: number, updatedComment: string) => {
    try {
      await httpClient.put(`/comments/${commentId}`, { postId, content: updatedComment });
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handlePlaceClick = (spot: any) => {
    const place: PlaceDetails = {
      id: spot.placeId,
      placeName: spot.name,
      address: spot.address,
      location: { lat: 0, lng: 0 },
      tel: spot.tel,
      openingHours: spot.openingHours,
      siteUrl: spot.siteurl,
    };
    setSelectedPlace(place);
  };

  const handleModalClose = () => {
    setSelectedPlace(null);
  };

  const handleLike = async () => {
    try {
      await httpClient.post(`/posts/${postId}/like`);
      setPost((prevPost) =>
        prevPost ? { ...prevPost, likesNum: (parseInt(prevPost.likesNum) + 1).toString() } : prevPost,
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <PostDetailPageStyle>
      <WriteTopBtn isWriting={true} />
      <PinIcon />
      <span>
        {post.continent.name} ﹥ {post.country.name}
      </span>
      <h1>{post.title}</h1>
      <div className="info-container">
        <p color={theme.color.commentGray}>작성일 : {post.createdAt}</p>
        <div className="btn-wrapper">
          <div>
            <StyledLikeIcon />
            {post.likesNum}
          </div>
          <div>
            <StyledCommentIcon />
            {post.commentsNum}
          </div>
          {post.author}
          {currentUser === post.author && (
            <Dropdown toggleIcon={<DotIcon />}>
              <DropdownMenu>
                <DropdownItem>
                  <StyledLink to={`/post/${postId}/edit`}>수정</StyledLink>
                </DropdownItem>
                <DropdownItem onClick={confirmDelete}>삭제</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="trip-container">
        <p>
          <span>여행한 날짜</span> {post.date}
        </p>
        <p>
          <span>총 여행 경비</span> {post.totalExpense}
        </p>
      </div>
      {post.journeys && post.journeys.spots && post.journeys.spots.length > 0 && (
        <div className="place-container">
          {post.journeys.spots.map((spotData, dayIndex) => (
            <div key={dayIndex}>
              <PinIcon /> DAY {dayIndex + 1} -{" "}
              {spotData.spot.length > 0 ? (
                spotData.spot.map((spot, spotIndex) => (
                  <span key={spotIndex} onClick={() => handlePlaceClick(spot)}>
                    {spotIndex > 0 && " • "}
                    {spot.name}
                  </span>
                ))
              ) : (
                <span>추가된 일정이 없습니다.</span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="plan">🗒️ 전체 일정 담아가기</div>
      <div className="content-container" dangerouslySetInnerHTML={{ __html: post.contents }} />
      <div className="btn-wrapper">
        <Button $size="medium" $scheme="primary" $radius="default" onClick={handleLike}>
          <StyledLikeIcon /> {post.likesNum}
        </Button>
        <Button $size="medium" $scheme="secondary" $radius="default" onClick={() => nav(-1)}>
          목록
        </Button>
      </div>
      <div className="comment-container">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해주세요."
            rows={3}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <div className="btn-submit">
            <Button type="submit" $size="medium" $scheme="primary" $radius="default">
              등록
            </Button>
          </div>
        </form>
        {comments.map((comment) => (
          <PostCommentCard
            key={comment.id}
            commentProps={comment}
            onDelete={() => handleCommentDelete(comment.id)}
            onEdit={(updatedComment: string) => handleCommentEdit(comment.id, updatedComment)}
          />
        ))}
      </div>
      {selectedPlace && <PlaceModal placeId={selectedPlace.id} onClosed={handleModalClose} />}
    </PostDetailPageStyle>
  );
};

const PostDetailPageStyle = styled.div`
  .info-container {
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -20px;
  }
  .btn-wrapper {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    margin: 30px;
  }
  .trip-container {
    display: flex;
    justify-content: space-between;
  }
  span {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
  }

  .place-container {
    color: ${({ theme }) => theme.color.routeGray};
  }
  .btn-submit {
    text-align: right;
  }

  .plan,
  .content-container,
  .comment-container {
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 10px;
  }
  .content-container .image {
    width: unset;
    height: unset;
  }
  .content-container img {
    width: 100%;
    height: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DropdownMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
`;

const DropdownItem = styled.li`
  margin: 5px 0;
  font-size: 0.8rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;
  width: 100px;
  text-align: center;
`;

export default PostDetailPage;
