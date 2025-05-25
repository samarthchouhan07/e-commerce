"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

interface CategoryPageProps{
  params:{
    subcategoryId:string
  }
}

export default function CategoryPage({params}:CategoryPageProps) {
  const subcatId = params.subcategoryId;
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", subcatId],
    queryFn: async ({queryKey}) => {
      const [_key,subcatId]=queryKey
      console.log("subcategoryId:",subcatId)

      const response = await axios.get(`http://localhost:5000/api/tasks/${subcatId}`, 
      );
      return response.data;
    },
    enabled: !!subcatId,
  });
  console.log("tasks",tasks)

  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks for subcategory</h1>
      {tasks?.length === 0 && <p>No tasks found for this subcategories.</p>}
      <ul className="space-y-4">
        {tasks?.map((task: any) => (
          <li
            key={task.id}
            className="border rounded p-4 hover:shadow-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{task.name}</h2>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
