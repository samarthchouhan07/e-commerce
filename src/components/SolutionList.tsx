"use client";
import { useSolutions } from "@/hooks/useSolutions";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Heart, HeartOffIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CommentModal } from "./commentModal";

interface SolutionListProps {
  problemId: string;
}

interface Solution {
  id: string;
  githubUrl: string;
  liveUrl: string;
  videoUrl: string;
  notes: string;
  createdAt: string;
  user: any;
}

export const SolutionList = ({ problemId }: SolutionListProps) => {
  const { data, isLoading, isError } = useSolutions(problemId);
  const [upvotedMap, setUpvotedMap] = useState<{ [key: string]: boolean }>({});
  const { user } = useUser();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const [openModal, setOpenModal] = useState(false);
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);

  const handleOpenComments = (solutionId: string) => {
    setActiveSolutionId(solutionId);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setActiveSolutionId(null);
  };

  const { mutate: toggleUpvote } = useMutation({
    mutationFn: async (solutionId: string) => {
      const res: any = await axios.patch(
        `http://localhost:5000/api/solutions/${solutionId}/upvote`,
        { userId }
      );
      console.log(res);
      setUpvotedMap((prev) => ({
        ...prev,
        [solutionId]: res?.data.upvoted,
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions", problemId] });
    },
  });

  useEffect(() => {
    const fetchUserUpvotes = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          "http://localhost:5000/api/solutions/upvotes",
          {
            params: { userId, problemId },
          }
        );
        const upvoteIds = res.data;
        const initialMap: { [key: string]: boolean } = {};
        upvoteIds.forEach((id: string) => {
          initialMap[id] = true;
        });
        setUpvotedMap(initialMap);
      } catch (error) {
        console.log("Failed to fetch user upvotes:", error);
      }
    };
    fetchUserUpvotes();
  }, [userId, problemId]);

  if (isLoading) return <p>Loading solutions...</p>;
  if (isError) return <p>Failed to load solutions.</p>;
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No Solutions submitted yet.</p>;
  }

  if (!user) return;

  return (
    <div className="space-y-4">
      {data.map((sol: any) => (
        <div
          key={sol.id}
          className="border border-gray-300 rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center mb-2">
            {sol.user.image && (
              <Image
                src={sol.user.imageUrl}
                alt={"user_image"}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span className="font-semibold">{sol.user.email}</span>
            <span className="text-sm text-gray-400 ml-auto">
              {new Date(sol.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="space-x-4 mb-4">
            <Link
              href={sol.githubUrl}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </Link>
            <Link
              href={sol.liveUrl}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              Deployed solution
            </Link>
            <Link
              href={sol.videoUrl}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              Video
            </Link>
          </div>
          {sol.notes && (
            <p className="text-sm text-gray-700">
              <strong>Notes:</strong>
              {sol.notes}
            </p>
          )}
          <button
            onClick={() => toggleUpvote(sol.id)}
            disabled={isLoading}
            className="mt-2 flex"
          >
            {upvotedMap[sol.id] ? (
              <Heart className="text-red-500 fill-red-500" />
            ) : (
              <Heart />
            )}
            <span className="ml-2">{sol._count.Upvote}</span>
          </button>
          <Button
            onClick={() => handleOpenComments(sol.id)}
            className="flex items-center gap-1 mt-1"
          >
            <MessageCircle size={18} />
            <span>Comment</span>
            <span>{sol._count.Comment}</span>
          </Button>
        </div>
      ))}
      {activeSolutionId && (
        <CommentModal
          isOpen={openModal}
          onClose={handleClose}
          solutionId={activeSolutionId}
          userId={user?.id}
        />
      )}
    </div>
  );
};
