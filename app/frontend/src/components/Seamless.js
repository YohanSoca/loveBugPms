import io from 'socket.io-client';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import styled from "styled-components";
import { keyframes, css } from 'styled-components';
import './seamless.css';
import GaugeChart from 'react-gauge-chart';
import { useLongPress } from 'use-long-press';
import { b2d, d2b, flip, query, bit_set, bit_clear, bit_toggle, bit_test } from '../utils';

// const socket = io('http://192.168.50.102:4000', {
//   transports: ['websocket', 'polling']
// });
let controlReg = 0;

function Seamless() {
  const [localControlRegister, setlocalControlRegister] = useState();
  const [controlRegister, setControlRegister] = useState(1088);
  const [transferInProgress, setTransferInProgress] = useState(false);
  const [success, setSuccess] = useState(true);
  const [msg, setMsg] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [admin, setAdmin] = useState(false);

  const callback = useCallback((event, {context}) => {
    let temp;
    switch(context) {
      case `port-breaker`:
        temp = controlReg;
        temp = bit_toggle(temp, 10);
        controlReg = temp;
        setlocalControlRegister(current => temp );
        setMsg(localControlRegister);
        break;
      case `stbd-breaker`:
        temp = controlReg;
        temp = bit_toggle(temp, 11);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
      case `shore-breaker`:
        temp = controlReg;
        temp = bit_toggle(temp, 9);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
      case `main-bus`:
        temp = controlReg;
        temp = bit_toggle(temp, 8);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
      case `port-run`:
        temp = controlReg;
        temp = bit_toggle(temp, 6);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
      case `stbd-run`:
        temp = controlReg;
        temp = bit_toggle(temp, 7);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
      case `shore-on`:
        temp = controlReg;
        temp = bit_toggle(temp, 5);
        controlReg = temp;
        setlocalControlRegister(current => temp);
        setMsg(localControlRegister);
        break;
    }
  }, []);
  const bind = useLongPress(enabled ? callback : null, {
    onStart: event => console.log('Press started'),
    onFinish: event => console.log('Long press finished'),
    onCancel: event => console.log('Press cancelled'),
    onMove: event => console.log('Detected mouse or touch movement'),
    filterEvents: event => true, // All events can potentially trigger long press
    threshold: 2000,
    captureEvent: true,
    cancelOnMovement: false,
    detect: 'both',
  });

  useEffect(() => {
    // socket.on('duogens', duogens => {
      
    // });
  }, []);            

  
      return ( 
          <Screen>
            <Dashboard>
                <PortGen {...bind(`port-run`)}>
                  <Indicator 
                    live={query(localControlRegister, 6)} 
                    progress={query(localControlRegister, 6) && !query(controlRegister, 6)}
                    />
                  <Title>G1</Title>
                </PortGen>
                <PortBreaker 
                  {...bind('port-breaker')} 
                  live={query(localControlRegister, 10)}>
                </PortBreaker>
                <PortFeeder 
                  {...bind('port-feeder')} 
                    live={query(localControlRegister, 10)}>
                </PortFeeder>
                <PortBusDrop 
                  {...bind('port-feeder')} 
                  live={query(localControlRegister, 8) || query(localControlRegister, 11) || query(localControlRegister, 10) || query(localControlRegister, 9)}>
                </PortBusDrop>

                <STBDGen {...bind(`stbd-run`)}>
                  <Indicator 
                    live={query(localControlRegister, 7)} 
                    progress={query(localControlRegister, 7)}/>
                    <Title>G2</Title>
                </STBDGen>
                <STBDBreaker 
                  {...bind('stbd-breaker')} 
                  live={query(localControlRegister, 11)}>
                </STBDBreaker>
                <STBDFeeder {...bind('port-feeder')} live={query(localControlRegister, 11)} />
                <STBDBusDrop {...bind('port-feeder')} live={query(localControlRegister, 8) || query(localControlRegister, 11) || query(localControlRegister, 10) || query(localControlRegister, 9)}></STBDBusDrop>

                <Shore 
                  {...bind(`shore-on`)}><Indicator 
                  live={query(localControlRegister, 5)} 
                  progress={query(localControlRegister, 5)}/>
                    <Title>ASEA</Title>
                </Shore>
                <ShoreBreaker 
                  {...bind('shore-breaker')} 
                  live={query(localControlRegister, 9)}
                  />
                <ShoreFeeder 
                  {...bind('shore-feeder')} 
                  live={query(localControlRegister, 9)} 
                />
                <ShoreBusDrop
                  {...bind('shore-feeder')} 
                  live={query(localControlRegister, 8) || query(localControlRegister, 11) || query(localControlRegister, 10) || query(localControlRegister, 9)}
                  />

                <MainBus 
                  {...bind('main-bus')} 
                  live={query(localControlRegister, 8) || query(localControlRegister, 10) || query(localControlRegister, 11) || query(localControlRegister, 9)}>
                  <h3 style={{color: 'wheat', textAlign: 'center'}}>{ controlReg.toString(2) + '  ' + controlReg }</h3>
                </MainBus>
            </Dashboard>
        </Screen>
      );
    };

    const Blinking = keyframes`
      50% {
        opacity: 0;
        background-color: yellow;
      }
    `;

    const Screen = styled.div`
    
    `;

    const Message = styled.h3`
    
    `;

    const Indicator = styled.div`
      border-radius: 50%;
      background-color: ${props => props.live ? 'green' : 'black'};
    
      animation: ${props => (props.progress ? css`${Blinking} 1s linear infinite` : '')};

      grid-column: 12 / 20;
      grid-row: 15 / 20;
    `;

    const Title = styled.h1`
      grid-column: 30 / 50;
      grid-row: 10 / 30;
    `;

    const Dashboard = styled.div`
      height: 100vh;
      display: grid;
      grid-template-rows: repeat(100, 1fr);
      grid-template-columns: repeat(100, 1fr);
    `;

    const PortGen = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 6 / 28;
      grid-row: 70 / 95;

      font-size: 2rem;
      color: wheat;

      display: grid;
      grid-template-rows: repeat(100, 1fr);
      grid-template-columns: repeat(100, 1fr);
    `;

    const PortBreaker = styled.div`
      grid-column: 17 / 19;
      grid-row: 35 / 50;  
      background-color: ${props => props.live ? 'green' : 'black'};
      transform: ${props => props.live ? 'rotate(0deg)' : 'rotate(90deg)'};
    `;

    const PortFeeder = styled.div`
      grid-column: 17 / 19;
      grid-row: 50 / 70;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const PortBusDrop = styled.div`
      grid-column: 17 / 19;
      grid-row: 13 / 35;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const STBDGen = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 34 / 55;
      grid-row: 70 / 95;

      font-size: 2rem;
      color: wheat;

      display: grid;
      grid-template-rows: repeat(100, 1fr);
      grid-template-columns: repeat(100, 1fr);
    `;

    const STBDBreaker = styled.div`
      grid-column: 44 / 46;
      grid-row: 35 / 50;  
      background-color: ${props => props.live ? 'green' : 'black'};
      transform: ${props => props.live ? 'rotate(0deg)' : 'rotate(90deg)'};
    `;

    const STBDFeeder = styled.div`
      grid-column: 44 / 46;
      grid-row: 50 / 70;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const STBDBusDrop = styled.div`
      grid-column: 44 / 46;
      grid-row: 10 / 35;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const Shore = styled.div`
      background-color: rgba(0, 0, 0, 0.6);
      box-shadow: 1px 1px 1px wheat;
      border-radius: 20px;
      grid-column: 60 / 84;
      grid-row: 70 / 95;
      animation-duration: 2s;

      font-size: 2rem;
      color: wheat;

      display: grid;
      grid-template-rows: repeat(100, 1fr);
      grid-template-columns: repeat(100, 1fr);
    `;

    const ShoreBreaker = styled.div`
      grid-column: 70 / 72;
      grid-row: 36 / 50;  
      background-color: ${props => props.live ? 'green' : 'black'};
      transform: ${props => props.live ? 'rotate(0deg)' : 'rotate(90deg)'};
    `;

    const ShoreFeeder = styled.div`
      grid-column: 70 / 72;
      grid-row: 50 / 70;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const ShoreBusDrop = styled.div`
      grid-column: 70 / 72;
      grid-row: 10 / 36;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;

    const MainBus = styled.div`
      grid-column: 10 / 90;
      grid-row: 8 / 13;
      background-color: ${props => props.live ? 'green' : 'black'};
    `;


export default Seamless;
