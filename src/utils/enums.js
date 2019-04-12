'use strict'

const enumize = require('../../core/enumize')

const RANGE_COEFFICIENTS = enumize({
  BASIC: { id: 1, name: 'basic', value: 1, price: 0 },
  MEDIUM: { id: 2, name: 'medium', value: 1.5, price: 500 },
  BIG: { id: 3, name: 'big', value: 2, price: 800 },
})

const CAPACITIES = enumize({
  BASIC: { id: 1, name: 'basic', value: 10, price: 0 },
  MEDIUM: { id: 2, name: 'medium', value: 20, price: 400 },
  BIG: { id: 3, name: 'big', value: 30, price: 700 },
})

const CITIES = enumize({
  CHEB: { id: 1, name: 'Cheb' },
  PRAHA: { id: 2, name: 'Praha' },
  CESKE_BUDEJOVICE: { id: 3, name: 'České Budějovice' },
  OSTRAVA: { id: 4, name: 'Ostrava' },
  ZLIN: { id: 5, name: 'Zlín' },
  SUMPERK: { id: 6, name: 'Šumperk' },
  TRUTNOV: { id: 7, name: 'Trutnov' },
  LIBEREC: { id: 8, name: 'Liberec' },
  USTI: { id: 9, name: 'Ústí nad Labem' },
  KLATOVY: { id: 10, name: 'Klatovy' },
  JIHLAVA: { id: 11, name: 'Jihlava' },
  BRNO: { id: 12, name: 'Brno' },
})

const ACTIONS = enumize({
  SELL: { id: 1, name: 'sell' },
  PURCHASE: { id: 2, name: 'purchase' },
  UPGRADE_CAPACITY: { id: 3, name: 'upgrade capacity' },
  UPGRADE_RANGE: { id: 4, name: 'upgrade range' },
  MOVE: { id: 5, name: 'move to different city' },
})

module.exports = {
  ACTIONS,
  RANGE_COEFFICIENTS,
  CAPACITIES,
  CITIES,
}
