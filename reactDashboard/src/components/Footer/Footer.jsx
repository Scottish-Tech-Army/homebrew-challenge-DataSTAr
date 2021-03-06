import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  URL_ABOUT_US,
  URL_ACCESSIBILITY,
  URL_DATA_SOURCES,
  URL_OVERVIEW,
  URL_REGIONAL,
} from "../../pages/PageConsts";
import {
  faLinkedinIn,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
import SvgIcon from "../Utils/SvgIcon";

const Footer = ({ darkmode }) => {
  function sitemapEntry(pageUrl, text) {
    return (
      <div className="entry link">
        <NavLink className="entry link" to={pageUrl}>
          {text}
        </NavLink>
      </div>
    );
  }

  const SOCIAL_LOGO = "black";
  const DARK_SOCIAL_LOGO = "#9cd7ff";
  
  function sitemapExternalLink(href, content) {
    return (
      <div className="entry link">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="entry link"
        >
          {content}
        </a>
      </div>
    );
  }

  return (
    <footer>
      <Container fluid className="font-small">
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="p-1 footer-main">
          <Col
            md={12}
            className="sitemap-container d-flex justify-content-between"
          >
            <div className="sitemap">
              <div className="title">DASHBOARDS</div>
              {sitemapEntry(URL_OVERVIEW, "Summary Statistics")}
              {sitemapEntry(URL_REGIONAL, "Regional Insights")}
              {sitemapEntry(URL_DATA_SOURCES, "Data Sources")}
            </div>
            <div className="sitemap">
              <div className="title">COVID HELP</div>
              {sitemapExternalLink(
                "https://www.gov.scot/collections/coronavirus-covid-19-guidance/",
                "Scottish Government Guidance"
              )}
              {sitemapExternalLink(
                "https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19",
                "NHS inform Advice"
              )}
            </div>
            <div className="sitemap">
              <div className="title">LEGAL</div>
              {sitemapExternalLink(
                "https://www.scottishtecharmy.org/privacy-policy",
                "Privacy Policy"
              )}
              {sitemapEntry(URL_ACCESSIBILITY, "Accessibility")}
            </div>
            <div className="sitemap">
              <div className="title">ABOUT</div>
              {sitemapEntry(URL_ABOUT_US, "About Us")}
            </div>
            <div className="sitemap">
              <div className="title">CONTACT</div>
              {sitemapExternalLink(
                "mailto:info@scottishtecharmy.org?subject=Covid-19%20Dashboard%20Feedback",
                "info@scottishtecharmy.org"
              )}
            </div>
          </Col>
        </Row>
        <Row className="d-sm-flex">
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="footer-base">
          <Col sm={12} md={9}>
            <div className="footer-copyright text-left">
              Unless otherwise stated, this webpage contains public sector
              information licensed under{" "}
              <a
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer licence"
                className="entry link"
              >
                the Open Government Licence 3.0.
              </a>
              <br />© 2020 Copyright:&nbsp;
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="entry link"
              >
                ScottishTechArmy.org
              </a>
            </div>
          </Col>
          <Col
            sm={12}
            md={3}
            className="d-flex justify-content-end social align-items-center"
          >
            <div>Connect with us:</div>
            {sitemapExternalLink(
              "https://www.linkedin.com/company/scottish-tech-army-limited",
              <SvgIcon
                faIcon={faLinkedinIn}
                size="2"
                color={darkmode ? DARK_SOCIAL_LOGO : SOCIAL_LOGO}
                className="third-party-logo"
                title="Link to Scottish Tech Army LinkedIn account"
              />
            )}
            {sitemapExternalLink(
              "https://twitter.com/ScotTechArmy",
              <SvgIcon
                faIcon={faTwitter}
                size="2"
                color={darkmode ? DARK_SOCIAL_LOGO : SOCIAL_LOGO}
                className="third-party-logo"
                title="Link to Scottish Tech Army Twitter account"
              />
            )}
            {sitemapExternalLink(
              "https://www.instagram.com/scottecharmy",
              <SvgIcon
                faIcon={faInstagram}
                size="2"
                color={darkmode ? DARK_SOCIAL_LOGO : SOCIAL_LOGO}
                className="third-party-logo"
                title="Link to Scottish Tech Army Instagram account"
              />
            )}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
