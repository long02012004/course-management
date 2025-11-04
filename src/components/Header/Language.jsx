const Language = () => {
  return (
    <>
      <li className="nav-item dropdown languages">
        <a
          className="nav-link dropdown-toggle text-center"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Việt Nam
        </a>
        <ul className="dropdown-menu dropdown-menu-end ">
          <li>
            <a className="dropdown-item" href="#">
              English
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Việt Nam
            </a>
          </li>
        </ul>
      </li>
    </>
  );
};
export default Language;
