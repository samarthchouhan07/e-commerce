"use client";
import { SolutionList } from "@/components/SolutionList";

interface SolutionsIdPageProps {
  params: {
    id: string;
  };
}


export default function SolutionsIdPage({ params }: SolutionsIdPageProps) {
  const { id: problemId } = params;

  return (
    <div>
      <h2 className="text-2xl font-bold mt-6 mb-4">Solutions</h2>
      <SolutionList problemId={problemId}/>
    </div>
  );
}
