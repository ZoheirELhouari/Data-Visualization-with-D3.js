import React, { useEffect, useState } from "react";
import * as d3 from 'd3';
import userEvent from "@testing-library/user-event";
import {event as currentEvent} from 'd3-selection';
import { max } from "d3";
import { scaleQuantile, range, geoPath } from 'd3';

function ChroplethMap({geodata,maxRate,maxIncome,grouped_data,setFilteredMergedData}){

    const [geoLocation, setGeoLocation] = useState(geodata);
    const colorMap = [
        ["#e8e8e8", "#e4acac", "#c85a5a"],
        ["#b0d5df", "#ad9ea5", "#985356"],
        ["#64acbe", "#627f8c", "#574249"]
      ];

    const width = 600;
    const height = 450;


    function createMap(){

        
        
        d3.select(".mapContainer").selectAll("svg").remove();
        // Creating a choropleth map and filling each state's polygon on the map with 
        const svg = d3.select(".mapContainer")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
      
        const projection = d3.geoAlbersUsa()
            .fitSize([width , height ], geoLocation);

        const path = d3.geoPath().projection(projection);
        
        

        // creating the hover div 
        var div = d3.select("#hover_Container")
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("width", "200px")
                    .style("height", "5.5em")
                    .style("background-color", "#FBFBFF")
                    .style("border", "solid")
                    .style("opacity", 0)
                    .style("border-width", "1px")
                    .style("border-radius", "5px");

        
         svg.selectAll("path")
            .data(geoLocation.features)
            .join("path")
            .attr("d", path);
           

        svg.selectAll("path")
            .data(grouped_data)
            .on("click", function(event, d) {
                var clickedState = d.State;
                var filteredData = grouped_data.filter(function(d) {
                        if(d.State == clickedState){
                            d.clicked = true;
                        }
                        else{
                            d.clicked = false;
                        }
                        return d;
                    }

                );
                setFilteredMergedData(filteredData);
            })
            // adding a right click event 
            .on("contextmenu", function(event, d) {
                var clickedState = d.State;
                var filteredData = grouped_data.filter(function(d) {
                        if(d.State == clickedState){
                            d.clicked = false;
                        }
                        return d;
                    }
                    
                    );
                    setFilteredMergedData(filteredData);
            }
            )    
            
            .on("mouseover", function(event,d) {
                d3.select(this).style("cursor", "pointer")
                d3.select(this).attr("fill","#1065c0")
                div.transition()
                    .duration(200)
                    .style("opacity", .7);
                div.html("State: " + d.State + "<br/>" + "Burglary Rate: " + d.Rate + "<br/>" + "Personal Income: " + d.Income)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 150) + "px")
                    .style("visibility", "visible");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default")
                d3.select(this).attr("fill", function(d) {
                    return d.selected == true ? choropleth(d) : "grey";
                })
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            
            .transition()
            .duration(1000)
            .attr("fill", function(d) { 
                return d.selected == true ? choropleth(d) : "grey";
            })
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("class", "state")


        function choropleth(d) {
            //get data value
            var value = d.Rate;
            var income = d.Income;
            //if value exists, assign it a color; otherwise assign gray
            if (value && income) {
                // return recolorMap(value);
                return Color(d.Rate, d.Income);
            } 
        }

        function Color(x, y) {
            const i = Math.floor((3 * x  ) / maxRate);
            const j = Math.floor((3 * y  ) / maxIncome);
            //Color is 3x3 array
            return colorMap[i === 3 ? 2 : i][j === 3 ? 2 : j];
            }

   
    }


    useEffect(() => {
        createMap();
    },[grouped_data])

    return(
        <div className="mapContainer">
            <div id="hover_Container"></div>
        </div>
    )
}

export default ChroplethMap;