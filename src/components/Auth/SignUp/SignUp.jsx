import { useState } from "react";
import "./SignUp.scss";
import { useNavigate } from "react-router-dom";
import { postSignUp } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Language from "../../Header/language";
import { useTranslation, Trans } from "react-i18next";

const Signup = () => {
  // Chuyển đổi ngôn ngữ
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleRegister = async () => {
    //validate
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Invalid email");
      return;
    }

    if (!password) {
      toast.error("Invalid password");
      return;
    }

    //submit apis
    let data = await postSignUp(email, password, username);
    if (data.data && data.data.EC === 0) {
      toast.success(data.data.EM);
      navigate("/login");
    }
    if (data.data && data.data.EC !== 0) {
      toast.error(data.data.EM);
    }
  };
  return (
    <div className="register-container">
      <div className="header">
        <span> {t("signUp.header")}</span>
        <button onClick={() => navigate("/login")}>{t("signUp.login")}</button>
        <Language />
      </div>
      <div className="title col-4 mx-auto">{t("signUp.title")} </div>
      <div className="welcome col-4 mx-auto">{t("signUp.welcome")}</div>
      <div className="content-form col-4 mx-auto">
        <div className="form-group">
          <label>{t("signUp.email")}(*)</label>
          <input
            type={"email"}
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-group pass-group">
          <label>{t("signUp.password")}(*)</label>
          <input
            type={isShowPassword ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {isShowPassword ? (
            <span
              className="icons-eye"
              onClick={() => setIsShowPassword(false)}
            >
              <VscEye />
            </span>
          ) : (
            <span className="icons-eye" onClick={() => setIsShowPassword(true)}>
              <VscEyeClosed />
            </span>
          )}
        </div>
        <div className="form-group">
          <label>{t("signUp.username")}</label>
          <input
            type={"text"}
            className="form-control"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <button className="btn-submit" onClick={() => handleRegister()}>
            {t("signUp.btnSubmit")}
          </button>
        </div>
        <div className="text-center">
          <span
            className="back"
            onClick={() => {
              navigate("/");
            }}
          >
            &#60;&#60; {t("signUp.back")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
