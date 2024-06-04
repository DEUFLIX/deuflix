import '../../styles/shared.module.css';
import type { AppProps } from "next/app";
import { GenreProvider } from "../../context/GenreContext";
import { UserProvider } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AccountApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <GenreProvider>
                <ToastContainer position="top-center" />
                <Component {...pageProps} />
            </GenreProvider>
        </UserProvider>
    );
}

export default AccountApp;
