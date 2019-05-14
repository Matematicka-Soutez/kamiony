import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import sc from 'styled-components'
import masoLogo from '../../maso_logo.png'
import firestore from './../../api/firestore'
import SimpleMap from '../../components/GameMap/SimpleMap'
import { API_ADDRESS } from '../../config'
import Timer from './components/Timer'

const Header = sc.header`
  height: 90px;
  padding: 0;
  margin: 0;
`

const Logo = sc.div`
  position: absolute;
  top: 20px;
  right: 20px;
`

class GameContainer extends Component {
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
      timer: null,
    }
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/timer`
    )
    const timer = await res.json()
    this.setState({ timer })
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
        `Game Screen - no map document: ${JSON.stringify(this.state)}`
      )
    }
  }

  onPricesUpdate = doc => {
    if (doc.exists) {
      this.setState({ prices: doc.data() })
    } else {
      throw new Error(
        `Game Screen - no prices document: ${JSON.stringify(this.state)}`
      )
    }
  }

  render() {
    const { map, prices, timer } = this.state
    if (!map || !timer || !prices) {
      return <div>Loading ...</div>
    }
    return (
      <Fragment>
        <Logo>
          <Link to={`/hra/${this.state.gameCode}/admin`}>
            <img src={masoLogo} alt="logo" style={{ width: '170px' }} />
          </Link>
        </Logo>
        <Header>
          <Timer start={this.state.timer.start} end={this.state.timer.end} />
        </Header>

        <main style={{ textAlign: 'center' }}>
          {map && <SimpleMap map={map} prices={prices} />}
        </main>
      </Fragment>
    )
  }
}

GameContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameCode: PropTypes.string,
    }),
  }).isRequired,
}

export default GameContainer
