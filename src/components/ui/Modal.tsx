import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl shadow-2xl animate-fade-in"
        style={{ backgroundColor: 'var(--surface-primary)' }}
      >
        <div 
          className="sticky top-0 flex justify-between items-center p-6 border-b backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          {title && (
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all hover:scale-110"
            style={{ 
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-secondary)'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};