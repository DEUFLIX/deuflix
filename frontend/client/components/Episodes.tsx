import React from 'react';
import { Episode } from '../typing';

interface IProps {
    episodes: Episode[];
}

const Episodes = ({ episodes }: IProps) => {
    return (
        <div className="episodes">
            <h2 className="text-2xl font-bold">Episodes</h2>
            <ul>
                {episodes.map((episode, index) => (
                    <li key={episode.id} className="episode-item">
                        <div className="flex items-center">
                            <span className="text-lg font-bold mr-2">{index + 1}</span>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{episode.title}</h3>
                                <p>{episode.description}</p>
                                <p>{episode.duration} minutes</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Episodes;
