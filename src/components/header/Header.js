import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { clearState } from "../../slices/loginSlice";

function Header() {
  let { currentUser, userLoginStatus } = useSelector((state) => state.login);

  let dispatch = useDispatch();

  const logOut = () => {
    //remove token from local/session storage
    localStorage.removeItem("token");
    //clear redux log state
    let actionObj = clearState();
    dispatch(actionObj);
  };

  return (
    <ul className="nav justify-content-end">
      {userLoginStatus === false ? (
        <>
          <li className="nav-item">
            <NavLink className="nav-link " to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link " to="register">
              Register
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link " to="login">
              Login
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li className="nav-item">
            <NavLink className="nav-link " to="login" onClick={logOut}>
              Logout
            </NavLink>
          </li>

          <li className="nav-item">
            <p className="lead text-danger fw-bold mx-3">
              {currentUser.username}
            </p>
          </li>
        </>
      )}
    </ul>
  );
}

export default Header;
