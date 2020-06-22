import React, { useEffect } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const defaultInputData = [
  {
    area: 'Ayrshire and Arran',
    lat: 55.445,
    lng: -4.575,
    totalCases: 1249
  },
  {
    area: 'Borders',
    lat: 55.2869,
    lng: -2.7861,
    totalCases: 345
  },
  {
    area: 'Dumfries and Galloway',
    lat: 55.0701,
    lng: -3.6053,
    totalCases: 284
  },
  {
    area: 'Fife',
    lat: 56.2082,
    lng: -3.1495,
    totalCases: 928
  },
  {
    area: 'Forth Valley',
    lat: 56.0253,
    lng: -3.8490,
    totalCases: 1055
  },
  {
    area: 'Grampian',
    lat: 57.1497,
    lng: -2.0943,
    totalCases: 1400
  },
  {
    area: 'Greater Glasgow and Clyde',
    lat: 55.8836,
    lng: -4.3210,
    totalCases: 4819
  },
  {
    area: 'Highland',
    lat: 57.4596,
    lng: -4.2264,
    totalCases: 373
  },
  {
    area: 'Lanarkshire',
    lat: 55.6736,
    lng: -3.7820,
    totalCases: 2698
  },
  {
    area: 'Lothian',
    lat: 55.9484,
    lng: -3.2121,
    totalCases: 3139
  },
  {
    area: 'Orkney',
    lat: 58.9809,
    lng: -2.9605,
    totalCases: 9
  },
  {
    area: 'Shetland',
    lat: 60.1580,
    lng: -1.1659,
    totalCases: 54
  },
  {
    area: 'Tayside',
    lat: 56.4620,
    lng: -2.970,
    totalCases: 1760
  },
  {
    area: 'Eileanan Siar (Western Isles)',
    lat: 57.1667,
    lng: -7.3594,
    totalCases: 7
  }
]

const GeoHeatMap = ({inputData=defaultInputData}) => {

  const calculateRadius = (totalCases) => {
    return totalCases * 15;
  };

  const createSeeds = (baseLayer) => {

    const circles = inputData.map((a, id) => (

      L.circle([a.lat, a.lng], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: calculateRadius(a.totalCases)
      }).addTo(baseLayer).bindPopup(a.area + ' - Total Cases: ' + a.totalCases)
    ));

  };

  useEffect(() => {

    // create map
    const geoHeatMap = L.map('map', {
      center: [57.8907, -4.7026],
      zoom: 6.25,
      doubleClickZoom: false,
      closePopupOnClick: false,
      dragging: false,
      zoomSnap: 0.25,
      zoomDelta: false,
      trackResize: false,
      touchZoom: false,
      scrollWheelZoom: false,
      layers:
        L.tileLayer('./MapofScotlandSHOWversion.png')

    });

    createSeeds(geoHeatMap);

  }, []);

  return (
    <>
      <div id="container">
        <div id="map"></div>
      </div>
    </>
  )

}

export default GeoHeatMap;
