import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import GaugeChart from 'react-gauge-chart'

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling']
});

function STBD() {

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
            <Meters>
            <GaugesRowWrapper>
              <GaugesRow>
                <GaugeChart 
                  padding='20px'
                  id="l1"
                  arcsLength={[0.8, 0.3, 0.2]} 
                  animate={false} 
                  percent={(shore[0] ? Math.round(shore[0]) : 0)} 
                  formatTextValue={value => (shore[0] ? Math.round(shore[0]) : 0) + `V`}
                />
             </GaugesRow>
             <GaugesRow>
		          <GaugeChart 
                padding='20px' 
                id="l2" 
                arcsLength={[0.8, 0.3, 0.2]} 
                animate={false} 
                percent={(shore[1] ? Math.round(shore[1]) : 0)} 
                formatTextValue={value => (shore[1] ? Math.round(shore[1]) : 0) + `V`}
              />             
            </GaugesRow>
            <GaugesRow>
              <GaugeChart 
                padding='20px' 
                id="l3" 
                arcsLength={[0.8, 0.3, 0.2]} 
                animate={false} 
                percent={(shore[2] ? Math.round(shore[2]) : 0)} 
                formatTextValue={value => (shore[2] ? Math.round(shore[2]) : 0) + `V`}
              />
             
	          </GaugesRow>
          </GaugesRowWrapper>
          <GaugesRowWrapper>
            <GaugesRow>
              <GaugeChart 
                id="a1" 
                animate={false} 
                percent={(shore[3] ? Math.round(shore[3]) : 0)} 
                formatTextValue={value => (shore[3] ? Math.round(shore[3]) : 0) + `A`}
              />             
             </GaugesRow>
            <GaugesRow>
              <GaugeChart 
                id="a2" 
                animate={false} 
                percent={(shore[4] ? Math.round(shore[4]) : 0)} 
                formatTextValue={value => (shore[4] ? Math.round(shore[4]) : 0) + `A`}
              />
             
            </GaugesRow>
            <GaugesRow>
              <GaugeChart 
                id="a3" 
                animate={false} 
                percent={(shore[5] ? Math.round(shore[5]) : 0)} 
                formatTextValue={value => (shore[5] ? Math.round(shore[5]) : 0) + `A`}
              />             
             </GaugesRow>
          </GaugesRowWrapper>
            </Meters>
          <Controller>
              {pms === 1 ? <BTN onClick={() => socket.send('SHORE:ON')}>ON</BTN> : null}
              {pms === 2 ? <BTN onClick={() => socket.send('SHORE:OFF')}>OFF</BTN> : null}
              {pms === 3 ? <BTN onClick={() => socket.send('transfer to shore')}>CONV ON</BTN> : null}
              {pms === 4 ? <BTN onClick={() => socket.send('transfer to shore')}>CONV OFF</BTN> : null}
              {pms === 5 ? <BTN onClick={() => socket.send('transfer to shore')}>TRANSFER TO PORT</BTN> : null}
              {pms === 6 ? <BTN onClick={() => socket.send('transfer to shore')}>TRANSFER TO STBD</BTN> : null}
              {pms === 7 ? <BTN onClick={() => socket.send('transfer to shore')}>TRANSFER TO SHORE</BTN> : null}
          </Controller>
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

export default STBD;
