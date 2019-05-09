/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamState = sequelize.define('TeamState', {
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
  }, {
    tableName: 'TeamStates',
    timestamps: false,
  })

  TeamState.associate = models => {
    TeamState.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamState.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
  }

  TeamState.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "TeamStates" AS
          SELECT
            MAX(id)                      AS id,
            team_id                      AS team_id,
            game_id                      AS game_id,
            MAX(city_id)                 AS city_id,
            MAX(capacity_id)             AS capacity_id,
            MAX(range_coefficient_id)    AS range_coefficient_id,
            SUM(goods_volume)            AS goods_volume,
            SUM(petrol_volume)           AS petrol_volume,
            SUM(balance)                 AS balance
          FROM (
            SELECT
              0                              AS id,
              "team_id"                      AS team_id,
              "game_id"                      AS game_id,
              0                              AS city_id,
              0                              AS capacity_id,
              0                              AS range_coefficient_id,
              0                              AS goods_volume,
              SUM("petrol_volume")           AS petrol_volume,
              SUM("balance")                 AS balance
            FROM public."TeamActions"
            WHERE "action_id" = 6
            GROUP BY game_id, team_id

            UNION ALL

            SELECT
              MAX(ta1."id")                      AS id,
              ta1."team_id"                      AS team_id,
              ta1."game_id"                      AS game_id,
              ta2."city_id"                      AS city_id,
              ta2."capacity_id"                  AS capacity_id,
              ta2."range_coefficient_id"         AS range_coefficient_id,
              SUM(ta1."goods_volume")            AS goods_volume,
              SUM(ta1."petrol_volume")           AS petrol_volume,
              SUM(ta1."balance")                 AS balance
            FROM public."TeamActions" as ta1
              INNER JOIN (
                SELECT
                  a1."team_id"                      AS team_id,
                  a1."game_id"                      AS game_id,
                  a1."city_id"                      AS city_id,
                  a1."capacity_id"                  AS capacity_id,
                  a1."range_coefficient_id"         AS range_coefficient_id
                FROM public."TeamActions" a1
                LEFT JOIN public."TeamActions" a2
                ON (
                  a1."team_id" = a2."team_id"
                  AND a1."game_id" = a2."game_id"
                  AND NOT a2."reverted" AND a2."action_id" != 6
                  AND a1."createdAt" < a2."createdAt"
                )
                WHERE a2."id" IS NULL AND NOT a1."reverted" AND a1."action_id" != 6
              ) as ta2
              ON (
                ta1."team_id" = ta2."team_id"
                AND ta1."game_id" = ta2."game_id"
              )
            WHERE NOT ta1."reverted" AND ta1."action_id" != 6
            GROUP BY ta1."game_id", ta1."team_id", ta2."city_id", ta2."capacity_id", ta2."range_coefficient_id"
          ) as suicide
          GROUP BY game_id, team_id
          ORDER BY game_id, team_id;
        `, { logging: options.logging })
    }
    return true
  }

  TeamState.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "TeamStates";',
        { logging: options.logging },
      )
    }
    return true
  }

  TeamState.create = () => {
    throw new Error('Can\'t create entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  TeamState.update = () => {
    throw new Error('Can\'t update entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  TeamState.delete = () => {
    throw new Error('Can\'t delete entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  return TeamState
}
