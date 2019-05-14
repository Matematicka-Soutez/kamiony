'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamSolutionChange = sequelize.define('TeamSolutionChange', {
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_number' },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
    solved: { type: DataTypes.BOOLEAN, allowNull: false, default: false, field: 'solved' },
  }, {
    tableName: 'TeamSolutionChanges',
  })

  TeamSolutionChange.associate = models => {
    TeamSolutionChange.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolutionChange.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamSolutionChange
}
