import React from 'react';
import { Movie } from '../typing';

interface Top10MovieCardProps {
    movie: Movie;
    index: number;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onCardClick: () => void;
}

const Top10MovieCard: React.FC<Top10MovieCardProps> = ({ movie, index, isHovered, onMouseEnter, onMouseLeave, onCardClick }) => {
    return (
        <div
            className={`relative w-72 transform transition-transform duration-300 rounded-lg ${isHovered ? 'scale-110 z-50' : 'scale-95 z-10'}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onCardClick}
        >
            {!isHovered && (
                <>
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-[-60px] text-[10rem] font-extrabold text-black" style={{ WebkitTextStroke: '2px gray', zIndex: '-1' }}>
                        {index + 1}
                    </div>
                    <img src={movie.movieImage} alt={movie.title} className="w-full h-full object-cover rounded-lg" />
                </>
            )}
            {isHovered && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                    <video className="w-[150%] h-[150%] object-cover rounded-lg" autoPlay muted>
                        <source src={movie.trailer} type="video/mp4" />
                    </video>
                </div>
            )}
        </div>
    );
};

export default Top10MovieCard;
