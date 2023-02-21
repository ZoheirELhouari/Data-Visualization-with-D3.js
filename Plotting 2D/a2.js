// language javascript 

const svg_width = 1300;
const svg_height = 600;



d3.csv("data1.csv").then( function(data) {
    data.forEach(function(d) {
        d.Year = +d.Year;
        d.Value = +d.Value;
        d.Country_Code = d.Country_Code;
        d.Country_Name = d.Country_Name;
    });
    // group the data: I want to draw one line per group
    var groupedData = d3.group(data, d => d.Country_Name);

    
    // creating the svg element
    var svg = d3.select("#content")
                .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .classed("container", true);
    
    // adding the text label for the y axis 
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (svg_height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("fertility rate");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (svg_height / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("(Birth per women)");

    // adding the text label for the x axis
    svg.append("text")
        .attr("x", svg_width / 2 )
        .attr("y", 590)
        .attr("text-anchor", "middle")
        .text("Year")
        .style("font-size", "18px")
        .style("font-weight", "bold");

    
    

    // creating the x axis 
    var xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.Year))
                .range([0, svg_width - 150])

    // creating the y axis
    var yScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.Value), d3.max(data, d => d.Value)])
                .range([svg_height, 90])
                .nice();
    // specifying the axis location
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // creating the chart group 
    var chart = svg.append("g")
                     .attr("transform", "translate(100, -60)");

    // adding the y axis to the chart
    leftAxis = chart.append("g")
        .attr("transform", "translate(0, -20)")
        .attr("class", "leftaxis")
        .attr("margin-bottom", 50)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .call(yAxis);
    //adding the x axis to the chart
    bottomAxis = chart.append("g")
        .attr("transform", "translate(0, " + (svg_height - 20) + ")")
        .attr("class", "bottomaxis")
        .attr("margin-bottom", 50)
        .text("Year")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .call(xAxis);    


    // restrict the drawing area to be exactly as our x axis width and svg hight
    chart.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", svg_width - 150)
        .attr("height", svg_height);


    // creating the line generator
    const lines = chart.append("g")
        .attr("class", "lines")
        .attr("clip-path", "url(#clip)");

    // creating the hover div 
    var div = d3.select("#hover-container")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", "200px")
            .style("height", "5.5em")
            .style("background-color", "#FBFBFF")
            .style("border", "solid")
            .style("opacity", 0)
            .style("border-width", "1px")
            .style("border-radius", "5px");

    
    // drwaing the lines   
    lines.selectAll(".lines")
        .data(groupedData)
    
        .join("path")
            .attr("id",function(d) { 
                var Country_Name = d[0].replaceAll(".", "");
                Country_Name = Country_Name.replaceAll(" ", "");
                return Country_Name.toLowerCase();                
                })
            .classed("line", true)
            .attr("fill", "none")
            // add one color for all the lines
            .attr("stroke", "#D5DFE5")
            .style("opacity", 0.5)
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScale(d.Year); })
                .y(function(d) { return yScale(+d.Value); })
                (d[1])
            })
            .on("mouseover", function(event,d) {
                // console.log(event); 
                d3.select(this)

                    .attr("stroke-width", 3.5)
                    .attr("opacity",1)
                    .attr("cursor", "pointer");

                // print the country name and the fertility rate for each year 
                div.transition()
                    .duration(200)
                const x = d3.pointer(event,this)[0]  ;
                const y = d3.pointer(event,this)[1]  ;
                const year = xScale.invert(x);
                const fertility = yScale.invert(y);
                div.html("Country: " + d[0] + "<br/>" +" Fertility Rate: " + fertility + "<br/>"  + "Year: "+ year)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("opacity", 1);
                
                    })
            .on("mouseout", function(event, d) {
                        d3.select(this)
                        div.style("opacity", 0);
                    })
                    .on("click", function(event,d) {
                            var Country_Name = d[0].replaceAll(".", "");
                                Country_Name = Country_Name.replaceAll(" ", "");
                                Country_Name = Country_Name.toLowerCase();
                            d3.select("#" + Country_Name)
                                .attr("stroke", "orange")
                                .attr("pointer-events", "cursor")
                                .attr("stroke-width", 4.5)
                                .attr("stroke-opacity", 1);
                            
                            
                            });

               
        
    // ################# second svg ####################################
    const brushble_height = 300;
    // creating the svg element
    var brushableArea = d3.select("#content")
                .append("svg")
                .attr("width", svg_width)
                .attr("height", brushble_height)
                .classed("brushble_container", true);
    
    // adding the label to the svg 
    brushableArea.append("text")
        .attr("x", svg_width / 2 )
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .text("Brushable Area")
        .style("font-size", "16px")
        .style("font-weight", "bold");
    

    // creating the x axis 
    var brushble_xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
                .range([0, svg_width - 150])
                .nice();

    // creating the y axis
    var brushble_yScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.Value), d3.max(data, d => d.Value)])
                .range([brushble_height, 70])
                .nice();
    // specifying the axis location
    var brushble_xAxis = d3.axisBottom(brushble_xScale);

     // creating the chart group 
    var brushble_chart = brushableArea.append("g")
                     .attr("transform", "translate(100, 0)");

    //adding the x axis to the chart
    brushble_bottomAxis = brushble_chart.append("g")
        .attr("transform", "translate(0, " + (brushble_height - 20) + ")")
        .attr("class", "brushble_bottomaxis")
        .attr("margin-bottom", 50)
        .text("Year")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .call(brushble_xAxis);

                  
    // creating the line generator
    const brushble_lines = brushble_chart.append("g")
        .attr("class", "ligne");


        // drwaing the lines
    brushble_lines.selectAll(".ligne")
        .data(groupedData)
        .join("path")
            .attr("fill", "none")
            .attr("stroke", "#D5DFE5")
            .style("opacity", 0.5)
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
            return d3.line()
                .x(function(d) { return brushble_xScale(d.Year); })
                .y(function(d) { return brushble_yScale(+d.Value); })
                (d[1])
            }
            );
    
           

             

    let brush = d3.brushX()
        .extent([[0, 50], [svg_width-150, brushble_height - 20]])
        .on("brush", brushed)
        .on("end",updateGraph);

    brushble_chart.append("g")
        .attr("class", "brush")
        .call(brush);
    

        function brushed({selection}) {
            // update the x axis on the first svg
            xScale.domain(selection.map(brushble_xScale.invert, brushble_xScale));
            xScale.nice();
            
            
          }

        function updateGraph(event) {

            // update the lines on the first svg
            lines.selectAll("path")
                .transition().duration(1000)
                .attr("d", function(d){
                    return d3.line()
                        .x(function(d) { return xScale(d.Year) ; } )
                        .y(function(d) { return yScale(+d.Value); })
                        (d[1])
                    }
                    );
                    bottomAxis.transition().duration(1000).call(d3.axisBottom(xScale));
                    
          }
            
            

    
    
    
 
});




    

