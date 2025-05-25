"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "",
    maxScore: 0,
    subcategoryId: "",
    type: "",
    format: "",
    language: "",
    framework: "",
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const router = useRouter();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/api/categories-with-subcategories"
      );
      return response.data;
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", form);
      toast.success("Task created Successfully");
      router.push("/");
    } catch (error) {
      console.log("error while creating task", error);
      toast.error("Error while creating task");
    }
  };

  const selectedCategory = categories?.find(
    (cat: any) => cat.id === selectedCategoryId
  );

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Create new task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Difficulty</Label>
          <Select
            onValueChange={(value) => setForm({ ...form, difficulty: value })}
            value={form.difficulty}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Max Score</Label>
          <Input
            type="number"
            name="maxScore"
            value={form.maxScore}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select
            onValueChange={(value) => setForm({ ...form, type: value })}
            value={form.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="Coding">Coding</SelectItem>
              <SelectItem value="Writeup">Writeup</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Format</Label>
          <Select
            onValueChange={(value) => setForm({ ...form, format: value })}
            value={form.format}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
              <SelectItem value="Code Submission">Code Submission</SelectItem>
              <SelectItem value="Writeup">Writeup</SelectItem>
              <SelectItem value="Link Submission">Link Submission</SelectItem>
              <SelectItem value="File Upload">File Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Language (Optional)</Label>
          <Input
            name="language"
            value={form.language}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Framework (Optional)</Label>
          <Input
            name="framework"
            value={form.framework}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Categories</Label>
          {isLoading ? (
            <p>Loading subcategories...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <Select
              onValueChange={(value) => {
                setSelectedCategoryId(value);
                setForm({ ...form, subcategoryId: "" });
              }}
              value={selectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label>Subcategories</Label>
          {selectedCategory ? (
            <Select
              value={form.subcategoryId}
              onValueChange={(value) =>
                setForm({ ...form, subcategoryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory.subcategories.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Select a category</p>
          )}
        </div>
        <Button type="submit">Create Task</Button>
      </form>
    </div>
  );
}
