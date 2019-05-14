const assign = require('lodash/assign')

/**
 * HOW TO USE
 *
 * enums.ROLES.ids[roleId].name
 *
 * enums.ROLES.ADMIN.name
 * enums.ROLES.ADMIN.id
 *
 * for (const key in enum.ROLES) {
 *     console.log(enum.ROLES[key]);
 * } OR USE LODASH
 *
 * @param {Object} enumDefinition Enum definition
 * @returns {*}
 */
function enumize(enumDefinition) {
  const byId = {}
  const idsAsEnum = []
  for (const key in enumDefinition) {
    if (enumDefinition.hasOwnProperty(key)) {
      const temp = assign({}, enumDefinition[key])
      delete temp.id
      temp.key = key
      idsAsEnum.push(enumDefinition[key].id)
      byId[enumDefinition[key].id] = temp
    }
  }
  enumDefinition.ids = byId
  enumDefinition.idsAsEnum = idsAsEnum
  return enumDefinition
}

const RANGE_COEFFICIENTS = enumize({
  BASIC: { id: 1, name: 'basic', value: 1 },
  MEDIUM: { id: 2, name: 'medium', value: 1.5 },
  BIG: { id: 3, name: 'big', value: 2 },
})

const CAPACITIES = enumize({
  BASIC: { id: 1, name: 'basic', value: 10 },
  MEDIUM: { id: 2, name: 'medium', value: 20 },
  BIG: { id: 3, name: 'big', value: 30 },
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
  SELL: { id: 1, name: 'Prodej' },
  PURCHASE: { id: 2, name: 'Nakup' },
  UPGRADE_CAPACITY: { id: 3, name: 'Kapacita' },
  UPGRADE_RANGE: { id: 4, name: 'Dojezd' },
  MOVE: { id: 5, name: 'Přesun' },
})

module.exports = {
  ACTIONS,
  RANGE_COEFFICIENTS,
  CAPACITIES,
  CITIES,
}
