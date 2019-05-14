/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import sc from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/styles'
import { ACTIONS } from '../../utils/enums'

const UpgradeSet = sc.div`
  margin: 10pt 0 5pt;
`
const StyledPaper = styled(Paper)({
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: '22%',
  padding: 16,
})
const StyledButton = styled(Button)({
  margin: '0 10pt',
})

function UpgradeSelect({ upgrades, onClickHandle }) {
  return (
    <StyledPaper elevation={2}>
      <Typography variant="h5">Vylepšení</Typography>
      {upgrades.map(upgradeInfo => {
        const upgrade = upgradeInfo.enum.ids[upgradeInfo.id]
        return (
          <UpgradeSet key={upgradeInfo.actionId}>
            <Typography variant="caption" style={{ padding: '0 0 5pt 10pt' }}>
              {ACTIONS.ids[upgradeInfo.actionId].name}
            </Typography>
            {upgradeInfo.enum.idsAsEnum.map(enumId => {
              const variant =
                enumId === upgradeInfo.id ? 'contained' : 'outlined'
              return (
                <StyledButton
                  key={`${upgrade.id}-${enumId}`}
                  variant={variant}
                  color="primary"
                  size="large"
                  onClick={() => onClickHandle(upgradeInfo.actionId, enumId)}
                >
                  {upgradeInfo.enum.ids[enumId].value}
                </StyledButton>
              )
            })}
          </UpgradeSet>
        )
      })}
    </StyledPaper>
  )
}

UpgradeSelect.propTypes = {
  upgrades: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickHandle: PropTypes.func.isRequired,
}

export default UpgradeSelect
