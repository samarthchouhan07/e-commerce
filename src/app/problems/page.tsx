"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader, Loader2, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  deadline: string;
  tags: string[];
};

export default function ProblemsPage() {
  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: async (): Promise<Problem[]> => {
      const { data } = await axios.get("http://localhost:5000/api/problems");
      return data;
    },
  });
  const [search, setSearch] = useState("");
  const router = useRouter();
  //   console.log("problems:",problems)
  const filteredProblems = problems?.filter((p) =>
    `${p.title}`.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader className="animate-spin text-muted-foreground text-xs" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load problem
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-semibold mb-4">
        Explore real-world problems
      </h1>
      <Input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />
      {filteredProblems?.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No Matching problems
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredProblems?.map((p) => (
            <>
              <Card className="" key={p.id}>
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2 line-clamp-3">{p.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(p.deadline).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.tags.map((tag) => (
                      <Badge key={tag} variant={"secondary"}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="mr-2"
                    onClick={() => router.push(`/problems/${p.id}`)}
                  >
                    create solution
                  </Button>
                  <Button
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/problems/solutions/${p.id}`);
                    }}
                  >
                    View Solutions
                  </Button>
                </CardContent>
              </Card>
            </>
          ))}
        </div>
      )}
    </div>
  );
}
