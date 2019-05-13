'use strict'

module.exports = {
  hostname: 'https://maso23.herokuapp.com',
  database: {
    options: {
      logging: true,
    },
    connectionString: process.env.DATABASE_URL,
  },
}
