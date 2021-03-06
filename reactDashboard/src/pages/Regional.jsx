import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegionGeoMap from "../components/GeoHeatMap/RegionGeoMap";
import DataCharts from "../components/DataCharts/DataCharts";
import DataDefinitions from "../components/DataDefinitions/DataDefinitions";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
  getPlaceNameByFeatureCode,
} from "../components/Utils/CsvUtils";
import { stopAudio } from "../components/Utils/Sonification";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";

// Exported for unit tests
export function getRegionCodeFromUrl(location) {
  const initialRegionCode = location.pathname.split("/").pop();
  if (FEATURE_CODE_MAP[initialRegionCode] !== undefined) {
    return initialRegionCode;
  }
  return FEATURE_CODE_SCOTLAND;
}

// Exported for unit tests
export function getCanonicalUrl(baseUrl, regionCode) {
  return (
    baseUrl + (regionCode === FEATURE_CODE_SCOTLAND ? "" : "/" + regionCode)
  );
}

const Regional = ({ allData, darkmode }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const [regionCode, setRegionCode] = useState(getRegionCodeFromUrl(location));
  const history = useHistory();

  const currentRegionCode = useRef(regionCode);
  const currentLocation = useRef(match.url);

  // These two effects handle the browser url and the region code selection in sync.
  // Either location or regionCode may be changed by user action, so the currentRegionCode
  // and currentLocation refs are used to distinguish a change by user action, or internally
  // here to keep the location and regionCode in sync.
  //
  // It is complicated by handling the canonicalisation of URLs
  // eg .../regional/unknown is redirected to .../regional

  useEffect(() => {
    if (currentRegionCode.current !== regionCode) {
      currentRegionCode.current = regionCode;
      // Region code has changed: update URL
      const newUrl = getCanonicalUrl(match.url, regionCode);
      if (currentLocation.current !== newUrl) {
        currentLocation.current = newUrl;
        history.push(newUrl);
      }
    }
  }, [regionCode, history, match]);

  useEffect(() => {
    function setCanonicalLocation(newRegionCode) {
      currentLocation.current = getCanonicalUrl(match.url, newRegionCode);
      if (location.pathname !== currentLocation.current) {
        history.push(currentLocation.current);
      }
    }

    if (currentLocation.current !== location.pathname) {
      // URL has changed: update regionCode
      currentRegionCode.current = getRegionCodeFromUrl(location);
      setRegionCode(currentRegionCode.current);
      setCanonicalLocation(currentRegionCode.current);
    }
  }, [location, history, match]);

  // Stop audio on chart, region or location change
  useEffect(() => {
    stopAudio();
  }, [regionCode, location]);

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center align-items-center route-map-rules">
          <Col>
            <RouteMapRules />
          </Col>
        </Row>
      </Container>
      <Container fluid className="regional-page">
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="region-page-top-row">
          <Col aria-hidden={true} className="geo-map-column" xs={12} lg={4}>
            <RegionGeoMap
              regionCode={regionCode}
              setRegionCode={setRegionCode}
              darkmode={darkmode}
            />
          </Col>
          <Col className="region-tiles-column" xs={12} lg={8}>
            <hr aria-hidden={true} className="full-width-hr" />
            <h2 className="visually-hidden">Select region</h2>
            <RegionDropdown
              regionCode={regionCode}
              setRegionCode={setRegionCode}
            />
            <hr aria-hidden={true} className="full-width-hr" />
            <h2 className="visually-hidden">{`Headline statistics for ${getPlaceNameByFeatureCode(
              regionCode
            )}`}</h2>
            <RegionSingleValueBar regionCode={regionCode} allData={allData} />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="data-charts-container">
          <Col xs={12}>
            <h2 className="visually-hidden">
              {`Time series statistics for ${getPlaceNameByFeatureCode(
                regionCode
              )}`}
            </h2>
            <DataCharts
              regionCode={regionCode}
              allData={allData}
              darkmode={darkmode}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
            <DataDefinitions />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Regional;
