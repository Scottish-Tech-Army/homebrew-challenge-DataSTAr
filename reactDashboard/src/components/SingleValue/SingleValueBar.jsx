import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import {
  FEATURE_CODE_SCOTLAND,
  getRelativeReportedDate,
} from "../Utils/CsvUtils";
import moment from "moment";

export function parseNhsCsvData(lines) {
  var result = {
    cases: { date: undefined, value: undefined },
    deaths: { date: undefined, value: undefined },
    cumulativeCases: { date: undefined, value: undefined },
    cumulativeDeaths: { date: undefined, value: undefined },
    fatalityCaseRatio: undefined,
  };
  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        v4,
        dailyCases,
        cumulativeCases,
        v2,
        v3,
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      if (FEATURE_CODE_SCOTLAND === place) {
        const date = moment.utc(dateString).valueOf();

        const fatalityCaseRatio =
          cumulativeCases !== undefined && cumulativeDeaths !== undefined
            ? ((cumulativeDeaths * 100) / cumulativeCases).toFixed(1) + "%"
            : undefined;

        result = {
          cases: { date: date, value: Number(dailyCases) },
          deaths: { date: date, value: Number(dailyDeaths) },
          cumulativeCases: { date: date, value: Number(cumulativeCases) },
          cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
          fatalityCaseRatio: fatalityCaseRatio,
        };
      }
    }
  );
  return result;
}

const emptyDate = { date: Date.parse("1999-01-01"), value: 0 };
const SUBTITLE_TOTAL = "reported since 28 February, 2020";
const MISSING_DATA = "Not available";

function SingleValueBar({ currentTotalsHealthBoardDataset = null }) {
  const [dailyCases, setDailyCases] = useState(emptyDate);
  const [totalCases, setTotalCases] = useState(emptyDate);
  const [dailyFatalities, setDailyFatalities] = useState(emptyDate);
  const [totalFatalities, setTotalFatalities] = useState(emptyDate);
  const [fatalityCaseRatio, setFatalityCaseRatio] = useState(0);


  function guardMissingData(input) {
    return input === undefined ? MISSING_DATA : input.toLocaleString();
  }

  useEffect(() => {
    if (currentTotalsHealthBoardDataset !== null) {
      const results = parseNhsCsvData(currentTotalsHealthBoardDataset);
      if (results !== null) {
        setDailyCases(results.cases);
        setTotalCases(results.cumulativeCases);
        setDailyFatalities(results.deaths);
        setTotalFatalities(results.cumulativeDeaths);
        setFatalityCaseRatio(results.fatalityCaseRatio);
      }
    }
  }, [currentTotalsHealthBoardDataset]);

  return (
    <div className="single-value-bar">
      <div className="p-2 single-value-container">
        <SingleValue
          id="dailyCases"
          title="DAILY CASES"
          subtitle={guardMissingData(getRelativeReportedDate(dailyCases.date))}
          value={guardMissingData(dailyCases.value)}
          tooltip="These are the total cases reported on the above date and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="totalCases"
          title="TOTAL CASES"
          subtitle={SUBTITLE_TOTAL}
          value={guardMissingData(totalCases.value)}
          tooltip="These are the total number of cases which have tested positive for COVID-19 since records began on 28 February, 2020."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="dailyFatalities"
          title="DAILY FATALITIES"
          subtitle={guardMissingData(
            getRelativeReportedDate(dailyFatalities.date)
          )}
          value={guardMissingData(dailyFatalities.value)}
          tooltip="These are the fatalities reported on the above day, and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="totalFatalities"
          title="TOTAL FATALITIES"
          subtitle={SUBTITLE_TOTAL}
          value={guardMissingData(totalFatalities.value)}
          tooltip="These are the total number of fatalities where COVID-19 is noted on the Death Certificate since records began on 28 February, 2020."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="fatalityCaseRatio"
          title="DEATH/CASE RATIO"
          value={guardMissingData(fatalityCaseRatio)}
          tooltip="This is the % of people who have died after testing positive for the COVID-19. The real fatality rate is currently estimated at < 1% as not everyone who catches COVID-19 gets tested."
        />
      </div>
    </div>
  );
}

export default SingleValueBar;