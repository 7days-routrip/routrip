import { getAbroadPosts, getBestPosts, getHomePosts } from "@/apis/main.api";
import { queryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useMain = () => {
  const { data: bestPosts, isLoading: isBestPostsLoading } = useQuery({
    queryKey: [queryKey.bestPosts],
    queryFn: getBestPosts,
  });

  const { data: homePosts, isLoading: isHomePostsLoading } = useQuery({
    queryKey: [queryKey.homePosts],
    queryFn: getHomePosts,
  });

  const { data: abroadPosts, isLoading: isAbroadPostsLoading } = useQuery({
    queryKey: [queryKey.abroadPosts],
    queryFn: getAbroadPosts,
  });

  return { bestPosts, homePosts, abroadPosts, isBestPostsLoading, isHomePostsLoading, isAbroadPostsLoading };
};
