import {useState } from "react";
import protobuf from 'protobufjs';
import {Buffer} from "buffer";
import { Box, Button, Heading, Input } from "@chakra-ui/react";
import TableComp from "./components/Table";
import ChartComponent from "./components/ChartComponent";

function App() {

  let [stock,setStock]= useState(null);
  const [query,setQuery]= useState("");
  const [historicalData, setHistoricalData] = useState(null);


  const handleClick=()=>{
    console.log(query);
    fetchHistoricalData(query)
    priceData(query)
  }

  const priceData=(query)=>{
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
        // console.log(next)
        setStock(next)
      };
    });
  }  
  
  console.log(stock)

  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await fetch(`http://localhost:3001/historical/${symbol}?from=2021-06-28&to=2023-07-28`);
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  // console.log(historicalData)


  return (
    <Box >
      <Heading style={{textAlign:'center'}}>Stocks</Heading>
      <Box>
        <Input type='text' placeholder="Search" width='200px' value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Button onClick={handleClick}>Enter</Button>
      </Box>

      {stock ? <Heading marginTop='20px' style={{textAlign:'center'}}>{stock.price}</Heading>:""}

      {historicalData && historicalData.length>0 &&
        <ChartComponent data={historicalData}></ChartComponent>
      }

      {historicalData && historicalData.length>0 &&
        <TableComp data={historicalData}></TableComp>
      }

    </Box>
  );
}

export default App;
