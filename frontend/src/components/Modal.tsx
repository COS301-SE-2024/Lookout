import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <div className="mb-4">{message}</div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
