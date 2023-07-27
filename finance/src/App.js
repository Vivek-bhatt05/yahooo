import { useEffect, useState } from "react";
import protobuf from 'protobufjs';
import {Buffer} from "buffer";

function App() {

  const [stock,setStock]= useState(null);

  useEffect(()=>{
    
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
     protobuf.load('./YPricingData.proto',(err,root)=>{
      if(err){
        console.log(err)
      }
      const Yaticker = root.lookupType("yaticker");
      
      
      ws.onopen = function open() {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: ['AAPL']
        }));
      };
      
      ws.onclose = function close() {
        console.log('disconnected');
      };
      
      ws.onmessage = function incoming(message) {
        console.log('comming message')
        const next =  Yaticker.decode(new Buffer(message.data, 'base64'))
        setStock(next)
      };
    });
  },[])
  
  console.log(stock)


  const [historicalData, setHistoricalData] = useState(null);
  // const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    fetchHistoricalData();
    // fetchQuoteData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
    const symbol = 'AAPL';
    // const from = '2012-01-01';
    // const to = '2012-12-31';

      const response = await fetch(`http://localhost:3001/historical/${symbol}?from=2012-01-01&to=2012-12-31`);
      const data = await response.json();
      // console.log(data)
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  console.log(historicalData)


  return (
    <div >
      <h1 style={{textAlign:'center'}}>Stocks</h1>
      {stock?.price}
    </div>
  );
}

export default App;
