import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { MdInfoOutline } from "react-icons/md";
import { Genre, Movie, Series } from "../typing";
import ReactPlayer from "react-player";

interface IProps {
    movie: Movie | Series;
}

export default function BasicModal({ movie }: IProps) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>
                <MdInfoOutline className="text-[1.5rem] absolute -left-1 -top-3 text-gray-200 " />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <div className="w-full md:w-1/2 lg:w-1/2 h-auto absolute top-[10%] md:left-[25%] bg-black">
                        <ReactPlayer
                            url={'trailer' in movie ? movie.trailer : movie.trailerUrl} // 인트로 영상 URL로 변경
                            width="100%"
                            height="400px"
                            playing // 자동 재생
                            controls
                        />
                        <div className="flex flex-col space-y-4 rounded-b-md bg-[#181818] px-10 py-8">
                            <h1 className="text-2xl font-bold">{movie.title}</h1>
                            <p>{movie.description}</p>
                            <div>
                                <span className="text-gray-400">Genre: </span>
                                {movie.genres && movie.genres.map((g: Genre) => (
                                    <span key={g.id}>{g.genre} </span>
                                ))}
                            </div>
                            {movie.year && movie.year.year && (
                                <p>
                                    <span className="text-gray-400">Year: </span>
                                    {movie.year.year}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
