import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firestore from '../api/firestore'
import DistancesMap from '../components/GameMap/DistancesMap'

class DistancesPage extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.map = firestore.collection('maps').doc(params.gameCode)
    this.prices = firestore.collection('prices').doc(params.gameCode)
    this.state = {
      gameCode: params.gameCode,
      map: null,
      prices: null,
    }
  }

  componentDidMount() {
    this.mapUnsubscribe = this.map.onSnapshot(this.onMapUpdate)
    this.pricesUnsubscribe = this.prices.onSnapshot(this.onPricesUpdate)
  }

  componentWillUnmount() {
    this.mapUnsubscribe()
    this.pricesUnsubscribe()
  }

  onMapUpdate = doc => {
    if (doc.exists) {
      this.setState({ map: doc.data() })
    } else {
      throw new Error(
        `Distance Page - no map document: ${JSON.stringify(this.state)}`
      )
    }
  }

  onPricesUpdate = doc => {
    if (doc.exists) {
      this.setState({ prices: doc.data() })
    } else {
      throw new Error(
        `Distance Page - no prices document: ${JSON.stringify(this.state)}`
      )
    }
  }

  render() {
    const { map, prices } = this.state
    if (!map || !prices) {
      return <div>Loading ...</div>
    }
    return (
      <div>
        <h1>Mapa vzdáleností</h1>
        {map && <DistancesMap map={map} prices={prices} />}
      </div>
    )
  }
}

DistancesPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameCode: PropTypes.string,
    }),
  }).isRequired,
}

export default DistancesPage
