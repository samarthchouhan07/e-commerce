"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface ProblemsIdPageProps {
  params: {
    id: string;
  };
}
export default function ProblemsIdPage({ params }: ProblemsIdPageProps) {
  const { id: problemId } = params;
  const [video, setVideo] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const uploadVideoToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "elevateX");
    formData.append("folder", "elevatex/solutions");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkrffslax/video/upload",
      formData
    );

    return res.data.secure_url;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!video) throw new Error("No video selected");

      setUploading(true);
      const videoUrl = await uploadVideoToCloudinary(video);
      setUploading(false);

      const res = await axios.post("http://localhost:5000/api/solutions", {
        userId: user?.id,
        problemId,
        githubUrl,
        liveUrl,
        videoUrl,
        notes,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Solution submitted successfully");
      setVideo(null);
      setGithubUrl("");
      setLiveUrl("");
      setNotes("");
    },
    onError: (error) => {
      console.log("Error in uplaoding solution:",error)
      setUploading(false)
      toast.error("Upload failed");
    },
  });

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files?.[0] || null)}
      />
      <Input
        placeholder="Github URL"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
      />
      <Input
        placeholder="Live Url"
        value={liveUrl}
        onChange={(e) => setLiveUrl(e.target.value)}
      />
      <Textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending||uploading}
      >
        {uploading ?"Uploading...":mutation.isPending ? "Submitting...":"Submit solution"}
      </Button>
    </div>
  );
}
