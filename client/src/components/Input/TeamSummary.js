import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { styled } from '@material-ui/styles'

const StyledPaper = styled(Paper)({
  float: 'right',
  width: '30%',
  padding: 16,
})
const NarrowTableCell = styled(TableCell)({
  padding: '20px 8px 4px !important',
})
const EmphasizedNarrowTableCell = styled(TableCell)({
  padding: '4px 8px',
  fontSize: 25,
  fontWeight: 'bold',
})

function TeamSummary({ balance, goodsVolume, petrolVolume, cityName }) {
  return (
    <StyledPaper elevation={2}>
      <Typography variant="h5">Informace</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <NarrowTableCell>Město</NarrowTableCell>
            <NarrowTableCell>MaSo (Kg)</NarrowTableCell>
            <NarrowTableCell>Benzín (l)</NarrowTableCell>
            <NarrowTableCell>Peníze</NarrowTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <EmphasizedNarrowTableCell>
              {cityName.charAt(0)}
              {cityName.charAt(1) === 'h' && 'h'}
            </EmphasizedNarrowTableCell>
            <EmphasizedNarrowTableCell>{goodsVolume}</EmphasizedNarrowTableCell>
            <EmphasizedNarrowTableCell>
              {petrolVolume}
            </EmphasizedNarrowTableCell>
            <EmphasizedNarrowTableCell>{balance}</EmphasizedNarrowTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledPaper>
  )
}

TeamSummary.propTypes = {
  balance: PropTypes.number.isRequired,
  cityName: PropTypes.string.isRequired,
  goodsVolume: PropTypes.number.isRequired,
  petrolVolume: PropTypes.number.isRequired,
}

export default TeamSummary
