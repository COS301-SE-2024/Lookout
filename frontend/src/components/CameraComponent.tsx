import React, { useRef, useState } from 'react';

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        // Use toDataURL with 'image/jpeg' and a quality parameter to compress the image
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed (0.0 to 1.0)
        setPhoto(dataUrl);
        onCapture(dataUrl); // Call the onCapture prop function with compressed image URL
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-3">
        <button
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg mr-2"
          onClick={isCameraOpen ? stopCamera : startCamera}
        >
          {isCameraOpen ? 'STOP' : 'CAM'}
        </button>
        {isCameraOpen && (
          <button
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
            onClick={takePhoto}
          >
            PHOTO
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
