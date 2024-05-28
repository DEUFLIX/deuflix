import React from 'react';
import { MdClose } from 'react-icons/md';

interface VideoPlayerProps {
    videoUrl: string;
    subtitlesUrl?: string;
    onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitlesUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="relative w-full max-w-4xl">
                <video controls className="w-full h-auto" autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                    {subtitlesUrl && <track src={subtitlesUrl} kind="subtitles" srcLang="en" label="English" />}
                    Your browser does not support the video tag.
                </video>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2"
                >
                    <MdClose size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
