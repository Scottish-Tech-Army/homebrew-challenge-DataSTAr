import React, { useState } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegionGeoMap from "../components/GeoHeatMap/RegionGeoMap";
import RegionDataChartsSelector from "../components/DataCharts/RegionDataChartsSelector";
import RegionDataCharts from "../components/DataCharts/RegionDataCharts";
import { DAILY_CASES } from "../components/DataCharts/DataChartsConsts";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";
import { FEATURE_CODE_SCOTLAND } from "../components/Utils/CsvUtils";

const Regional = ({
  councilAreaDataset,
  healthBoardDataset,
  currentTotalsHealthBoardDataset,
  currentTotalsCouncilAreaDataset,
}) => {
  const [regionCode, setRegionCode] = useState(FEATURE_CODE_SCOTLAND);
  const [chartType, setChartType] = useState(DAILY_CASES);

  return (
    <Container fluid className="regional-page">
      <Row>
        <Col>
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <RegionGeoMap
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
            regionCode={regionCode}
            setRegionCode={setRegionCode}
          />
        </Col>
        <Col>
          <hr className="d-flex d-md-none full-width-hr" />
          <strong>Select region (or select on map):</strong>

          <RegionDropdown
            regionCode={regionCode}
            setRegionCode={setRegionCode}
          />
          <hr className="full-width-hr" />
          <RegionSingleValueBar
            regionCode={regionCode}
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
            currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
            currentTotalsCouncilAreaDataset={currentTotalsCouncilAreaDataset}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row className="fullscreen-charts">
        <Col xs={12} md={3} lg={2}>
          <RegionDataChartsSelector
            chartType={chartType}
            setChartType={setChartType}
          />
        </Col>
        <Col xs={12} md={9} lg={10}>
          <RegionDataCharts
            chartType={chartType}
            regionCode={regionCode}
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Regional;