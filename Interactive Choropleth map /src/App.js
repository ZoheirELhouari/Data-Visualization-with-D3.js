import React, { useEffect, useState } from "react";
// import logo from './logo.svg';
import "./App.css";
import * as d3 from "d3";
import * as d3queue from 'd3-queue'; 

import Scatterplot from "./components/Scatterplot";
import ChroplethMap from "./components/ChoroplethMap";
import Yearslider from "./components/YearSlider";
// const { queue } = require("d3-queue");


function App() {
  const [geoLocation, setGeoLocation] = useState();
  const [selectedYear, setSelectedYear] = useState(1984);
  const [ maxRate, setMaxRate] = useState();
  const [maxIncome, setMaxIncome] = useState();
  const [mergedData, setMergedData] = useState();
  const [filteredMergedData,setFilteredMergedData] = useState();

  // make the big container displayed as columns in one row
  d3.select(".big_container")
    .style("display", "flex")
    .style("flex-direction", "row")
    .style("justify-content", "space-around") 
    .style("align-items", "center");

  d3.select(".text")
    .style("text-align", "center")
    .style("padding-bottom", 40);

  d3.select("h1")
    .style("text-align", "center")
    .style("padding-bottom", 40)
    .style("padding-top", 40);

  // load data
  useEffect(() => {

    d3.json("assets/us-states-geo.json").then(function (data) {
      setGeoLocation(data);
    });


    Promise.all([
      d3.csv('assets/burglary_rates.csv'),
      d3.csv('assets/personal_income.csv')
      ]).then( ([file1, file2]) => {
        // merge the two files
        
        file1.forEach(function (d) {
          d.Rate = +d.Rate;
          d.Year = +d.Year;
          d.State = d.State;
          d.selected = true; 
          d.clicked = false;
        }
        );
        const maxRate = d3.max(file1, (d) => d.Rate);
        setMaxRate(maxRate);
        file2.forEach(function (d) {
          d.Income = +d.Income;
          d.Year = +d.Year;
          d.State = d.State;
          d.selected = true;
          d.clicked = false;
        }
        );
        const maxIncome = d3.max(file2, (d) => d.Income);
      setMaxIncome(maxIncome);
        // merge the two data sets
        
        const mergedData = file1.map((item) => {
          const item2 = file2.find((item2) => item2.State === item.State && item2.Year === item.Year);
          return {
            ...item,
            ...item2,
          };
        }); 
        setMergedData(mergedData);
    
          
      }).catch(err => console.log('Error loading or parsing data.'))



  }, []);

  useEffect(() => {
    
    const filteredMergedData = mergedData?.filter((d) => d.Year == selectedYear);
    setFilteredMergedData(filteredMergedData);    
  }, [selectedYear,mergedData]);



  return (
    
    <>
    
    <div className="text">
      <h1>Burglary rate and income in US from 1984 to 2014</h1>
      <p>The burglary rate is the number of burglaries per 100,000 people</p>
      <p>The income is the average income per person</p>


    </div>  

    <Yearslider year={selectedYear} setYear={setSelectedYear} />
    <div className="big_container">
      

      { filteredMergedData? (
        <Scatterplot 
        maxRate={maxRate}  
        maxIncome={maxIncome} 
        grouped_data ={filteredMergedData}
        setFilteredMergedData ={setFilteredMergedData}/>
      ) : (
        <p>loading</p>
      )}
      {geoLocation  && filteredMergedData ? (
        <ChroplethMap
          geodata={geoLocation}
          year={selectedYear}
          maxRate={maxRate}
          maxIncome={maxIncome}
          grouped_data ={filteredMergedData}
          setFilteredMergedData = {setFilteredMergedData}
        />
      ) : (
        <p>loading</p>
      )}

      
    </div>
    </>
  );
}

export default App;
