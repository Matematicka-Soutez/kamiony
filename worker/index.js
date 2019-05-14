'use strict'

const schedule = require('node-schedule')
const log = require('../core/logger').workerLogger
const config = require('../server/config')
const SimulateProductionService = require('./SimulateProduction')

function init() {
  const job = async invoked => {
    log.info(`Game of trust evaluation started ${invoked}/${new Date()}`)
    try {
      const result = await new SimulateProductionService({}).execute({ gameCode: 'maso25' })
      // eslint-disable-next-line no-console
      console.log(result)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
    log.info(`Game of trust evaluation ended ${new Date()}`)
  }

  schedule.scheduleJob(`*/${config.game.evaluationPeriodSeconds} * * * * *`, job)
}

init()
