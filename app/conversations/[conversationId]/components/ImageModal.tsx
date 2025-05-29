'use client';
import Modal from '@/app/components/Modal';
import Image from 'next/image';
import { useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        <Image
          className="object-cover"
          fill
          alt="Image"
          src={src}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            图片加载失败
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
