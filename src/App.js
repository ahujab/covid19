import React, { useState, useEffect } from "react";
import "./App.css";
import dataS from "./data.json"; 
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import LineGraphC from "./LineGraphC";
import Table from "./Table";
import TableS from "./TableS";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [NameLine, setNameLine] = useState([]);
  
  const [mapCountries, setMapCountries] = useState([]);
  const [LineCountries, setLineCountries] = useState("worldwide");
  const [tableData, setTableData] = useState([]);
  const [tableDataS, setTableDataS] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          console.log("frst", countries);
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          
          setTableData(sortedData);
        })
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    const getStatesData = async () => {
      fetch("https://disease.sh/v3/covid-19/states")
        .then((response) => response.json())
        .then((data) => {
          const states = data.map((state) => ({
            name: state.state
            
          }));
          let sortedData = sortData(data);
          setStates(states);
          //setMapCountries(data);
          setTableDataS(sortedData);
        });
    };

    getStatesData();
  }, []);

  var i = 0;
  var arrayname=[]
  for(i=0;i<dataS.length;i++) {
    var countryS="country"
  
  arrayname.push(dataS[i][countryS]);
  }
  //console.log("yolo",arrayname);
  
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const countryName=e.target.name;
    console.log(countryName + " hghgh");

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setLineCountries(countryCode);
        setNameLine(countryName);
        //console.log("lc",countryCode);
        if(countryCode==="worldwide"){
          setMapCenter([34.80746,  -40.4796]);
        }
        else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              //name = {country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.name}>{country.name}</MenuItem>
                
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            {
            LineCountries==="USA"? <><h3>Live Cases by US States</h3> <TableS states={tableDataS} /></>: "" 
            }
            
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
            {console.log(NameLine + " nameLine")}
            {
            LineCountries!=="worldwide" && arrayname.includes(LineCountries)?<><h3>Countrywise new {casesType}</h3>
            <LineGraphC countries={LineCountries} casesType={casesType} /></>: "" 
            }
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
