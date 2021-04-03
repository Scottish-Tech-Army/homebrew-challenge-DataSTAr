import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function readCsvData(csvData) {
  var allTextLines = csvData
    .toString()
    .split(/\r\n|\n/)
    .filter((line) => line.trim().length > 0);
  var lines = [];

  // Remove the column header row
  allTextLines.shift();

  allTextLines.forEach((line) => {
    const splitline = line.split(",").map((s) => s.trim());
    if (isValidCsvRow(splitline)) {
      lines.push(splitline);
    } else {
      console.warn("Invalid csv data: [" + line + "]");
    }
  });
  return lines;
}

// Validate the first two cells ([date, featureCode] common to all the current CSV files)
function isValidCsvRow(cells) {
  const [dateString, featureCode] = cells;
  return (
    dayjs.utc(dateString, "YYYYMMDD", true).isValid() &&
    FEATURE_CODE_MAP[featureCode] !== undefined
  );
}

// Expects the input CSV columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
// as returned from :
// Daily Case Trends By Health Board
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2
// Daily Case Trends By Council Area
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/427f9a25-db22-4014-a3bc-893b68243055
//
// Returns a sorted set of all dates and a map of places->dates->values
function createPlaceDateValuesMap(lines) {
  const placeDateValuesMap = {};
  const dateSet = new Set();

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        crudeRatePositive,
        v2,
        dailyDeaths,
        cumulativeDeaths,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8,
        positivePercentage,
      ],
      i
    ) => {
      const date = dayjs.utc(dateString, "YYYYMMDD").valueOf();
      if (!placeDateValuesMap[place]) {
        placeDateValuesMap[place] = new Map();
      }
      var dateValuesMap = placeDateValuesMap[place];
      dateValuesMap.set(date, {
        cases: Number(dailyCases),
        deaths: Number(dailyDeaths),
        cumulativeCases: Number(cumulativeCases),
        cumulativeDeaths: Number(cumulativeDeaths),
        crudeRatePositive: Number(crudeRatePositive),
        positivePercentage: Number(positivePercentage),
      });
      dateSet.add(date);
    }
  );

  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValuesMap: placeDateValuesMap };
}

// Expects the input CSV columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
// as returned from :
// Daily Case Trends By Health Board
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2
// Daily Case Trends By Council Area
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/427f9a25-db22-4014-a3bc-893b68243055
//

const queryUrl = process.env.PUBLIC_URL + "/data/";

// Return summary stats per region for the last 7 days
function getCurrentWeekTotals({ dates, placeDateValuesMap }) {
  const endDate = dates[dates.length - 1];
  const startDate = dayjs.utc(endDate).subtract(6, "days").valueOf();
  const currentWeekDates = dates.filter((date) => date >= startDate);

  var scotlandTotalCases = 0;
  var scotlandTotalDeaths = 0;

  const regions = {};
  Object.keys(placeDateValuesMap).forEach((featureCode) => {
    const dateValuesMap = placeDateValuesMap[featureCode];
    var regionTotalCases = 0;
    var regionTotalDeaths = 0;
    currentWeekDates.forEach((date) => {
      const values = dateValuesMap.get(date);
      if (values !== undefined) {
        regionTotalCases += values.cases;
        regionTotalDeaths += values.deaths;
      }
    });
    regions[featureCode] = {
      weeklyCases: regionTotalCases,
      weeklyDeaths: regionTotalDeaths,
      name: getPlaceNameByFeatureCode(featureCode),
    };
    scotlandTotalCases += regionTotalCases;
    scotlandTotalDeaths += regionTotalDeaths;
  });

  regions[FEATURE_CODE_SCOTLAND] = {
    weeklyCases: scotlandTotalCases,
    weeklyDeaths: scotlandTotalDeaths,
    name: getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND),
  };

  return { currentWeekStartDate: currentWeekDates[0], regions: regions };
}
function getPopulationMap({ placeDateValuesMap }, finalDate) {
  const populationMap = {};
  Object.keys(placeDateValuesMap).forEach((place) => {
    const { cumulativeCases, crudeRatePositive } = placeDateValuesMap[
      place
    ].get(finalDate);
    if (crudeRatePositive === 0) {
      populationMap[place] = 0;
    } else {
      const population = 100000 * (cumulativeCases / crudeRatePositive);
      populationMap[place] = population;
    }
  });

  return populationMap;
}

function calculatePopulationProportionMap(populationMap) {
  const result = {};
  const scotlandPopulation = populationMap[FEATURE_CODE_SCOTLAND];
  if (scotlandPopulation !== undefined) {
    Object.keys(populationMap).forEach(
      (place) => (result[place] = populationMap[place] / scotlandPopulation)
    );
  }
  return result;
}

export const FEATURE_CODE_SCOTLAND = "S92000003";

