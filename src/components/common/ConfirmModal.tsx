import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  isOpen,
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmModal;
