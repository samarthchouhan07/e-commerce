"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUser } from "@clerk/nextjs";

const formSchmea = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  deadline: z.string(),
  tags: z.array(z.string()).min(1),
});

export const CreateFormProblem = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchmea>>({
    resolver: zodResolver(formSchmea),
  });
  const { user } = useUser();

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchmea>) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/problems", {
        ...data,
        tags,
        userId: user?.id,
      });

      reset();
      setTags([]);
      toast.success("Real world Problem created");
    } catch (error) {
      console.log("Error while creating the real world problem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl mx-auto p-4"
    >
      <Input placeholder="Title" {...register("title")} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Textarea placeholder="Description" {...register("description")} className="h-80" />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <div>
        <Input
          placeholder="Add tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag)}
        />

        <Button
          type="button"
          variant={"secondary"}
          onClick={addTag}
          className="mt-2"
        >
          Add tag
        </Button>
        <div>
          {tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Select onValueChange={(value) => setValue("difficulty", value as any)}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EASY">Easy</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HARD">Hard</SelectItem>
        </SelectContent>
      </Select>
      <Input type="datetime-local" {...register("deadline")} />
      {errors.deadline && (
        <p className="text-red-500">{errors.deadline.message}</p>
      )}

      <Button type="submit">{loading ? "Creating...." : "Create Problem"}</Button>
    </form>
  );
};
