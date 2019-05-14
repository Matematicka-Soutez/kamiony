/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledCircle = styled.circle`
  cursor: pointer;
  stroke: #333;
  stroke-width: 4;
  fill: ${props => (props.bigCity ? '#eee' : '#fff')};
  ${props =>
    (props.isOnConnection || props.isNextPosition) &&
    css`
      stroke: ${props.isAffordable ? '#8BC34A' : '#FF5722'};
    `}
  ${props =>
    props.isCurrentPosition &&
    css`
      stroke: #388e3c;
      fill: #388e3c;
    `}
`

const PriceText = styled.text`
  font-size: 32pt;
  font-weight: bold;
  color: ${props => (props.sell ? '#8BC34A' : '#FF5722')};
`

const CityText = styled.text`
  font-size: ${props => (props.showCityName ? '16pt' : '23pt')};
  fill: ${props => getCityTextColor(props)};
  font-weight: normal;
`

function getCityTextColor(props) {
  if (props.isCurrentPosition) {
    return '#388e3c'
  }
  if (props.isUnderMouse && props.isAffordable) {
    return '#8BC34A'
  }
  if (props.isUnderMouse && !props.isAffordable) {
    return '#FF5722'
  }
  return '#333'
}

class City extends Component {
  constructor(props) {
    super(props)
    this.state = { isUnderMouse: false }
  }

  onMouseEnter = e => {
    if (this.props.onFocus) {
      this.setState({ isUnderMouse: true })
      return this.props.onFocus(e)
    }
  }

  onMouseLeave = e => {
    if (this.props.onFocusLost) {
      this.setState({ isUnderMouse: false })
      return this.props.onFocusLost(e)
    }
  }

  render() {
    const {
      bigCity,
      data,
      price,
      isOnConnection,
      isAffordable,
      isCurrentPosition,
      showPrices,
      showCityName,
      onClick,
    } = this.props
    const { isUnderMouse } = this.state
    return (
      <Fragment>
        <StyledCircle
          r={bigCity ? '25' : '10'}
          cx={data.position.x}
          cy={data.position.y}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={e => {
            this.onMouseLeave(e)
            return onClick()
          }}
          isOnConnection={isOnConnection}
          isAffordable={isAffordable}
          isCurrentPosition={isCurrentPosition}
          bigCity={bigCity}
        />
        {showPrices && (
          <Fragment>
            <PriceText x={data.position.x - 70} y={data.position.y + 15} sell>
              {Math.round(price.sell)}
            </PriceText>
            <PriceText
              x={data.position.x + 20}
              y={data.position.y + 15}
              purchase
            >
              {Math.round(price.purchase)}
            </PriceText>
          </Fragment>
        )}
        {(isCurrentPosition || isUnderMouse || showCityName) && (
          <CityText
            x={data.position.x - data.name.length * 7}
            y={data.position.y - 40}
            isCurrentPosition={isCurrentPosition}
            isAffordable={isAffordable}
            isUnderMouse={isUnderMouse}
            showCityName={showCityName}
          >
            {data.name}
          </CityText>
        )}
      </Fragment>
    )
  }
}

City.propTypes = {
  bigCity: PropTypes.bool,
  data: PropTypes.object.isRequired,
  price: PropTypes.object.isRequired,
  onFocus: PropTypes.func,
  onFocusLost: PropTypes.func,
  onClick: PropTypes.func,
  isOnConnection: PropTypes.bool,
  isAffordable: PropTypes.bool,
  isCurrentPosition: PropTypes.bool,
  showPrices: PropTypes.bool,
  showCityName: PropTypes.bool,
}

City.defaultProps = {
  bigCity: false,
  onFocus: null,
  onFocusLost: null,
  onClick: null,
  isOnConnection: false,
  isAffordable: false,
  isCurrentPosition: false,
  showPrices: false,
  showCityName: false,
}

export default City
