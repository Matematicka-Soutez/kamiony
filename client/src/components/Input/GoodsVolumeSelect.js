/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { styled } from '@material-ui/styles'
import sc, { css } from 'styled-components'
import { ACTIONS } from '../../utils/enums'

const Form = sc.form`
  z-index: 1;
  width: 15%;
  ${props =>
    props.actionId === ACTIONS.SELL.id
      ? css`
          position: relative;
          float: left;
        `
      : css`
          position: absolute;
          bottom: 16px;
          left: 20px;
        `}
`
const styledBy = (property, mapping) => props => mapping[props[property]]
const actionIdColor = styledBy('actionId', {
  [ACTIONS.SELL.id]: '#8BC34A',
  [ACTIONS.PURCHASE.id]: '#FF5722',
})
// eslint-disable-next-line no-unused-vars
const TradeButton = styled(({ actionId, ...other }) => <Button {...other} />)({
  background: actionIdColor,
  '&:hover': {
    background: actionIdColor,
    filter: 'brightness(85%)',
  },
})

function GoodsVolumeSelect({ maxVolume, actionId, handleTrade }) {
  const button = (
    <TradeButton
      variant="contained"
      color="primary"
      size="large"
      type="submit"
      actionId={actionId}
    >
      {ACTIONS.ids[actionId].name}
    </TradeButton>
  )
  return (
    <Form
      noValidate
      autoComplete="off"
      actionId={actionId}
      onSubmit={e => handleTrade(actionId, e)}
    >
      {actionId === ACTIONS.PURCHASE.id && <div>{button}</div>}
      <TextField
        id={`${actionId}`}
        key={`${actionId}${maxVolume}`}
        label={'Kg MaSa'}
        defaultValue={maxVolume}
        margin="normal"
        variant="outlined"
        type="number"
        inputProps={{
          min: 0,
          max: maxVolume,
          style: { width: '200px' },
        }}
      />
      {actionId === ACTIONS.SELL.id && <div>{button}</div>}
    </Form>
  )
}

GoodsVolumeSelect.propTypes = {
  handleTrade: PropTypes.func.isRequired,
  maxVolume: PropTypes.number.isRequired,
  actionId: PropTypes.number.isRequired,
}

export default GoodsVolumeSelect
