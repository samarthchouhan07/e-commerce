"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";

interface UserProfileData {
  userId: string;
  name: string;
  imageUrl: string;
  points: number;
  solutionCount: number;
  totalVotes: number;
  rank: number;
}

export const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/users/${userId}/profile`
      );
      return res.data;
    },
  });
  if (isLoading) return <div className="flex justify-center items-center h-[50vh]">
  <Loader className="animate-spin text-muted-foreground text-xs" />
</div>
  if (error) return <p>Error loading profile...</p>;
  if (!data) return;
  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <Image
          src={data?.imageUrl}
          alt={data?.name}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold">{data.name}</h2>
        <p>Rank : #{data.rank}</p>
      </div>
      <div className="mt-4">
        <p>Total Points: {data.points}</p>
        <p>Solutions Uploaded: {data.solutionCount}</p>
        <p>Votes Received: {data.totalVotes}</p>
      </div>
    </div>
  );
};
