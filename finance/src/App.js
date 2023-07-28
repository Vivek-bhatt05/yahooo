import {useState } from "react";
import protobuf from 'protobufjs';
import {Buffer} from "buffer";
import { Box, Button, Heading, Input } from "@chakra-ui/react";
import TableComp from "./components/Table";

function App() {

  const [stock,setStock]= useState(null);
  const [query,setQuery]= useState("");
  const [historicalData, setHistoricalData] = useState(null);


  const handleClick=()=>{
    console.log(query);
    fetchHistoricalData(query)
    chartData(query)
  }

  const chartData=(query)=>{
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    console.log(ws);
     protobuf.load('./YPricingData.proto',(err,root)=>{
      if(err){
        console.log(err)
      }
      const Yaticker = root.lookupType("yaticker");
      
      
      ws.onopen = function open() {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: [`${query}`]
        }));
      };
      
      ws.onclose = function close() {
        console.log('disconnected');
      };
      
      ws.onmessage = function incoming(message) {
        console.log('comming message')
        const next =  Yaticker.decode(new Buffer(message.data, 'base64'))
        console.log(next)
        setStock(next)
      };
    });
  }  
  
  console.log(stock)

  const fetchHistoricalData = async (symbol) => {
    try {
    // const symbol = 'AAPL';
    // const from = '2012-01-01';
    // const to = '2012-12-31';

      const response = await fetch(`http://localhost:3001/historical/${symbol}?from=2022-07-26&to=2023-07-26`);
      const data = await response.json();
      // console.log(data)
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };


  return (
    <Box >
      <Heading style={{textAlign:'center'}}>Stocks</Heading>
      {/* {stock?.price} */}

      <Box>
        <Input type='text' placeholder="Search" width='200px' value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Button onClick={handleClick}>Enter</Button>
      </Box>

   {historicalData && historicalData.length>0 &&
     <TableComp data={historicalData}></TableComp>
   }

    </Box>
  );
}

export default App;