export const FEATURE_CODE_COUNCIL_AREAS_MAP = {
  S12000033: "Aberdeen City",
  S12000034: "Aberdeenshire",
  S12000041: "Angus",
  S12000035: "Argyll & Bute",
  S12000036: "City of Edinburgh",
  S12000005: "Clackmannanshire",
  S12000006: "Dumfries & Galloway",
  S12000042: "Dundee City",
  S12000008: "East Ayrshire",
  S12000045: "East Dunbartonshire",
  S12000010: "East Lothian",
  S12000011: "East Renfrewshire",
  S12000014: "Falkirk",
  S12000047: "Fife",
  S12000049: "Glasgow City",
  S12000017: "Highland",
  S12000018: "Inverclyde",
  S12000019: "Midlothian",
  S12000020: "Moray",
  S12000013: "Na h-Eileanan Siar",
  S12000021: "North Ayrshire",
  S12000050: "North Lanarkshire",
  S12000023: "Orkney Islands",
  S12000048: "Perth & Kinross",
  S12000038: "Renfrewshire",
  S12000026: "Scottish Borders",
  S12000027: "Shetland Islands",
  S12000028: "South Ayrshire",
  S12000029: "South Lanarkshire",
  S12000030: "Stirling",
  S12000039: "West Dunbartonshire",
  S12000040: "West Lothian",
};

export const FEATURE_CODE_COUNCIL_AREAS = Object.keys(
  FEATURE_CODE_COUNCIL_AREAS_MAP
);

export const FEATURE_CODE_HEALTH_BOARDS_MAP = {
  S08000015: "Ayrshire & Arran",
  S08000016: "Borders",
  S08000017: "Dumfries & Galloway",
  S08000029: "Fife",
  S08000019: "Forth Valley",
  S08000020: "Grampian",
  S08000031: "Greater Glasgow & Clyde",
  S08000022: "Highland",
  S08000032: "Lanarkshire",
  S08000024: "Lothian",
  S08000025: "Orkney",
  S08000026: "Shetland",
  S08000030: "Tayside",
  S08000028: "Western Isles",
};

export const FEATURE_CODE_HEALTH_BOARDS = Object.keys(
  FEATURE_CODE_HEALTH_BOARDS_MAP
);

export const FEATURE_CODE_MAP = {
  S92000003: "Scotland",
  ...FEATURE_CODE_HEALTH_BOARDS_MAP,
  ...FEATURE_CODE_COUNCIL_AREAS_MAP,
};

export function getPlaceNameByFeatureCode(featureCode) {
  const result = FEATURE_CODE_MAP[featureCode];
  if (result === undefined) {
    throw new Error("Unknown feature code: " + featureCode);
  }
  return result;
}

function getPlaceTotalsStats(
  dateString,
  dailyCases,
  cumulativeCases,
  dailyDeaths,
  cumulativeDeaths
) {
  const date = dayjs.utc(dateString, "YYYYMMDD").valueOf();
  const fatalityCaseRatio =
    cumulativeCases !== undefined && cumulativeDeaths !== undefined
      ? ((cumulativeDeaths * 100) / cumulativeCases).toFixed(1) + "%"
      : undefined;
  return {
    dailyCases: { date: date, value: Number(dailyCases) },
    dailyDeaths: { date: date, value: Number(dailyDeaths) },
    cumulativeCases: { date: date, value: Number(cumulativeCases) },
    cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
    fatalityCaseRatio: fatalityCaseRatio,
  };
}

function parseNhsHBTotalsCsvData(lines) {
  const placeStatsMap = {};

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
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      placeStatsMap[place] = getPlaceTotalsStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

function parseNhsCATotalsCsvData(lines) {
  const placeStatsMap = {};

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        v2,
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      placeStatsMap[place] = getPlaceTotalsStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

function aggregateWeeks(dates, placeDateValuesMap) {
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const millisInWeek = 7 * 24 * 3600 * 1000;

  const weekStartDates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    weekStartDates.push(currentDate);
    currentDate = currentDate + millisInWeek;
  }
  const weeklyPlaceDateValuesMap = new Map();
  Object.keys(placeDateValuesMap).forEach((place) => {
    const dateValueMap = placeDateValuesMap[place];
    const weeklyDateValueMap = new Map();
    weeklyPlaceDateValuesMap.set(place, weeklyDateValueMap);

    weekStartDates.forEach((weekStart) => {
      const weekEnd = weekStart + millisInWeek;

      let total = {
        cases: 0,
        deaths: 0,
        cumulativeCases: 0,
        cumulativeDeaths: 0,
      };
      weeklyDateValueMap.set(weekStart, total);
      dates.forEach((date) => {
        if (date >= weekStart && date < weekEnd) {
          const current = dateValueMap.get(date);
          total.cases += current.cases;
          total.deaths += current.deaths;
          total.cumulativeCases = current.cumulativeCases;
          total.cumulativeDeaths = current.cumulativeDeaths;
        }
      });
    });
  });
  return { weekStartDates, weeklyPlaceDateValuesMap };
}

function getWeeklySeriesData({ dates, placeDateValuesMap }) {
  const { weekStartDates, weeklyPlaceDateValuesMap } = aggregateWeeks(
    dates,
    placeDateValuesMap
  );
  var regions = {};
  weeklyPlaceDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    weekStartDates.forEach((date) => {
      const { cases, deaths } = dateValuesMap.get(date);
      allCases.push(cases);
      allDeaths.push(deaths);
    });
    regions[featureCode] = { cases: allCases, deaths: allDeaths };
  });

  return {
    weekStartDates: weekStartDates,
    regionWeeklySeries: regions,
  };
}

