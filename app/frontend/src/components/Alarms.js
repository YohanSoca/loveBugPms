import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import GaugeChart from 'react-gauge-chart'

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling']
});

function Alarms() {

  const [shore, setShore] = useState([]);
  const [converter, setConverter] = useState([]);
  const [gens, setGens] = useState([]);
  const [pms, setPMS] = useState(0);

  useEffect(() => {
    socket.on('asea', asea => {
      console.log(asea)
      if(asea[`MEASURE:SP1:ALL`].length > 0) {
        setShore(current => asea[`MEASURE:SP1:ALL`].slice(0, 9));
      }
      if(asea[`MEASURE:CONVERTER:ALL`].length > 0) {
        setConverter(current => asea[`MEASURE:CONVERTER:ALL`].slice(0, 9));
      }
      if(asea[`MEASURE:GEN:ALL`].length > 0) {
        if(asea[`MEASURE:GEN:ALL`].length > 12) {
          setGens(current => asea[`MEASURE:GEN:ALL`].slice(0, 18));
        } else {
          setGens(current => asea[`MEASURE:GEN:ALL`].slice(0, 9));
        }
      }
      
    });
  }, []);
  

      return ( 
          <Screen>
 
         </Screen>
      );
    };

    const Screen = styled.div`
      display: flex;
      flex-direction: column;
      height: 100vh;

    `;

    const Meters = styled.div`
      flex: 1;
    `;

    const Controller = styled.div`
       background-color: black;
       height: calc(100vh / 6.1);
       margin-bottom: o;

       display: flex;
       justify-content: flex-end;
       items-align: center;
    `;

    const BTN = styled.button`
      border-radius: 20px;
      color: wheat;
      background-color: green;
      width: calc(100vw / 6);
      height: 80px;
      font-size: 2.2rem;
      font-weight: bold;
      margin: 20px 10px 010px 10px;
    `;

    const GaugesRowWrapper = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
    `;

    const GaugesRow = styled.div`
      display: flex;
      justify-content: center;

      background-color: black;
      color: green;
      width: calc(100vw / 3.6);
      margin: 20px;
      padding-top: 16px;
      border-radius: 20px;
      height: calc(100vh / 3.6);
    `;

    const GaugeWrapper = styled.h1`
      font-size: 5rem;
      text-shadow: 1px 1px 1px white;
    `

export default Alarms;
