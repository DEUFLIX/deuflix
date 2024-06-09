import { Settings } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

import styles from "./navbar.module.css";

const Navbar = () => {
  const { state, setState } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
      <div className={styles.topbar}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Link href="/">
              <a className={styles.logo}>Admin</a>
            </Link>
          </div>

          <div className={styles.right}>
            <div className={styles.iconContainer}>
              {state ? <Button onClick={handleLogout}>Logout</Button> : ""}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
