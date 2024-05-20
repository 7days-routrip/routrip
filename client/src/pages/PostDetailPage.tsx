import { addNewSchedule } from "@/apis/schedule.api";
import { SelectedPlace } from "@/stores/addPlaceStore";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
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
import { AxiosError } from "axios";
import { DEFAULT_IMAGE } from "@/components/common/ProfileCard";

const StyledLikeIcon = styled(icons.LikeIcon)`
  fill: ${({ theme }) => theme.color.primary};
`;

const StyledCommentIcon = styled(icons.CommentIcon)`
  fill: ${({ theme }) => theme.color.primary};
`;

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  const { DotIcon, PinIcon, LikeIcon, TrashIcon, EditIcon, RightArrowIcon } = icons;
  const [post, setPost] = useState<DetailPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [scheme, setScheme] = useState<"primary" | "secondary">("secondary");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const nav = useNavigate();

  const fetchPost = useCallback(async () => {
    // useCallback으로 래핑
    try {
      const response = await httpClient.get(`/posts/${postId}`);
      const postData: DetailPost = response.data;
      setPost(postData);
      setIsLiked(postData.liked || false); // liked 상태 설정
      setScheme(postData.liked ? "primary" : "secondary"); // scheme 상태 설정
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, [postId]); // 의존성 배열 추가

  const fetchComments = useCallback(async () => {
    // useCallback으로 래핑
    if (postId === undefined) {
      console.error("Post ID가 undefined입니다.");
      return;
    }

    try {
      const response = await httpClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 404) {
        console.warn("댓글이 없습니다.:", postId);
        setComments([]);
      } else {
        console.error("댓글이 없습니다.:", error);
      }
    }
  }, [postId]); // 의존성 배열 추가

  function isAxiosError(error: any): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  useEffect(() => {
    const nickName = localStorage.getItem("nickName");
    setCurrentUser(nickName);

    if (postId !== undefined) {
      fetchPost();
      fetchComments();
    }
  }, [postId, fetchPost, fetchComments]); // 의존성 배열에 fetchPost, fetchComments 추가

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
      if (isLiked) {
        await httpClient.delete(`/likes/posts/${postId}`);
        setPost((prevPost) =>
          prevPost ? { ...prevPost, likesNum: (parseInt(prevPost.likesNum) - 1).toString() } : prevPost,
        );
        setScheme("secondary");
      } else {
        await httpClient.post(`/likes/posts/${postId}`);
        setPost((prevPost) =>
          prevPost ? { ...prevPost, likesNum: (parseInt(prevPost.likesNum) + 1).toString() } : prevPost,
        );
        setScheme("primary");
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopySchedule = async () => {
    console.log("handleCopySchedule 호출됨");
    if (isLoading) return;
    setIsLoading(true);

    if (!post || !post.journeys || !post.journeys.spots) {
      showAlert("일정이 없습니다.", "error");
      setIsLoading(false);
      return;
    }

    const allDaysPlaces: SelectedPlace[][] = post.journeys.spots.map((day) =>
      day.spot.map((spot) => ({
        id: spot.placeId,
        uuid: spot.placeId,
        placeName: spot.name,
        address: spot.address,
        tel: spot.tel,
        location: { lat: 0, lng: 0 },
        openingHours: spot.openingHours,
        // siteUrl: spot.siteUrl,
      })),
    );

    const newSchedule = {
      title: post.title,
      startDate: new Date(post.date.split("-")[0]),
      endDate: new Date(post.date.split("-")[1]),
      allDaysPlaces: allDaysPlaces,
    };

    try {
      await addNewSchedule(newSchedule);
      showAlert("일정이 내 일정에 추가되었습니다.", "logo");
    } catch (error) {
      console.error("Error creating schedule:", error);
      showAlert("일정 추가에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number | bigint) => {
    return new Intl.NumberFormat().format(num);
  };

  if (!post) {
    return null;
  }

  return (
    <PostDetailPageStyle>
      <WriteTopBtn isWriting={true} />
      <div className="region-container">
        <PinIcon />
        <div>
          {post.continent.name} <RightArrowIcon />
          {post.country.name}
        </div>
      </div>
      <div className="title-container">
        <h1>{post.title}</h1>
        <div className="create-day" color={theme.color.commentGray}>
          {post.createdAt.substring(0, 11)}
        </div>
      </div>
      <div className="info-container">
        <div className="info-wrapper">
          <div className="info-left">
            <div className="profile">
              <img src={`${post.profileImg ? post.profileImg : DEFAULT_IMAGE}`} alt="profile" />
            </div>
            <span>{post.author}</span>
          </div>
          <div className="info-right">
            <div>
              <StyledLikeIcon />
              {post.likesNum}
            </div>
            <div>
              <StyledCommentIcon />
              {post.commentsNum}
            </div>
            {currentUser === post.author && (
              <div className="writer-panel">
                <div className="edit-panel">
                  <EditIcon />
                  <StyledLink to={`/post/${postId}/edit`}>수정</StyledLink>
                </div>
                <div className="delete-panel">
                  <TrashIcon />
                  <DropdownItem onClick={confirmDelete}>삭제</DropdownItem>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="trip-container">
        <p>
          <span>여행한 날짜</span> {post.date}
        </p>
        <p>
          <span>총 여행 경비</span> {formatNumber(parseInt(post.totalExpense))}원
        </p>
      </div>
      {post.journeys && post.journeys.spots && post.journeys.spots.length > 0 && (
        <div className="place-container">
          {post.journeys.spots.map((spotData, dayIndex) => (
            <div key={dayIndex} className="days">
              <div className="day">
                <PinIcon /> DAY {dayIndex + 1}{" "}
              </div>
              <div className="route">
                {spotData.spot.length > 0 ? (
                  spotData.spot.map((spot, spotIndex) => (
                    <span key={spotIndex} onClick={() => handlePlaceClick(spot)} className="item">
                      {spotIndex > 0 && <RightArrowIcon />}
                      {spot.name}
                    </span>
                  ))
                ) : (
                  <span>추가된 일정이 없습니다.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="plan" onClick={handleCopySchedule}>
        🗒️ 전체 일정 담아가기
      </div>
      <div className="content-container" dangerouslySetInnerHTML={{ __html: post.contents }} />
      <div className="btn-wrapper">
        <Button $size="medium" $scheme={scheme} $radius="default" onClick={handleLike}>
          <LikeIcon /> {post.likesNum}
        </Button>
        <Button $size="medium" $scheme="secondary" $radius="default" onClick={() => nav(-1)}>
          목록
        </Button>
      </div>
      <div className="comment-container">
        {currentUser ? (
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
        ) : null}

        {comments.map((comment) => (
          <PostCommentCard
            key={comment.id}
            commentProps={comment}
            currentUser={currentUser}
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
    width: 100%;
    justify-content: space-between;
  }
  .region-container {
    margin-top: 10px;
    color: ${({ theme }) => theme.color.routeGray};
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: 400;

    > div {
      display: flex;
      align-items: center;
    }
  }
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      margin: 0 0 10px 0;
    }
  }

  .create-day {
    color: ${({ theme }) => theme.color.commentGray};
  }
  .info-wrapper,
  .btn-wrapper {
    display: flex;
    width: inherit;
    gap: 20px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .info-wrapper {
    justify-content: space-between;
  }

  .trip-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .plan {
    font-weight: 600;
    margin-top: 20px;
    cursor: pointer;
  }
  span {
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-weight: bold;
  }

  .place-container {
    .days {
      display: flex;
      gap: 1rem;
    }
    .day {
      color: ${({ theme }) => theme.color.routeGray};
      font-size: ${({ theme }) => theme.fontSize.small};
      font-weight: 500;
    }

    .route {
      display: flex;
      > span {
        font-size: ${({ theme }) => theme.fontSize.xsmall};
        font-weight: 400;
      }
      .item {
        display: flex;
        align-items: center;
      }
    }
    > div {
      cursor: pointer;
    }
  }
  .btn-submit {
    text-align: right;
    margin: 20px 0px;
  }

  .plan,
  .content-container,
  .comment-container {
    padding-bottom: 10px;
  }

  .comment-container {
    textarea {
      resize: none;
    }
  }
  .content-container .image {
    width: unset;
    height: unset;
  }
  .content-container img {
    height: auto;
    display: block;
    margin: 20px auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .writer-panel {
    a {
      width: auto;
    }
  }

  .profile > img {
    width: 2.5rem;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
  }
  .info-left,
  .info-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-right {
    gap: 1.5rem;

    div {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }

  .writer-panel,
  .edit-panel,
  .delete-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
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
