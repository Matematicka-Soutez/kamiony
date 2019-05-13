/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamHistory = sequelize.define('TeamHistory', {
    // id column is here just to pleasure sequelize
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'id' },
    gameId: { type: DataTypes.INTEGER, allowNull: false, field: 'game_id' },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id' },

    cityId: { type: DataTypes.INTEGER, allowNull: false, field: 'city_id' },
    capacityId: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity_id' },
    rangeCoefficientId: { type: DataTypes.INTEGER, allowNull: false, field: 'range_coefficient_id' },
    goodsVolume: { type: DataTypes.INTEGER, allowNull: false, field: 'goods_volume' },
    petrolVolume: { type: DataTypes.INTEGER, allowNull: false, field: 'petrol_volume' },
    balance: { type: DataTypes.INTEGER, allowNull: false, field: 'balance' },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'createdAt' },
  }, {
    tableName: 'TeamHistories',
    timestamps: false,
  })

  TeamHistory.associate = models => {
    TeamHistory.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamHistory.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
  }

  TeamHistory.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "TeamHistories" AS
        SELECT
              id                                                                                  AS id,
              game_id                                                                             AS game_id,
              team_id                                                                             AS team_id,
              city_id                                                                             AS city_id,
              MAX(capacity_id) OVER (PARTITION BY game_id, team_id ORDER BY "createdAt")          AS capacity_id,
              MAX(range_coefficient_id) OVER (PARTITION BY game_id, team_id ORDER BY "createdAt") AS range_coefficient_id,
              sum(goods_volume) OVER (PARTITION BY game_id, team_id ORDER BY "createdAt")         AS goods_volume,
              sum(petrol_volume) OVER (PARTITION BY game_id, team_id ORDER BY "createdAt")        AS petrol_volume,
              sum(balance) OVER (PARTITION BY game_id, team_id ORDER BY "createdAt")              AS balance,
              "createdAt"                                                                         AS "createdAt"
        FROM "TeamActions"
        WHERE NOT reverted
        ORDER BY "createdAt"
      `, { logging: options.logging })
    }
    return true
  }

  TeamHistory.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "TeamStates";',
        { logging: options.logging },
      )
    }
    return true
  }

  TeamHistory.create = () => {
    throw new Error('Can\'t create entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  TeamHistory.update = () => {
    throw new Error('Can\'t update entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  TeamHistory.delete = () => {
    throw new Error('Can\'t delete entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  return TeamHistory
}
