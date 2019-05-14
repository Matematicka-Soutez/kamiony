import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import Input from '../../components/Input'

const styles = theme => ({
  tabRoot: {
    marginRight: theme.spacing.unit,
  },
  typography: {
    padding: Number(theme.spacing.unit),
  },
})

class GroupInputContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      teams: props.teams,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teams && nextProps.teams.length > 0) {
      this.setState({ teams: nextProps.teams, value: 0 })
    }
  }

  handleChange = (e, value) => {
    this.setState({ value })
  }

  render() {
    const { value, teams } = this.state
    if (!teams || teams.length === 0) {
      return <div>No teams in venue</div>
    }
    const tabs = teams.map(team => (
      <Tab label={team.number} key={team.id} style={{ minWidth: 90 }} />
    ))
    return (
      <div className="teamSelect">
        <AppBar position="static" color="default">
          <Tabs value={value} onChange={this.handleChange}>
            {tabs}
          </Tabs>
        </AppBar>
        <Input
          teamId={teams[value].id}
          key={teams[value].id}
          accessToken={this.props.accessToken}
          gameCode={this.props.gameCode}
        />
      </div>
    )
  }
}

GroupInputContainer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  gameCode: PropTypes.string.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withStyles(styles)(GroupInputContainer)
