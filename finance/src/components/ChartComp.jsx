import { Box, Heading } from '@chakra-ui/react';
import React from 'react'
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip } from 'victory';
// import { Line } from 'react-chartjs-2';

const ChartComp = (historicalData) => {
    const data=historicalData.data;
    console.log(data)

    let formatDateString = (dateString) => {
        const date = new Date(dateString);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        };
      
        return date.toLocaleDateString('en-US', options);
      };

    const chartData = data.map((item) => ({
        x: formatDateString(item.date),
        y: item.close,
      }));

    
  return (

    


    <Box>
     <Heading marginBottom='20px' textAlign='center' size='md'>Chart</Heading>



     <VictoryChart>
      <VictoryAxis />
      <VictoryAxis dependentAxis />
      <VictoryLine
        data={chartData}
        x="x"
        y="y"
        style={{
          data: { stroke: "#8884d8" },
          labels: { fill: "#8884d8" },
        }}
        labelComponent={<VictoryTooltip />}
      />
    </VictoryChart>
    </Box>
  )
}

export default ChartComp
