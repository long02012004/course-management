import VideoHomePage from "../../assets/videohome.mp4";
import styles from "./Home.module.scss";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  return (
    <div className={styles["homepage-container"]}>
      <video autoPlay loop muted>
        <source src={VideoHomePage} type="video/mp4" />
      </video>
      <div className={styles["homepage-content"]}>
        <h1 className={styles["homepage-title"]}>{t("homepage.title1")}</h1>
        <p className={styles["homepage-description"]}>{t("homepage.title2")}</p>
        {isAuthenticated === false ? (
          <button
            className={styles["homepage-button"]}
            onClick={() => navigate("./login")}
          >
            {t("homepage.title3.login")}
          </button>
        ) : (
          <button
            className={styles["homepage-button"]}
            onClick={() => navigate("./users")}
          >
            {" "}
            Doing quiz now
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
