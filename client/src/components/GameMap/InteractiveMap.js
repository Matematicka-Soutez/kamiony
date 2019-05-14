import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sc from 'styled-components'
import City from './City'
import Connection from './Connection'
import Outline from './Outline'
import { emptyPath, getShortestPath } from './utils'

const PositionedSVG = sc.svg`
  position: absolute;
  bottom: 20px;
  left: 20px;
`

class InteractiveMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: emptyPath(),
    }
  }

  onCityFocus = cityId => {
    return e => {
      e.preventDefault()
      this.setState({
        path: getShortestPath(this.props.map, this.props.teamCityId, cityId),
      })
    }
  }

  onCityFocusLost = e => {
    e.preventDefault()
    this.setState({ path: emptyPath() })
  }

  render() {
    const {
      teamCityId,
      teamRange,
      map: { cities, connections },
      prices,
    } = this.props
    const isAffordable = teamRange >= this.state.path.length
    return (
      <PositionedSVG width="1100" height="640">
        <text x="0" y="110">
          Délka cesty: {this.state.path.length}
        </text>
        <Outline />
        {connections.map(connection => (
          <Connection
            key={connection.id}
            data={connection}
            start={cities.find(city => city.id === connection.cities[0])}
            end={cities.find(city => city.id === connection.cities[1])}
            isOnConnection={this.state.path.connections.includes(connection.id)}
            isAffordable={isAffordable}
          />
        ))}
        {cities.map(city => (
          <City
            key={city.id}
            data={city}
            price={prices[city.id]}
            onFocus={this.onCityFocus(city.id)}
            onFocusLost={this.onCityFocusLost}
            onClick={() => this.props.onCityClick(city.id)}
            isCurrentPosition={teamCityId === city.id}
            isOnConnection={this.state.path.cities.includes(city.id)}
            isAffordable={isAffordable}
            bigCity
          />
        ))}
      </PositionedSVG>
    )
  }
}

InteractiveMap.propTypes = {
  map: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  teamCityId: PropTypes.number.isRequired,
  teamRange: PropTypes.number.isRequired,
  onCityClick: PropTypes.func.isRequired,
}

export default InteractiveMap
