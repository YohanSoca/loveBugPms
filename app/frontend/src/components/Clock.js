import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const Clock = () => {
  const [time, setTime] = useState(``);

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toISOString())
    }, 1000)
  }, [])

  return (
    <Screen>
      <h5>{ time }</h5>
    </Screen>
  );
}

const Screen = styled.div`
  color: wheat;
  padding: 20px;
  text-align: center;
`;

export default Clock;
