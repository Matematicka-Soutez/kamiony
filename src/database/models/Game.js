'use strict'

module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    code: { type: DataTypes.STRING, allowNull: false, field: 'code', unique: true },
    map: { type: DataTypes.STRING, allowNull: false, field: 'map' },
    start: { type: DataTypes.DATE, allowNull: true, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: true, field: 'end' },
    // eslint-disable-next-line max-len
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_public' },
  }, {
    tableName: 'Games',
    timestamps: true,
  })

  Game.associate = models => {
    Game.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.TeamSolutionChange, {
      as: 'teamSolutionChanges',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.TeamSolution, {
      as: 'teamSolutions',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.TeamSolvedProblemCount, {
      as: 'teamSolutionCounts',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.TeamAction, {
      as: 'teamActions',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.TeamState, {
      as: 'teamState',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Game
}
