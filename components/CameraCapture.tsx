import React, { useRef, useEffect, useState } from 'react';
import { CloseIcon } from './Icons';

interface Props {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please ensure you have given permission and are not using it elsewhere.");
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      {error && <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-500/80 text-white p-4 rounded-lg text-center">{error}</div>}
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full">
        <CloseIcon className="w-8 h-8 text-white" />
      </button>
      <div className="absolute bottom-10 flex justify-center w-full">
        <button
          onClick={handleCapture}
          disabled={!stream || !!error}
          aria-label="Capture photo"
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-400 disabled:opacity-50 active:bg-gray-300"
        ></button>
      </div>
    </div>
  );
};

export default CameraCapture;
