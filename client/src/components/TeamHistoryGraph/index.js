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
      history: props.history,
      team: props.team,
    }
  }

  componentWillUnmount() {
    if (this.refs.chart && this.refs.chart.destroy) {
      this.refs.chart.destroy()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history) {
      this.setState({ history: nextProps.history })
    }
    if (nextProps.team) {
      this.setState({ team: nextProps.team })
    }
  }

  render() {
    const { history, team } = this.state
    if (!history || !team) {
      return <div>Loading ...</div>
    }
    const graphConfig = {
      chart: {
        type: 'area',
      },
      title: {
        text: team.school,
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
          title: { text: 'Peníze' },
          max:
            Math.ceil(
              Math.max(...this.state.history.map(o => o.balance)) / 300
            ) * 300,
          labels: { format: '{value}' },
        },
        {
          title: { text: 'Objem (l nebo kg)' },
          labels: { format: '{value}' },
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
          name: 'Objem MaSa',
          yAxis: 1,
          data: this.state.history.map(record => [
            new Date(record.createdAt).getTime(),
            record.goodsVolume,
          ]),
        },
        {
          name: 'Objem benzínu',
          yAxis: 1,
          data: this.state.history.map(record => [
            new Date(record.createdAt).getTime(),
            record.petrolVolume,
          ]),
        },
        {
          name: 'Peníze',
          data: this.state.history.map(record => [
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
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  team: PropTypes.object.isRequired,
}

export default TeamHistoryGraph
