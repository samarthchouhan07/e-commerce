import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useComments = (solutionId: string) => {
  return useQuery({
    queryKey: ["comments", solutionId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/solutions/comments/${solutionId}`
      );
      return res.data;
    },
  });
};

export const usePostComment = (solutionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: { userId: string; text: string }) => {
      const res = await axios.post(
        `http://localhost:5000/api/solutions/comments/${solutionId}`,
        comment
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", solutionId] });
    },
  });
};