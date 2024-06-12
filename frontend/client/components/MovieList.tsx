import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import Top10Movies from './Top10Movies';
import { Movie, Series } from '../typing';
import Poster from './Poster';
import VideoModal from './VideoModal';

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [series, setSeries] = useState<Series[]>([]);
    const [selectedItem, setSelectedItem] = useState<Movie | Series | null>(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [wasInfoOpen, setWasInfoOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const containerRef1 = useRef<HTMLDivElement>(null);
    const containerRef2 = useRef<HTMLDivElement>(null);
    const containerRef3 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/movies');
                const moviesWithDetails = await Promise.all(response.data.map(async (item: Movie) => {
                    const suggestionsResponse = await axios.get(`http://localhost:3000/api/getSuggestions?movieId=${item.id}`);
                    return {
                        ...item,
                        suggestions: suggestionsResponse.data.suggestions,
                        age_restriction: suggestionsResponse.data.age_restriction,
                    };
                }));
                setMovies(moviesWithDetails);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/series');
                const seriesWithDetails = await Promise.all(response.data.map(async (item: Series) => {
                    const suggestionsResponse = await axios.get(`http://localhost:3000/api/getSuggestions?movieId=${item.id}`);
                    return {
                        ...item,
                        suggestions: suggestionsResponse.data.suggestions,
                        age_restriction: suggestionsResponse.data.age_restriction,
                    };
                }));
                setSeries(seriesWithDetails);
            } catch (err) {
                console.log(err);
            }
        };
        fetchSeries();
    }, []);

    const handleInfoClick = (item: Movie | Series) => {
        setSelectedItem(item);
        setIsInfoOpen(true);
    };

    const handleCloseInfo = () => {
        setIsInfoOpen(false);
        setSelectedItem(null);
    };

    const handlePlayClick = (url: string) => {
        if (isInfoOpen) {
            setWasInfoOpen(true);
            setIsInfoOpen(false);
        }
        setVideoUrl(url);
        setIsVideoOpen(true);
    };

    const handleCloseVideoPlayer = () => {
        setVideoUrl(null);
        setIsVideoOpen(false);
        if (wasInfoOpen) {
            setIsInfoOpen(true);
            setWasInfoOpen(false);
        }
    };

    const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -ref.current.offsetWidth, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: ref.current.offsetWidth, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Top10Movies />
            <MovieCarousel
                title="회원님을 위한 콘텐츠!"
                items={movies}
                onInfoClick={handleInfoClick}
                onScrollLeft={() => scrollLeft(containerRef1)}
                onScrollRight={() => scrollRight(containerRef1)}
                containerRef={containerRef1}
                onPlayClick={handlePlayClick}
            />
            <MovieCarousel
                title="흥미 진진한 영화!"
                items={movies.slice().reverse()}
                onInfoClick={handleInfoClick}
                onScrollLeft={() => scrollLeft(containerRef2)}
                onScrollRight={() => scrollRight(containerRef2)}
                containerRef={containerRef2}
                onPlayClick={handlePlayClick}
            />
            <MovieCarousel
                title="듀플릭스 시리즈!"
                items={series}
                onInfoClick={handleInfoClick}
                onScrollLeft={() => scrollLeft(containerRef3)}
                onScrollRight={() => scrollRight(containerRef3)}
                containerRef={containerRef3}
                onPlayClick={handlePlayClick}
            />
            {selectedItem && (
                <Poster
                    posterData={selectedItem}
                    genreList={[]}
                    isInfoOpen={isInfoOpen}
                    onCloseInfo={handleCloseInfo}
                />
            )}
            {isVideoOpen && videoUrl && (
                <VideoModal
                    videoUrl={videoUrl}
                    onClose={handleCloseVideoPlayer}
                    width="63%"
                    height="70%"
                />
            )}
        </>
    );
};

interface MovieCarouselProps {
    title: string;
    items: (Movie | Series)[];
    onInfoClick: (item: Movie | Series) => void;
    onScrollLeft: () => void;
    onScrollRight: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
    onPlayClick: (url: string) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, items, onInfoClick, onScrollLeft, onScrollRight, containerRef, onPlayClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="movie-list relative">
            <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
            <button className="arrow-button arrow-left" onClick={onScrollLeft}>{'<'}</button>
            <div className="movie-cards-container flex space-x-4 overflow-hidden py-6 pl-10" ref={containerRef}>
                {items.map((item, index) => (
                    <MovieCard
                        key={item.id}
                        item={item}
                        isHovered={hoveredIndex === index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onInfoClick={onInfoClick}
                        onPlayClick={onPlayClick}
                    />
                ))}
            </div>
            <button className="arrow-button arrow-right" onClick={onScrollRight}>{'>'}</button>
        </div>
    );
};

export default MovieList;
