import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { MdInfoOutline, MdClose } from "react-icons/md";
import { Genre, Movie } from "../typing";
import ReactPlayer from "react-player";

interface IProps {
    movie: Movie;
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
                className="z-50"
            >
                <div className="flex items-center justify-center min-h-screen px-4 text-center z-50">
                    <div className="bg-black rounded-lg overflow-hidden shadow-xl transform transition-all w-full max-w-5xl p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-white text-3xl z-50"
                            onClick={handleClose}
                        >
                            <MdClose />
                        </button>
                        <ReactPlayer
                            url={movie.trailer} // 인트로 영상 URL로 변경
                            width="100%"
                            height="50%"
                            playing={true} // 자동 재생 추가
                            muted={true} // 음소거 추가
                            controls
                        />
                        <div className="flex flex-col space-y-4 bg-[#181818] px-4 py-8 text-white">
                            <h1 className="text-2xl font-bold">{movie.title}</h1>
                            <p>{movie.description}</p>
                            <div>
                                <span className="text-[gray]">Genre: </span>
                                {movie.genres && movie.genres.map((g: Genre) => (
                                    <span key={g.id}>{g.genre} </span>
                                ))}
                            </div>
                            {movie.year && movie.year.year != null && (
                                <h1>
                                    <span className="text-[gray]">Year: </span>
                                    {movie.year.year}
                                </h1>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
