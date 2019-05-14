import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledLine = styled.line`
  stroke: #bbb;
  stroke-width: 2;
  ${props =>
    props.isOnConnection &&
    css`
      stroke: ${props.isAffordable ? '#8BC34A' : '#FF5722'};
      stroke-width: 4;
    `}
`

const ConnectionLengthText = styled.text`
  font-size: 23pt;
  font-weight: bold;
`

function Connection({
  data,
  start,
  end,
  isOnConnection,
  isAffordable,
  showLength,
}) {
  return (
    <Fragment>
      <StyledLine
        x1={start.position.x}
        y1={start.position.y}
        x2={end.position.x}
        y2={end.position.y}
        isOnConnection={isOnConnection}
        isAffordable={isAffordable}
      />
      {showLength && (
        <ConnectionLengthText
          x={(start.position.x + end.position.x - 20) / 2}
          y={(start.position.y + end.position.y + 20) / 2}
        >
          {data.length}
        </ConnectionLengthText>
      )}
    </Fragment>
  )
}

Connection.propTypes = {
  data: PropTypes.object.isRequired,
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  isOnConnection: PropTypes.bool,
  isAffordable: PropTypes.bool,
  showLength: PropTypes.bool,
}

Connection.defaultProps = {
  isOnConnection: false,
  isAffordable: false,
  showLength: false,
}

export default Connection
