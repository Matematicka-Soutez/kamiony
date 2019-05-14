import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { API_ADDRESS } from '../../config'
import GroupInputContainer from './GroupInputContainer'

class InputContainer extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.state = {
      accessToken: params.accessToken,
      gameCode: params.gameCode,
      value: 0,
      evenTeams: true,
      tabs: null,
      teams: null,
    }
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/groups`
    )
    const groups = await res.json()
    const tabs = []
    const teams = []
    // eslint-disable-next-line guard-for-in
    for (const groupName in groups) {
      tabs.push(<Tab label={groupName} key={groupName} />)
      teams.push(groups[groupName])
    }
    this.setState({
      tabs,
      teams,
    })
  }

  handleChange = (e, value) => {
    this.setState({ value })
  }

  handleSwitch = e => {
    this.setState({ evenTeams: e.target.checked })
  }

  render() {
    const { value, tabs, teams } = this.state
    if (!tabs || !teams) {
      return <div>Loading ...</div>
    }
    return (
      <div className="venueSelect">
        <Grid container spacing={24}>
          <Grid item xs={10} sm={11}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                {tabs}
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item xs={2} sm={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.evenTeams}
                  onChange={this.handleSwitch}
                  value="evenRooms"
                  color="primary"
                />
              }
              label="Sudé"
            />
          </Grid>
        </Grid>
        <GroupInputContainer
          teams={teams[value].filter(
            team =>
              teams[value].length < 14 ||
              (team.number % 2 === 0) === this.state.evenTeams
          )}
          accessToken={this.state.accessToken}
          gameCode={this.state.gameCode}
        />
      </div>
    )
  }
}

InputContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      accessToken: PropTypes.string,
      gameCode: PropTypes.string,
    }),
  }).isRequired,
}

export default InputContainer
