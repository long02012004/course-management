import "./App.css";
import { Outlet, Link, PrefetchPageLinks } from "react-router-dom";

import PerfectScrollbar from "react-perfect-scrollbar";

import Header from "./components/Header/Header.jsx";

function App() {
  return (
    <>
      <div className="header-container">
        <Header />
      </div>
      <div className="main-container">
        <div className="sidenav-container"></div>
        <div className="app-content">
          <PerfectScrollbar>
            <Outlet />
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
}

export default App;
