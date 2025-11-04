import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { doLogin } from "../../../redux/action/userAction";
import { ImSpinner5 } from "react-icons/im";
import Language from "../../Header/language";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async () => {
    // validate
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Invalid email format");
      return;
    }
    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      let res = await postLogin(email, password);

      if (res && res.data && res.data.EC === 0) {
        const accessToken = res.data.DT?.access_token;
        console.log("Access token:", accessToken); // 👈 in ra để check

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
        }

        dispatch(doLogin(res.data));
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res?.data?.EM || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    console.log("check key:", e.key);
    if (e && e.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <div className="login-container">
      <div className="header">
        <span>Don't have an account yet?</span>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
        <Language />
      </div>

      <div className="title mx-auto col-4">Quang Long</div>
      <div className="welcome col-4 mx-auto">Hello! Who are you?</div>

      <div className="content-form col-4 mx-auto">
        <div className="form-group col-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group col-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </div>

        <span className="forgot-password">Forgot Password?</span>

        <div>
          <button
            className="btn-submit"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading && <ImSpinner5 className="spinner" />}
            <span>Login to QuangLong</span>
          </button>
        </div>

        <div className="text-center">
          <span className="back" onClick={() => navigate("/")}>
            &lt;&lt; Go to HomePage
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
