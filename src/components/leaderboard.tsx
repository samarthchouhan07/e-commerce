"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "./ui/card";
import Image from "next/image";
import { Loader } from "lucide-react";

interface LeaderboardUser {
  userId: string;
  name: string;
  imageUrl: string;
  points: number;
  solutionCount: number;
}

export const Leaderboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/leaderboard");
      return res.data;
    },
  });

  console.log(data);
  if (isLoading) return  <div className="flex justify-center items-center h-[50vh]">
  <Loader className="animate-spin text-muted-foreground text-xs" />
</div>
  return (
    <div className="grid gap-4">
      {data?.map((user: any, index: number) => {
        console.log(user);
        return (
          <Card key={user.userId} className="flex items-center p-4">
            <div className="text-xl font-bold w-8">#{index + 1}</div>
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name || "User"}
                width={40} 
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">
                {user.email && user.email.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="ml-4">
              <p className="font-medium">{user.name}</p>
              <p>Solutions Uploaded: {user.solutionCount}</p>
            </div>
            <div className="ml-auto font-bold text-green-600">
              {user.points}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
