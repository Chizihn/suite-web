import React from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Review } from "../../types";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div 
      className="border-b pb-6 mb-6"
      style={{ borderColor: 'var(--border-primary)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-full mr-4"
            style={{ backgroundColor: 'var(--surface-secondary)' }}
          ></div>
          <div>
            <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {review.userName}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {review.date}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 transition-all hover:scale-105">
            <ThumbsUp size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {review.likes}
            </span>
          </button>
          <button className="flex items-center gap-2 transition-all hover:scale-105">
            <ThumbsDown size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {review.dislikes}
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            style={{ color: i < review.rating ? 'var(--warning)' : 'var(--text-tertiary)' }}
            fill={i < review.rating ? 'currentColor' : 'none'}
            className="mr-1"
          />
        ))}
      </div>
      <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;