/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamAction = sequelize.define('TeamAction', {
    actionId: { type: DataTypes.INTEGER, allowNull: false, field: 'action_id' },
    cityId: { type: DataTypes.INTEGER, allowNull: false, field: 'city_id' },
    capacityId: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity_id' },
    rangeCoefficientId: { type: DataTypes.INTEGER, allowNull: false, field: 'range_coefficient_id' },
    goodsVolume: { type: DataTypes.INTEGER, allowNull: false, field: 'goods_volume' },
    petrolVolume: { type: DataTypes.INTEGER, allowNull: false, field: 'petrol_volume' },
    balance: { type: DataTypes.INTEGER, allowNull: false, field: 'balance' },
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'problem_number' },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_default' },
    reverted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'reverted' },
  }, {
    tableName: 'TeamActions',
    timestamps: true,
  })

  TeamAction.associate = models => {
    TeamAction.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamAction.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    TeamAction.hasOne(models.TeamAction, {
      as: 'previousTeamAction',
      foreignKey: { name: 'previousTeamActionId', field: 'previous_team_action_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamAction
}
