/* eslint-disable no-console */
'use strict'

Promise = require('bluebird')
const config = require('../server/config')
const db = require('../server/database/index')
const initStatic = require('../tests/data/static')
const { createTeam } = require('../tests/data/generators')

const TEAM_NAMES = [
  'GYMLOVO',
  'GyVyMy',
  'Lobkovičák',
  'PORG Libeň',
  'GJ',
  'Měšťáci',
  'Áčka',
  'Truhla',
  'Vodovod',
  'GYKAS',
  'ZŠ Čechtice',
  'AlToJaTo',
  'Kněžmosťáci',
  'Bagri',
  'ŠimOn FilEl',
  'Borci z GVP',
  'BUM!',
  'Plzeňská patnáctka',
  'FXko',
  'ZŠ Gutova',
  'Smrtijedi',
  'Holátka',
  'OPEN GATE',
  'GFMP',
  'ZŠ Čechtice',
  'HAMALEMA',
  'Kněžmosťáci',
  'Bílá Třemešná',
  'Kebab',
  'Květákovo vojsko',
  'Krakatit',
  'Jílováci',
  'Švehlovka 1',
  'GEKOM 1',
  'Lobkovičák',
  'FZŠ Táborská',
  'Polabiny 1-1',
]

async function syncDb() {
  if (config.env === 'production' || config.env === 'staging') {
    throw new Error('!!! dbsync can\'t be run in production or staging !!!')
  }
  try {
    const force = config.env === 'local' || config.env === 'test'
    await db.sequelize.sync({ force })
    if (force === true) {
      const data = await initStatic()
      await initTeams(data.games[0].id)
      await db.sequelize.query(`
        UPDATE "Teams" SET number = id WHERE true;
        UPDATE "Teams" SET game_id = 1 WHERE true;
      `)
    }
    await db.sequelize.close()
    console.log('DB is synced.')
  } catch (err) {
    console.error(err)
    throw new Error('Dbsync failed')
  }
  return true
}

async function initTeams(gameId) {
  await Promise.map(TEAM_NAMES, (name, number) => createTeam({
    gameId,
    name,
    number: number + 1,
    arrived: true,
  }))
}

return syncDb()
