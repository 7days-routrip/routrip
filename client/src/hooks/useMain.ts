import { getAbroadPosts, getBestPosts, getHomePosts, getRecommendPosts } from "@/apis/main.api";
import { queryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useMain = () => {
  const { data: bestPosts, isLoading: isBestPostsLoading } = useQuery({
    queryKey: [queryKey.bestPosts],
    queryFn: getBestPosts,
  });

    
  const { data: recommendPosts, isLoading: isrecommendPostsLoading } = useQuery({
    queryKey: [queryKey.recommendPosts],
    queryFn: getRecommendPosts,
  });

  const { data: homePosts, isLoading: isHomePostsLoading } = useQuery({
    queryKey: [queryKey.homePosts],
    queryFn: getHomePosts,
  });

  const { data: abroadPosts, isLoading: isAbroadPostsLoading } = useQuery({
    queryKey: [queryKey.abroadPosts],
    queryFn: getAbroadPosts,
  });

  return { bestPosts, recommendPosts, homePosts, abroadPosts, isBestPostsLoading, isrecommendPostsLoading,isHomePostsLoading, isAbroadPostsLoading };
};
