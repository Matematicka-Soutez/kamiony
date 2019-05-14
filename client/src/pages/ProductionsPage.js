import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API_ADDRESS } from '../config'
import ProductionsGraph from '../components/ProductionsGraph'

class ProductionsPage extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = this.props
    this.state = {
      gameCode: params.gameCode,
      productions: null,
    }
  }

  async componentWillMount() {
    const res = await fetch(
      `${API_ADDRESS}/api/games/${this.state.gameCode}/productions`
    )
    const productions = await res.json()
    this.setState({ productions })
  }

  render() {
    const { productions } = this.state
    return (
      <div>
        <h1>Vyvoj produkce</h1>
        {!productions && <div>Loading ...</div>}
        {productions && <ProductionsGraph productions={productions} />}
      </div>
    )
  }
}

ProductionsPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameCode: PropTypes.string,
    }),
  }).isRequired,
}

export default ProductionsPage
