import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@chakra-ui/react';

const ChartComponent = (historicalData) => {

  const data = historicalData.data
  const chartRef = useRef();


  let formatDateString = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options).replace(/\//g, '-');
}


  const drawChart = () => {

    const aapl = data.map((item) => ({
        date: new Date(formatDateString(item.date)),
        // date: item.open,
        close: item.close,
      }));
      console.log(aapl)
  
    // Declare the chart dimensions and margins.
    const width = 1500;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
  
    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc(d3.extent(aapl, d => d.date), [marginLeft, width - marginRight]);
  
    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear([0, d3.max(aapl, d => d.close)], [height - marginBottom, marginTop]);
  
    // Declare the line generator.
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.close));
  
    // Create the SVG container.
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    // Add the x-axis.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
  
    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Daily close ($)"));
  
    // Append a path for the line.
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line(aapl));
  };

  useEffect(() => {
    drawChart();
  }, []);

  return <Box marginTop='100px' ref={chartRef}></Box>;

}

export default ChartComponent;