import React from 'react'
import PropTypes from 'prop-types'
import City from './City'
import Connection from './Connection'
import Outline from './Outline'

function DistancesMap({ map, prices }) {
  const { cities, connections } = map
  return (
    <svg width="1100" height="700">
      <Outline />
      {connections.map(connection => (
        <Connection
          key={connection.id}
          data={connection}
          start={cities.find(city => city.id === connection.cities[0])}
          end={cities.find(city => city.id === connection.cities[1])}
          showLength
        />
      ))}
      {cities.map(city => (
        <City key={city.id} data={city} price={prices[city.id]} showCityName />
      ))}
    </svg>
  )
}

DistancesMap.propTypes = {
  map: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
}

export default DistancesMap
