import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";

import Clock from './Clock';
import Logo from './Logo';

const Header = () => {
    const linkStyle = {
            textDecoration: 'none',
            color: 'wheat',
            fontSize: '150%',
            padding: '20px'
        };
  return (
   <SideBar>
     <img src='https://nauti-tech.com/sites/default/files/inline-images/logo-dark.png' width={'150px'}/>
       <Nav>
            <Link style={linkStyle} to="/asea">ASEA</Link>
            <Link style={linkStyle} to="/port">PORT</Link>
            <Link style={linkStyle} to="/stbd">STBD</Link>
            <Link style={linkStyle} to="/alarms">ALARM</Link>
            <Link style={linkStyle} to="/seamless">PMS</Link>
            <Link style={linkStyle} to="/ventilation">FANS</Link>
       </Nav>
       <Clock />
   </SideBar>
  )
}

const SideBar = styled.div`
    background-color: black;
    width: calc(100vw / 8);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;



export default Header;
