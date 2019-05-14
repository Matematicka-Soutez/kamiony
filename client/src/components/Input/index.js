/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/styles'
import sc from 'styled-components'
import firestore from '../../api/firestore'
import api from '../../api'
import enums from '../../utils/enums'
import InteractiveMap from '../GameMap/InteractiveMap'
import TeamSummary from './TeamSummary'
import GoodsVolumeSelect from './GoodsVolumeSelect'
import UpgradeSelect from './UpgradeSelect'

const PaddedTeamInput = sc.div`
  padding: 16px;
`
const TeamName = sc.h1`
  margin: 10pt 0;
  text-align: center;
  width: 55%;
  float: left;
`

const RevertButton = styled(Button)({
  float: 'right',
  clear: 'right',
  marginTop: '16px',
})

const initialState = {
  map: null,
  prices: null,
  team: null,
  cityId: enums.CITIES.PRAHA.id,
  capacityId: enums.CAPACITIES.BASIC.id,
  rangeCoefficientId: enums.RANGE_COEFFICIENTS.BASIC.id,
  goodsVolume: enums.CAPACITIES.BASIC.value,
  petrolVolume: 0,
  balance: 0,
}

class Input extends Component {
  constructor(props) {
    super(props)
    this.map = firestore.collection('maps').doc(props.gameCode)
    this.prices = firestore.collection('prices').doc(props.gameCode)
    this.teamState = firestore
      .collection('teams')
      .doc(`${props.gameCode}-${props.teamId}`)
    this.state = initialState
  }

  componentDidMount() {
    this.mapUnsubscribe = this.map.onSnapshot(this.onMapUpdate)
    this.priceUnsubscribe = this.prices.onSnapshot(this.onPricesUpdate)
    this.teamStateUnsubscribe = this.teamState.onSnapshot(
      this.onTeamStateUpdate
    )
  }

  componentWillUnmount() {
    this.mapUnsubscribe()
    this.priceUnsubscribe()
    this.teamStateUnsubscribe()
  }

  onMapUpdate = doc => {
    if (doc.exists) {
      this.setState({ map: doc.data() })
    } else {
      throw new Error(
        `Game Input - no map document: ${JSON.stringify(this.state)}`
      )
    }
  }

  onPricesUpdate = doc => {
    if (doc.exists) {
      this.setState({ prices: doc.data() })
    } else {
      throw new Error(
        `Game Input - no map document: ${JSON.stringify(this.state)}`
      )
    }
  }

  onTeamStateUpdate = doc => {
    if (doc.exists) {
      this.setState(doc.data())
    } else {
      throw new Error(
        `Game Input - no team document: ${JSON.stringify(this.state)}`
      )
    }
  }

  handleUpgradeChange = (actionId, actionValue) => {
    return api.performAction({
      accessToken: this.props.accessToken,
      gameCode: this.props.gameCode,
      teamId: this.props.teamId,
      actionId,
      actionValue,
    })
  }

  handleTrade = (actionId, e) => {
    e.preventDefault()
    return api.performAction({
      accessToken: this.props.accessToken,
      gameCode: this.props.gameCode,
      teamId: this.props.teamId,
      actionId,
      actionValue: parseInt(e.target[actionId].value),
    })
  }

  moveTeam = cityId => {
    return api.performAction({
      accessToken: this.props.accessToken,
      gameCode: this.props.gameCode,
      teamId: this.props.teamId,
      actionId: enums.ACTIONS.MOVE.id,
      actionValue: cityId,
    })
  }

  revertLastAction = () => {
    return api.revertLastAction({
      accessToken: this.props.accessToken,
      gameCode: this.props.gameCode,
      teamId: this.props.teamId,
    })
  }

  render() {
    const { team, map, prices } = this.state
    if (!team || !map || !prices) {
      return <PaddedTeamInput>Loading data ...</PaddedTeamInput>
    }

    const { balance, capacityId, goodsVolume, cityId } = this.state
    const city = map.cities.find(item => item.id === cityId) || {
      name: 'Not found',
    }
    const purchasePrice = prices[cityId].purchase || 1000
    const affordableVolume = Math.floor(balance / purchasePrice)
    const purchaseVolume = Math.min(
      enums.CAPACITIES.ids[capacityId].value - goodsVolume,
      affordableVolume
    )

    return (
      <PaddedTeamInput>
        <GoodsVolumeSelect
          handleTrade={this.handleTrade}
          actionId={enums.ACTIONS.SELL.id}
          maxVolume={goodsVolume}
        />
        <TeamName>
          {this.state.team.number} - {this.state.team.name}
        </TeamName>
        <TeamSummary
          balance={this.state.balance}
          goodsVolume={this.state.goodsVolume}
          cityName={city.name}
          petrolVolume={this.state.petrolVolume}
        />
        <RevertButton
          variant="contained"
          color="secondary"
          onClick={this.revertLastAction}
        >
          Vrátit změnu
        </RevertButton>
        <InteractiveMap
          map={this.state.map}
          prices={this.state.prices}
          teamCityId={this.state.cityId}
          teamRange={this.state.petrolVolume}
          onCityClick={this.moveTeam}
        />
        <GoodsVolumeSelect
          handleTrade={this.handleTrade}
          actionId={enums.ACTIONS.PURCHASE.id}
          maxVolume={purchaseVolume}
        />
        <UpgradeSelect
          upgrades={[
            {
              enum: enums.CAPACITIES,
              actionId: enums.ACTIONS.UPGRADE_CAPACITY.id,
              id: this.state.capacityId,
            },
            {
              enum: enums.RANGE_COEFFICIENTS,
              actionId: enums.ACTIONS.UPGRADE_RANGE.id,
              id: this.state.rangeCoefficientId,
            },
          ]}
          onClickHandle={this.handleUpgradeChange}
        />
      </PaddedTeamInput>
    )
  }
}

Input.propTypes = {
  accessToken: PropTypes.string.isRequired,
  gameCode: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
}

export default Input
