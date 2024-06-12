import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Movie } from '../typing';
import Top10MovieCard from './Top10MovieCard';
import Poster from './Poster'; // Poster 컴포넌트 임포트

const Top10Movies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 선택된 영화 상태 추가

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/movies');
                const moviesWithDetails = await Promise.all(response.data.map(async (movie: Movie) => {
                    const suggestionsResponse = await axios.get(`http://localhost:3000/api/getSuggestions?movieId=${movie.id}`);
                    return {
                        ...movie,
                        suggestions: suggestionsResponse.data.suggestions,
                        age_restriction: suggestionsResponse.data.age_restriction,
                    };
                }));
                const sortedMovies = moviesWithDetails.sort((a, b) => b.suggestions - a.suggestions);
                setMovies(sortedMovies.slice(0, 10));
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovies();
    }, []);

    const handleCardClick = (movie: Movie) => {
        setSelectedMovie(movie); // 영화 선택 시 상태 업데이트
    };

    const handleCloseInfo = () => {
        setSelectedMovie(null); // 모달 닫기
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -containerRef.current.offsetWidth,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: containerRef.current.offsetWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative pt-20">
            <h2 className="text-2xl font-bold mb-4 text-white">오늘 대한민국의 TOP 10 시리즈</h2>
            <div className="relative">
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    onClick={scrollLeft}
                >
                    &#9664;
                </button>
                <div className="top10-movies-container flex space-x-20 overflow-hidden py-6 pl-20" ref={containerRef}>
                    {movies.map((movie, index) => (
                        <Top10MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            isHovered={hoveredIndex === index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onCardClick={() => handleCardClick(movie)} // 카드 클릭 시 함수 호출
                        />
                    ))}
                </div>
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    onClick={scrollRight}
                >
                    &#9654;
                </button>
            </div>
            {selectedMovie && (
                <Poster
                    posterData={selectedMovie}
                    genreList={[]} // 장르 리스트를 필요에 따라 전달
                    isInfoOpen={true}
                    onCloseInfo={handleCloseInfo}
                    isModal={true} // 모달 상태를 true로 설정
                />
            )}
        </div>
    );
};

export default Top10Movies;
