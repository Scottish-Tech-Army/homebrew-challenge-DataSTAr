import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DashboardNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { URL_OVERVIEW, URL_REGIONAL } from "../../pages/PageConsts";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

const DashboardNavbar = ({ darkmode, setDarkmode }) => {
  function navLink(pageUrl, title, exact = true) {
    return (
      <NavLink
        className="nav-link"
        to={pageUrl}
        exact={exact}
        activeClassName="selected"
      >
        {title}
      </NavLink>
    );
  }

  return (
    <Navbar className="dashboard-navbar" expand="sm">
      <Link to={URL_OVERVIEW}>
        <img
          id="logo"
          src="/STALogoSquare.svg"
          alt="Scottish Tech Army Logo"
        />
      </Link>
      <Nav className="hide-darkmode">
      <FontAwesomeIcon
        icon={darkmode ? faSun : faMoon}
        className="darkmode-btn-toggle"
        size="2x"
        onClick={() => setDarkmode((value) => !value)}
      />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Nav>
      <Navbar.Collapse id="basic-navbar-nav" className="heading-container">
        <Navbar.Brand className="heading">
          <h1>Scottish COVID-19 Statistics</h1>
        </Navbar.Brand>
        <Nav className="navbar-links">
          {navLink(URL_OVERVIEW, "Summary Statistics")}
          {navLink(URL_REGIONAL, "Regional Insights", false)}
        </Nav>
      </Navbar.Collapse>
      <FontAwesomeIcon
        icon={darkmode ? faSun : faMoon}
        className="darkmode-btn"
        size="2x"
        onClick={() => setDarkmode((value) => !value)}
      />
    </Navbar>
  );
};

export default DashboardNavbar;
