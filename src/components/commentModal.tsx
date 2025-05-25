"use client";

import { useComments, usePostComment } from "@/hooks/useComments";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionId: string;
  userId: string ;
}

export const CommentModal = ({
  isOpen,
  onClose,
  solutionId,
  userId,
}: CommentModalProps) => {
  const { data: comments = [], isLoading } = useComments(solutionId);
  const { mutate: postComment } = usePostComment(solutionId);
  const [text, setText] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    postComment({ userId, text });
    setText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogContent className="bg-white p-4 rounded-xl shadow-xl w-full max-w-lg">
          <DialogTitle className="text-lg font-bold mb-2">Comments</DialogTitle>
          <form onSubmit={handlePost} className="flex gap-2 mb-4">
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded p-2"
            />
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post
            </Button>
          </form>
          {isLoading ? (
             <div className="flex justify-center items-center h-[50vh]">
             <Loader className="animate-spin text-muted-foreground text-xs" />
           </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No Comments yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {comments.map((comment: any) => (
                <div key={comment.id} className="border p-2 rounded">
                  <p>{comment.text}</p>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{comment.user.email}</span>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};
