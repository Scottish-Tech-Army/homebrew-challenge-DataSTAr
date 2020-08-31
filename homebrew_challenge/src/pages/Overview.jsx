import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SingleValueBar from "../components/SingleValue/SingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HeatmapDataSelector from "../components/HeatmapDataSelector/HeatmapDataSelector";
import Heatmap from "../components/HeatMap/Heatmap";
import GeoHeatMap from "../components/GeoHeatMap/GeoHeatMap";
import DataChartsSelector from "../components/DataCharts/DataChartsSelector";
import DataCharts from "../components/DataCharts/DataCharts";
import InfoBar from "../components/InfoBar/InfoBar";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";

import { PERCENTAGE_CASES } from "../components/DataCharts/DataChartsConsts";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES
} from "../components/HeatmapDataSelector/HeatmapConsts";

const Overview = ({ councilAreaDataset, healthBoardDataset }) => {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_CASES);
  const [chartType, setChartType] = useState(PERCENTAGE_CASES);
  const [zoomDataCharts, setZoomDataCharts] = useState(false);
  const [zoomGeoMap, setZoomGeoMap] = useState(false);

  const zoomableCharts = useRef();
  const zoomableMap = useRef();

  function toggleFullscreen(element, setter) {
    var elem = element.current || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      setter(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setter(false);
    }
  }

  useEffect(() => {
    function setFullscreenMode(fullscreenEnabled) {
      if (!fullscreenEnabled) {
        setZoomDataCharts(false);
        setZoomGeoMap(false);
      }
    }

    // Monitor changes to fullscreen
    document.addEventListener(
      "fullscreenchange",
      () => setFullscreenMode(document.fullscreen),
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      () => setFullscreenMode(document.mozFullScreen),
      false
    );
    document.addEventListener(
      "webkitfullscreenchange",
      () => setFullscreenMode(document.webkitIsFullScreen),
      false
    );
    document.addEventListener(
      "msfullscreenchange",
      () => setFullscreenMode(document.msFullscreenElement),
      false
    );
  }, []);
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center align-items-center route-map-rules">
          <Col>
            <RouteMapRules />
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row>
          <Col>
            <SingleValueBar />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={12}
            ref={zoomableMap}
            className={zoomGeoMap ? "full-screen" : ""}
          >
            <Row>
              <Col>
                <HeatmapDataSelector
                  areaType={areaType}
                  valueType={valueType}
                  setAreaType={setAreaType}
                  setValueType={setValueType}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <hr className="underHeatmapSelector" />
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={zoomGeoMap ? 12 : 4}>
                <GeoHeatMap
                  councilAreaDataset={councilAreaDataset}
                  healthBoardDataset={healthBoardDataset}
                  areaType={areaType}
                  valueType={valueType}
                  toggleFullscreen={() =>
                    toggleFullscreen(zoomableMap, setZoomGeoMap)
                  }
                  fullscreenEnabled={zoomGeoMap}
                />
              </Col>
              <Col className="d-block d-lg-none">
                <hr className="underHeatmapSelector" />
              </Col>
              <Col
                xs={zoomGeoMap ? 0 : 12}
                lg={zoomGeoMap ? 0 : 8}
                className="heatmap-container"
              >
                {zoomGeoMap ? (
                  <></>
                ) : (
                  <Heatmap
                    councilAreaDataset={councilAreaDataset}
                    healthBoardDataset={healthBoardDataset}
                    areaType={areaType}
                    valueType={valueType}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row ref={zoomableCharts} className="fullscreen-charts">
          <Col xs={12} md={3} lg={2}>
            <DataChartsSelector
              chartType={chartType}
              setChartType={setChartType}
            />
          </Col>
          <Col xs={12} md={9} lg={10}>
            <DataCharts
              chartType={chartType}
              healthBoardDataset={healthBoardDataset}
              fullscreenEnabled={zoomDataCharts}
              toggleFullscreen={() =>
                toggleFullscreen(zoomableCharts, setZoomDataCharts)
              }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row className="d-none d-sm-flex justify-content-center align-items-center">
          <Col>
            <InfoBar />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Overview;