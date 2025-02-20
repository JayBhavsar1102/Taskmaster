import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Comment, User } from '../types';

interface TaskChatProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string, attachment?: File) => void;
}

export function TaskChat({ comments, currentUser, onAddComment }: TaskChatProps) {
  const [newComment, setNewComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() || selectedFile) {
      onAddComment(newComment, selectedFile || undefined);
      setNewComment('');
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Only images (JPEG, PNG, GIF) and PDF files are allowed');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Task Discussion</h3>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex gap-3 ${
              comment.userId === currentUser.id ? 'flex-row-reverse' : ''
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                comment.userName
              )}&background=random`}
              alt={comment.userName}
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`max-w-[70%] ${
                comment.userId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              } rounded-lg p-3`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {comment.userName}
                </span>
                <span className="text-xs opacity-75">
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
              {comment.attachment && (
                <div className="mt-2">
                  <a
                    href={URL.createObjectURL(comment.attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    {comment.attachment.name}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {selectedFile && (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}