import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import around from "../images/around.svg";

function Header({ onSignOut, email }) {
  const [headerMenu, setHeaderMenu] = React.useState(false);

  return (
    <header className="header">
      <img className="header__logo" src={around} alt="'Around The U.S.' logo" />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <button
                className={
                  headerMenu ? "header__close-icon" : "header__hamburger-icon"
                }
                onClick={() => setHeaderMenu((show) => !show)}
              ></button>
              <div className="header__wrapper">
                <p className="header__email">{email}</p>
                <Link className="header__link" to="signin">
                  Sign out
                </Link>
              </div>
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <Link className="header__link" to="signin">
              Sign in
            </Link>
          }
        />
        <Route
          path="/signin"
          element={
            <Link className="header__link" to="signout">
              Sign up
            </Link>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
