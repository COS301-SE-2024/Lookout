import React, { useRef, useState } from 'react';
import { FaCamera, FaSquare } from 'react-icons/fa'

interface CameraComponentProps {
  onCapture: (url: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setPhoto(null); // Clear previous photo when starting camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Use toDataURL without parameters to get the default PNG format (lossless)
        const dataUrl = canvas.toDataURL(); // Default is 'image/png'
        setPhoto(dataUrl);
        onCapture(dataUrl); // Call the onCapture prop function with the image URL
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-3">
      <button
          className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-1"
          onClick={isCameraOpen ? stopCamera : startCamera}
        >
          {isCameraOpen ? <FaSquare size={20} className="bg-gray-300" /> : <FaCamera size={20} className="bg-gray-300" />}
        </button>
        {isCameraOpen && (
          <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-1"
          onClick={takePhoto}
        >
          <FaCamera size={20} className="bg-gray-300" />
        </button>
        )}
      </div>
      {isCameraOpen && (
        <div className="flex justify-center">
          <video ref={videoRef} autoPlay className="border border-gray-300 rounded-lg"></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      )}
      {photo && (
        <div className="mt-3">
          <img src={photo} alt="Captured" className="border border-gray-300 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
