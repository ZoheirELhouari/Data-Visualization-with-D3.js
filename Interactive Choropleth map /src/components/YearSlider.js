import React from "react";
import * as d3 from 'd3';
import  { useEffect, useState } from "react";

function Yearslider({year,setYear}){



function createSlider(){
    

    const slider = d3.select(".sliderContainer")
                    .append("input")
                        .attr("type", "range")
                        .attr("min", 1984)
                        .attr("max", 2014)
                        .attr("step", 1)
                        .attr("width", 400)
                        .attr("height", 100)
                        .attr("value", year)
                        .attr("id", "slider")
                        .on("input", function(){
                            d3.select("#slider-label")
                                .text("Year: " + this.value)
                                .attr("value", this.value)
                                year = this.value;
                                setYear(year);
                        })
    
    // adding some design to the slider with css 
                    
    d3.select(".sliderContainer")
        .append("label")
            .attr("id", "slider-label")
            .text("Year: " + year)
            .attr("value", year)
            .attr("width", 400)
            .attr("height", 100)
            .attr("for", "slider")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("color", "white")
            .style("margin-left", "20px")
            .style("margin-top", "20px")
            .style("margin-bottom", "20px")
            .style("margin-right", "20px")
            .style("display", "inline-block")
            .style("text-align", "center")
            .style("vertical-align", "middle")
            .style("line-height", "normal")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("border", "1px solid white")
            .style("box-shadow", "0 0 5px white")

            .style("outline", "none")
            
    // align the content of slidercontainer centered 
    d3.select(".sliderContainer")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
                     

    const sliderValue = d3.select("#slider").property("value")
    d3.select("#slider-label").text("Year: " + sliderValue)
    
}

useEffect(() => {
    createSlider();
},[])

    return(
        
        <div className="sliderContainer">
            
        </div>
    )
}

export default Yearslider;



