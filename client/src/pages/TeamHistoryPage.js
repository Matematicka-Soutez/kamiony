import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { API_ADDRESS } from '../config'
import TeamHistoryGraph from '../components/TeamHistoryGraph'

const rootStyle = {
  margin: '16px 8px 8px 8px',
  overflowX: 'none',
  paddingTop: 16,
  paddingBottom: 0,
}

class TeamHistoryPage extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.state = {
      gameCode: params.gameCode,
      teamId: params.teamId,
      history: null,
      team: null,
    }
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/teams/${
        this.state.teamId
      }/history`
    )
    const data = await res.json()
    if (data.message) {
      alert(data.message)
    }
    this.setState({
      history: data.history,
      team: data.team,
    })
  }

  render() {
    const { history, team } = this.state
    if (!history || !team) {
      return <div>Loading ...</div>
    }
    return (
      <Paper style={rootStyle}>
        <Typography
          variant="headline"
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          {team.name}
        </Typography>
        <Typography component="div">
          <TeamHistoryGraph history={history} team={team} />
        </Typography>
      </Paper>
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
