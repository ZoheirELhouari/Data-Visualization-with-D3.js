import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import userEvent from "@testing-library/user-event";
import { axisLeft } from "d3";
import {event as currentEvent} from 'd3'

function Scatterplot({ maxRate,maxIncome,grouped_data,setFilteredMergedData  }) {

  const colorMap = [
    ["#e8e8e8", "#e4acac", "#c85a5a"],
    ["#b0d5df", "#ad9ea5", "#985356"],
    ["#64acbe", "#627f8c", "#574249"]
  ];

  const width = 700;
  const height = 500;

  function createSvg() {
        
    const svg = d3
      .select(".plot")
    // adding the text label for the y-axis
    d3.select(".y_label").remove();
    svg
      .append("text")
      .attr("class", "y_label")
      .attr("transform", "rotate(-90)")
      .attr("y", -80)
      .attr("x", 0 - height / 2 )
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Per Capita Disposable Personal Income (in $)");

    // adding the text label for the x-axis
    d3.select(".x_label").remove();
    svg
      .append("text")
      .attr("class", "x_label")
      .attr("x", width / 2)
      .attr("y", 530)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Burglary Rate  (per 100.000 people)");

    // creating the x axis
    const xScale = d3
      .scaleLinear()
      .domain([0, maxRate])
      .range([0, width ])
      .nice();

    // creating the y axis
    const yScale = d3
      .scaleLinear()
      .domain([0, maxIncome])
      .range([height, 0])
      .nice();

    // specifying the axis location
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('$.2s'));

    var background = svg.append("g")
                        .attr("class", "background")
                        .attr("transform", `translate(0,0)`)
                        

    const scatterplot = svg 

    // adding the x axis to the scatterplot group
    d3.select(".leftaxis").remove();
    const axisLeft = scatterplot
      .append("g")
      .attr("transform", `translate(0,0)`)
      .classed("leftaxis", true)
      .call(yAxis);

      // adding the y axis to the scatterplot group
    d3.select(".bottomaxis").remove();
    const axisBottom = scatterplot
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .classed("bottomaxis", true)
      .call(xAxis);
    

    // adding the circles 
    scatterplot.selectAll(".dot")
      .data(grouped_data)
      .join("circle")
      .transition()
      .duration(1000)
      .attr("class", "dot")
      .attr("fill", function(d){
        
        if (d.selected == true && d.clicked == false ){
          return "orange"
        }else if (d.selected == true && d.clicked == true){
          return "blue"
        }else{
          return "purple"
        }
        
      })
      .attr("cx", (d) => xScale(d.Rate))
      .attr("cy", (d) => yScale(d.Income))
      .attr("r", 5)
      
      .attr("opacity", 1)
      .attr("stroke", "white")
      
      
      

    
      
    

 
    // adding the brushing effect
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [width  , height],
      ])
      .on(" end ", brushed);

    // adding the brush to the scatterplot group
    svg.select(".brushArea")
              .raise()
              .call(brush)
            
    var block_width = (width ) / 3
    var block_height = (height) / 3

    // create a background group 
    // adding the tiles as background 
   svg.select(".background")
    .selectAll(".tile")
    .data(colorMap.flat(1))
    .classed("tile", true)
    .join("rect")
    .attr("x", (d, i) => Math.floor(i/3) * block_width )
    .attr("y", (d, i) => (i%3) * block_height )
    .attr("width", block_width)
    .attr("height", block_height)
    .attr("fill",  (d, idx) => colorMap[Math.floor(idx / 3)][2 - (idx % 3)])



    

    function brushed(event ) {
      
      const selection = event.selection;
      if (!selection) {
        const selectedData = [];
        grouped_data.forEach(function (d) {
          d.selected = true;
          d.clicked = false;
          selectedData.push(d);
        });
        
        // grouped_data = selectedData
        // console.log(selectedData)
        setFilteredMergedData(selectedData);
        return;
      }
  
      const [[x0, y0], [x1, y1]] = selection;
      
      var clear = x0 === x1 || y0 === y1;
  
      const selectedData = [];
      grouped_data.forEach(function (d) {
        d.selected = clear
          ? false
          : !(
              xScale(d.Rate) < x0 ||
              xScale(d.Rate) > x1 ||
              yScale(d.Income) < y0 ||
              yScale(d.Income) > y1
            );
            selectedData.push(d);
      });
        

  
      // grouped_data = selectedData
      
      setFilteredMergedData(selectedData);
    }



              



  }

  useEffect(() => {
    createSvg();
  }, [grouped_data]);

  return (
    <div className="plotContainer">
      
        <svg width={width} height={height} className="plot" overflow="visible">
          <g className="brushArea" ></g>
        </svg>

    </div>
  );
}

export default Scatterplot;
