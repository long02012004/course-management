import SideBar from "./Sidebar";
import styles from "./Admin.module.scss";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import Language from "../Header/Language";

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles["admin-container"]}>
      <div className={styles["admin-sidebar"]}>
        <SideBar collapsed={collapsed} />
      </div>
      <div className={styles["admin-content"]}>
        <div className={styles["admin-header"]}>
          <span onClick={() => setCollapsed(!collapsed)}>
            <FaBars className={styles["left-side"]}></FaBars>
          </span>

          <div className={styles["right-side"]}>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Settings
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    LogOut
                  </a>
                </li>
              </ul>
            </li>
            <Language />
          </div>
        </div>

        <div className={styles["admin-main"]}>
          <PerfectScrollbar>
            <Outlet />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default Admin;
