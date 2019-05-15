// TODO: split into container and component

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { API_ADDRESS } from '../../config'
import { subscribeToResultsChange } from '../../sockets/index'

const rootStyle = {
  margin: '16px 8px 8px 8px',
  overflowX: 'none',
  paddingTop: 16,
  paddingBottom: 0,
}

const smallColumnWidth = {
  padding: '4px 20px 4px 8px',
}

const smallPadding = {
  padding: '4px 20px 4px 8px',
}

class ResultsContainer extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.state = {
      gameCode: params.gameCode,
      results: null,
    }
    subscribeToResultsChange((err, newResults) => {
      if (err) {
        return
      }
      if (newResults && newResults !== {}) {
        this.setState({
          results: newResults,
        })
      }
    })
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/results`
    )
    const results = await res.json()
    this.setState({ results })
  }

  render() {
    const { results } = this.state
    if (!results) {
      return <div className="results">Loading ...</div>
    }

    let id = 0
    const createData = result => {
      id += 1
      return { ...result, id }
    }

    const data = []
    results.forEach(result => {
      data.push(createData(result))
    })
    return (
      <div className="results">
        <Paper style={rootStyle}>
          <Typography
            variant="headline"
            style={{ textAlign: 'center', marginBottom: 16 }}
          >
            Výsledky jarního MaSa 2019
          </Typography>
          <Typography component="div">
            <Table style={{ minWidth: 780 }}>
              <TableHead>
                <TableRow>
                  <TableCell numeric style={smallColumnWidth}>
                    Pořadí
                  </TableCell>
                  <TableCell numeric style={smallColumnWidth}>
                    Číslo týmu
                  </TableCell>
                  <TableCell style={smallPadding}>Název týmu</TableCell>
                  <TableCell style={smallPadding}>Škola</TableCell>
                  <TableCell style={smallColumnWidth}>Místo</TableCell>
                  <TableCell numeric style={{ ...smallPadding, minWidth: 80 }}>
                    Vyřešené příklady
                  </TableCell>
                  <TableCell numeric style={{ ...smallPadding, minWidth: 80 }}>
                    Výdělek
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell
                        numeric
                        component="th"
                        scope="row"
                        style={smallColumnWidth}
                      >
                        {row.place}
                      </TableCell>
                      <TableCell numeric style={smallColumnWidth}>
                        {row.teamNumber}
                      </TableCell>
                      <TableCell style={{ ...smallPadding, fontWeight: 'bold' }}>
                        <Link href={`/hra/${this.state.gameCode}/teams/${row.teamId}/history`}>
                        {row.teamName}
                        </Link>
                      </TableCell>
                      <TableCell style={smallPadding}>{row.school}</TableCell>
                      <TableCell style={smallColumnWidth}>{row.group}</TableCell>
                      <TableCell
                        numeric
                        style={{ ...smallPadding, minWidth: 50 }}
                      >
                        {row.solvedProblems}
                      </TableCell>
                      <TableCell
                        numeric
                        style={{ ...smallPadding, minWidth: 50 }}
                      >
                        {row.balance}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </Typography>
        </Paper>
      </div>
    )
  }
}

ResultsContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameCode: PropTypes.string,
    }),
  }).isRequired,
}

export default ResultsContainer