function getDailySeriesData({ dates, placeDateValuesMap }) {
  const result = {};

  Object.keys(placeDateValuesMap).forEach((place) => {
    const dateValuesMap = placeDateValuesMap[place];

    const percentPositiveTests = [];
    const dailyCases = [];
    const dailyDeaths = [];
    const totalCases = [];
    const totalDeaths = [];

    dates.forEach((date, i) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
        positivePercentage,
      } = dateValuesMap.get(date);

      percentPositiveTests.push(positivePercentage);
      dailyCases.push(cases);
      dailyDeaths.push(deaths);
      totalCases.push(cumulativeCases);
      totalDeaths.push(cumulativeDeaths);
    });

    result[place] = {
      percentPositiveTests,
      dailyCases,
      dailyDeaths,
      totalCases,
      totalDeaths,
    };
  });

  return result;
}

function mergePlaceDateValuesMap(healthBoardMap, councilAreaMap) {
  const commonDates = healthBoardMap.dates.filter((date) =>
    councilAreaMap.dates.includes(date)
  );
  const commonPlaceDateValuesMap = {
    ...councilAreaMap.placeDateValuesMap,
    ...healthBoardMap.placeDateValuesMap,
  };
  Object.keys(commonPlaceDateValuesMap).forEach((region) => {
    const dateValuesMap = commonPlaceDateValuesMap[region];
    [...dateValuesMap.keys()].forEach((date) => {
      if (!commonDates.includes(date)) {
        dateValuesMap.delete(date);
      }
    });
  });
  return { dates: commonDates, placeDateValuesMap: commonPlaceDateValuesMap };
}

export function createJsonData(
  councilAreaCsvData = null,
  healthBoardCsvData = null,
  currentTotalsCouncilAreaCsvData = null,
  currentTotalsHealthBoardCsvData = null
) {
  if (
    councilAreaCsvData === null ||
    healthBoardCsvData === null ||
    currentTotalsCouncilAreaCsvData === null ||
    currentTotalsHealthBoardCsvData === null
  ) {
    return null;
  }
  const councilAreaDataset = readCsvData(councilAreaCsvData);
  const healthBoardDataset = readCsvData(healthBoardCsvData);
  const currentTotalsCouncilAreaDataset = readCsvData(
    currentTotalsCouncilAreaCsvData
  );
  const currentTotalsHealthBoardDataset = readCsvData(
    currentTotalsHealthBoardCsvData
  );

  const placeDateValuesMap = mergePlaceDateValuesMap(
    createPlaceDateValuesMap(healthBoardDataset),
    createPlaceDateValuesMap(councilAreaDataset)
  );
  const startDate = placeDateValuesMap.dates[0];
  const endDate = placeDateValuesMap.dates[placeDateValuesMap.dates.length - 1];

  const populationMap = getPopulationMap(placeDateValuesMap, endDate);
  const populationProportionMap = calculatePopulationProportionMap(
    populationMap
  );

  let { currentWeekStartDate, regions } = getCurrentWeekTotals(
    placeDateValuesMap
  );

  const regionTotals = {
    ...parseNhsCATotalsCsvData(currentTotalsCouncilAreaDataset),
    ...parseNhsHBTotalsCsvData(currentTotalsHealthBoardDataset),
  };

  const { weekStartDates, regionWeeklySeries } = getWeeklySeriesData(
    placeDateValuesMap
  );
  const regionDailySeries = getDailySeriesData(placeDateValuesMap);

  Object.keys(regions).forEach((region, i) => {
    const regionData = regions[region];
    Object.assign(regionData, regionTotals[region]);
    regionData.population = populationMap[region];
    regionData.populationProportion = populationProportionMap[region];
    regionData.weeklySeries = regionWeeklySeries[region];
    regionData.dailySeries = regionDailySeries[region];
  });

  const result = {
    regions: regions,
    dates: placeDateValuesMap.dates,
    weekStartDates: weekStartDates,
    startDate: startDate,
    endDate: endDate,
    currentWeekStartDate: currentWeekStartDate,
  };
  // console.log(result);
  return result;
}