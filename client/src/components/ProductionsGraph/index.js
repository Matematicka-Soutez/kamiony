/* eslint-disable react/no-string-refs */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import Highcharts from 'highcharts'
import ReactHighcharts from 'react-highcharts'

class ProductionsGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productions: props.productions,
    }
  }

  componentWillUnmount() {
    if (this.refs.chart && this.refs.chart.destroy) {
      this.refs.chart.destroy()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productions) {
      this.setState({ productions: nextProps.productions })
    }
  }

  render() {
    const graphConfig = {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Produkce',
      },
      subtitle: {
        text: 'V jednotlivych mestech',
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          // don't display the dummy year
          month: '%e. %b',
          year: '%b',
        },
        title: {
          text: 'Date',
        },
      },
      yAxis: {
        title: {
          text: 'Snow depth (m)',
        },
        min: 0,
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m',
      },

      plotOptions: {
        spline: {
          marker: {
            enabled: true,
          },
        },
      },

      // Define the data points. All series have a dummy year
      // of 1970/71 in order to be compared on the same x axis. Note
      // that in JavaScript, months start at 0 for January, 1 for February etc.
      series: this.state.productions,
    }
    return <ReactHighcharts config={graphConfig} ref="chart" />
  }
}

ProductionsGraph.propTypes = {
  productions: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ProductionsGraph
