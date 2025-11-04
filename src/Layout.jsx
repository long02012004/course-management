import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Admin from "./components/Admin/Admin.jsx";
import User from "./components/User/User.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import Dashboard from "./components/Admin/Content/Dashboard.jsx";
import ManageUser from "./components/Admin/Content/ManageUser.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import ListQuiz from "./components/User/ListQuiz.jsx";
import DetailQuiz from "./components/User/DetailQuiz.jsx";
import ManageQuiz from "./components/Admin/Content/Quiz/ManageQuiz.jsx";
import Questions from "./components/Admin/Content/Questions/Questions.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

const NotFound = () => {
  return (
    <div className="alert alert-danger">
      404.Not found data with your current URL
    </div>
  );
};
const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route
            path="users"
            element={
              <PrivateRoute>
                <ListQuiz />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/quiz/:id" element={<DetailQuiz />} />

        <Route
          path="/admins"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-quizzes" element={<ManageQuiz />} />
          <Route path="manage-questions" element={<Questions />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        {/* Phòng trường hợp các đường link không trùng thì vô trang này */}
      </Routes>
      ;
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      ;
    </>
  );
};
export default Layout;
