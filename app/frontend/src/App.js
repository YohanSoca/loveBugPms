import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Alarms from "./components/Alarms";
import Asea from './components/Asea';
import STBD from './components/STBD';
import Seamless from './components/Seamless';
import Port from './components/Port';
import Header from "./components/Header";
import Tanks from './components/Tanks';
import Ventilation from './components/Ventilation';
import styled from "styled-components";
  
function App() {
  return (
    <Screen>
      <Router>
      <Header />
        <Dashboard>
        <Routes>
            <Route path="/asea" element={<Asea />} />
            <Route path="/port" element={<Port />} />
            <Route path="/stbd" element={<STBD />} />
            <Route path="/alarms" element={<Alarms />} />
            <Route path="/seamless" element={<Seamless />} />
            <Route path="/ventilation" element={<Ventilation />} />
            <Route path="/tanks" element={<Tanks />} />
        </Routes>
        </Dashboard>
      </Router>
    </Screen>
  );
}

const Screen = styled.div`
  display: flex;
`;

const Dashboard = styled.div`
  flex: 1;
`;

export default App;
