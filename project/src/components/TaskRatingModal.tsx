import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface TaskRatingModalProps {
  taskId: string;
  taskTitle: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export function TaskRatingModal({ taskId, taskTitle, onSubmit, onClose }: TaskRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rate Task Performance</h2>
        <h3 className="text-gray-600 mb-4">{taskTitle}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Optional feedback about the task performance..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}