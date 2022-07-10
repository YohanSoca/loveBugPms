import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import styled, { keyframes, css } from "styled-components";
import GaugeChart from 'react-gauge-chart';
import './ventilation.css';
import mqtt from 'mqtt';
import { b2d, d2b, flip, query, bit_set, bit_clear, bit_toggle, bit_test } from '../utils';

var options = {
	protocol: 'ws',
	//clientId: 'b0908853' 	
};
var client  = mqtt.connect('mqtt://134.122.115.93:9001', options);

// preciouschicken.com is the MQTT topic
client.subscribe('portaftfan');
client.subscribe('portfwrfan');
client.subscribe('stbdaftfan');
client.subscribe('stbdfwrfan');

function Ventilation() {

  const [portAftFan, setPortAftFan] = useState([]);
  const [portFwrFan, setPortFwrFan] = useState([]);
  const [stbdAftFan, setStbdAftFan] = useState([]);
  const [stbdFwrFan, setStbdFwrFan] = useState([]); 
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    client.on('message', function (topic, message) {
      
      if(topic === 'portaftfan') {
        let fan = message.toString();
        fan  = fan.split(' ');
        setPortAftFan(current => fan);
      }
      if(topic === 'portfwrfan') {
        let fan = message.toString();
        fan  = fan.split(' ');
        setPortFwrFan(current => fan);
      }
      if(topic === 'stbdaftfan') {
        let fan = message.toString();
        fan  = fan.split(' ');
        setStbdAftFan(current => fan);
      }
      if(topic === 'stbdfwrfan') {
        let fan = message.toString();
        fan  = fan.split(' ');
        setStbdFwrFan(current => fan);
      }
      });
  }, []);
  

      return ( 
          <Screen>
            <Fan1>
              <Meters className='fan'>
                <Blade speed={portAftFan[1]} direction={query(portAftFan[0], 1) ? `normal` : `reverse`} src='./images/blades.png' />
              </Meters>
              <Controller className='control'>
                { portAftFan }
              </Controller>
            </Fan1>
            <Fan2>
              <Meters className='fan'>
              <Blade speed={portFwrFan[1]} direction={query(portFwrFan[0], 1) ? `normal` : `reverse`} src='./images/blades.png' />
              </Meters>
              <Controller className='control'>
              
              </Controller>
            </Fan2>
            <Fan3>
              <Meters className='fan'>
              <Blade speed={stbdAftFan[1]} direction={query(stbdAftFan[0], 1) ? `normal` : `reverse`} src='./images/blades.png' />
              </Meters>
              <Controller className='control'>
          
              </Controller>
            </Fan3>
            <Fan4>
              <Meters className='fan'>
              <Blade speed={stbdFwrFan[1]} direction={query(stbdFwrFan[0], 1) ? `normal` : `reverse`} src='./images/blades.png' />
              </Meters>
              <Controller className='control'>
         
              </Controller>
            </Fan4>
         </Screen>
      );
    };

    const bladeSpin = keyframes`
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    `;

    const Screen = styled.div`
      height: calc(100vh / 1.003);
      border: 1px solid red;
      display: grid;
      grid-template-rows: repeat(100, 1fr);
      grid-template-columns: repeat(100, 1fr);
    `;
    
    const Fan1 = styled.div`
        background-color: rgba(0, 0, 0, 0.6);
        box-shadow: 1px 1px 1px wheat;
        border-radius: 20px;
        grid-column: 5 / 45;
        grid-row: 5 / 45;

        display: grid;
        grid-template-rows: repeat(100, 1fr);
        grid-template-columns: repeat(100, 1fr);
    `;

    const Blade = styled.img`
      width: calc(100vw / 7);
      max-width: 500px;
      margin: 20px;
      animation-name: ${bladeSpin};
      animation-duration: ${props => 600 / props.speed}s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: ${props => props.direction};
    `;

    const Fan2 = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 55 / 95;
      grid-row: 5 / 45;

      display: grid;
        grid-template-rows: repeat(100, 1fr);
        grid-template-columns: repeat(100, 1fr);
`;

    const Fan3 = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 5 / 45;
      grid-row: 55 / 95;

      display: grid;
        grid-template-rows: repeat(100, 1fr);
        grid-template-columns: repeat(100, 1fr);
    `;

    const Fan4 = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 55 / 95;
      grid-row: 55 / 95;

      display: grid;
        grid-template-rows: repeat(100, 1fr);
        grid-template-columns: repeat(100, 1fr);
    `;

    const Meters = styled.div`
       margin: 20px;
    `;

    const Controller = styled.div`
       
    `;

    const BTN = styled.button`
      border-radius: 20px;
      color: wheat;
      background-color: green;
      width: calc(100vw / 6);
      height: 80px;
      font-size: 2.2rem;
      font-weight: bold;
      margin: 20px 10px 10px 10px;
    `;

    

export default Ventilation;
