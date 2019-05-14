import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API_ADDRESS } from '../config'
import TeamHistoryGraph from '../components/TeamHistoryGraph'

class TeamHistoryPage extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.state = {
      gameCode: params.gameCode,
      teamId: params.teamId,
      teamHistory: null,
    }
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/teams/${
        this.state.teamId
      }/history`
    )
    const teamHistory = await res.json()
    if (teamHistory.message) {
      alert(teamHistory.message)
    }
    this.setState({ teamHistory })
  }

  render() {
    const { teamHistory, teamId } = this.state
    if (!teamHistory) {
      return <div>Loading ...</div>
    }
    return (
      <div>
        <h1>Team {teamId}</h1>
        <TeamHistoryGraph teamHistory={teamHistory} teamId={teamId} />
      </div>
    )
  }
}

TeamHistoryPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameCode: PropTypes.string,
      teamId: PropTypes.string,
    }),
  }).isRequired,
}

export default TeamHistoryPage
