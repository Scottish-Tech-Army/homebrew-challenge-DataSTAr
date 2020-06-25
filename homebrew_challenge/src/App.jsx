import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import HeatmapContainer from "./components/HeatmapContainer/HeatmapContainer";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";
import SingleValueBar from "./components/SingleValue/SingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';

const App = () => {
  return (
    <div className="App">
      <Navbar>
        <Nav activeKey="/home">
          <Nav.Item>
            <img src="final_logo.PNG" alt="" />
          </Nav.Item>
        </Nav>
      </Navbar>

      <Container fluid className="pt-3">
        <div className="section">
          <span id="icon">
            <FontAwesomeIcon icon={faInfoCircle} />
          </span>
          <span id="message">
            The Scottish Government is the devolved government for Scotland and
            has a range of responsibilities that include: the economy,
            education, health, justice, rural affairs, housing, environment,
            equal opportunities, consumer advocacy and advice, transport and
            taxation.
          </span>
        </div>
      </Container>

      <SingleValueBar />

      <Container fluid>
        <div className="widgets_block">
          <Row>
            <Col xs={12} md={8}>
              <HeatmapContainer />
            </Col>
            <Col xs={6} md={4}>
              <PercentTestsChart />
            </Col>
          </Row>
        </div>
      </Container>

      <hr />

      <footer className="page-footer font-small blue pt-4">
        <Container fluid className="text-center text-md-left">
          <Row style={{ margin: "0 0 20px 20px" }}>
            <img src="final_logo.png" alt="" width="270" height="50" />
          </Row>

          <Row style={{ margin: "0 0 20px 20px" }}>
            <ul className="list-inline">
              <li
                className="list-inline-item"
                style={{ marginRight: "200px" }}
              >
                <a href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/">
                  Scottish Government guidance
                </a>
              </li>
              <li
                className="list-inline-item"
                style={{ marginRight: "200px" }}
              >
                <a href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19">
                  NHS inform
                </a>
              </li>
              <li
                className="list-inline-item"
                style={{ marginRight: "200px" }}
              >
                <a href="https://www.scottishtecharmy.org/">STA pages</a>
              </li>
            </ul>
          </Row>

          <div className="footer-copyright text-center py-3">
            © 2020 Copyright:
            <a href="https://www.scottishtecharmy.org/">ScottishTechArmy.org</a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default App;
