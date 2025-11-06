import i18next from "i18next";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { t, i18n } = useTranslation(); // ✅ Đúng hook

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <li className="nav-item dropdown languages">
      <a
        className="nav-link dropdown-toggle text-center"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {i18n.language === "vi" ? "Việt Nam" : "English"}
      </a>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => handleChangeLanguage("en")}
          >
            English
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => handleChangeLanguage("vi")}
          >
            Việt Nam
          </a>
        </li>
      </ul>
    </li>
  );
};

export default Language;
