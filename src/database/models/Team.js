/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    number: { type: DataTypes.INTEGER, allowNull: false, field: 'number' },
    masoId: { type: DataTypes.INTEGER, allowNull: true, field: 'maso_id' },
    group: { type: DataTypes.STRING, allowNull: false, defaultValue: 'default', field: 'group' },
    solvedProblemsOverride: { type: DataTypes.INTEGER, allowNull: true, field: 'solved_problems_override' },
  }, {
    tableName: 'Teams',
    timestamps: true,
  })

  Team.associate = models => {
    Team.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Team.hasMany(models.TeamSolutionChange, {
      as: 'solutionChanges',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    Team.hasMany(models.TeamSolution, {
      as: 'solutions',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    Team.hasOne(models.TeamSolvedProblemCount, {
      as: 'solvedProblemCount',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    Team.hasMany(models.TeamAction, {
      as: 'actions',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    Team.hasMany(models.TeamState, {
      as: 'teamState',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Team
}
