'use strict'

module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    code: { type: DataTypes.STRING, allowNull: false, field: 'code', unique: true },
    date: { type: DataTypes.DATE, allowNull: false, field: 'date' },
    start: { type: DataTypes.DATE, allowNull: false, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: false, field: 'end' },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_public' },
  }, {
    tableName: 'Games',
    timestamps: true,
  })

  Game.associate = models => {
    Game.belongsToMany(models.Venue, {
      as: 'venues',
      through: models.GameVenue,
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Game.hasMany(models.GameVenue, {
      as: 'gameVenues',
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
