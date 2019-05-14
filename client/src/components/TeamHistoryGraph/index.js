/* eslint-disable react/no-string-refs */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import Highcharts from 'highcharts'
import ReactHighcharts from 'react-highcharts'

class TeamHistoryGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      teamHistory: props.teamHistory,
      teamId: props.teamId,
    }
  }

  componentWillUnmount() {
    if (this.refs.chart && this.refs.chart.destroy) {
      this.refs.chart.destroy()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teamHistory) {
      this.setState({ teamHistory: nextProps.teamHistory })
    }
    if (nextProps.teamId) {
      this.setState({ teamId: nextProps.teamId })
    }
  }

  render() {
    const graphConfig = {
      chart: {
        type: 'area',
      },
      title: {
        text:
          '<p style="font-size: 35px">Tým číslo </p>' +
          this.state.teamId.toString(),
      },
      subtitle: {
        text: 'Vývoj během hry',
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e. %b',
          week: '%e. %b',
          month: "%b '%y",
          year: '%Y',
        },
        title: {
          text: 'Time',
        },
      },
      yAxis: [
        {
          title: { text: 'Balance' },
          max:
            Math.ceil(
              Math.max(
                ...this.state.teamHistory.map(function(o) {
                  return o.balance
                })
              ) / 300
            ) * 300,
          labels: { format: '{value}' },
        },
        {
          title: { text: 'Volume' },
          labels: { format: '{value} units' },
        },
      ],
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.x:%H:%M:%S %L} ms</b><br>',
        pointFormat: '{series.name}: {point.y:.2f} ',
      },

      plotOptions: {
        area: {
          fillOpacity: 0.1,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },

      //colors: ['yellow', 'green', 'red', '#036', '#000'],

      // Define the data points. All series have a dummy year
      // of 1970/71 in order to be compared on the same x axis. Note
      // that in JavaScript, months start at 0 for January, 1 for February etc.
      series: [
        {
          name: 'Team goods',
          yAxis: 1,
          data: this.state.teamHistory.map(record => [
            new Date(record.createdAt).getTime(),
            record.goodsVolume,
          ]),
        },
        {
          name: 'Team petrol',
          yAxis: 1,
          data: this.state.teamHistory.map(record => [
            new Date(record.createdAt).getTime(),
            record.petrolVolume,
          ]),
        },
        {
          name: 'Team balance',
          data: this.state.teamHistory.map(record => [
            new Date(record.createdAt).getTime(),
            record.balance,
          ]),
        },
      ],
    }
    return <ReactHighcharts config={graphConfig} ref="chart" />
  }
}

TeamHistoryGraph.propTypes = {
  teamHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamId: PropTypes.number.isRequired,
}

export default TeamHistoryGraph
