'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameVenue = sequelize.define('GameVenue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    capacity: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity' },
  }, {
    tableName: 'GameVenues',
  })

  GameVenue.associate = models => {
    GameVenue.belongsToMany(models.Room, {
      as: 'rooms',
      through: models.GameVenueRoom,
      foreignKey: { name: 'gameVenueId', field: 'game_venue_id' },
      onDelete: 'RESTRICT',
    })
    GameVenue.hasMany(models.GameVenueRoom, {
      as: 'gvrooms',
      foreignKey: { name: 'gameVenueId', field: 'game_venue_id' },
      onDelete: 'RESTRICT',
    })
    GameVenue.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    GameVenue.belongsTo(models.Venue, {
      as: 'venue',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    GameVenue.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'gameVenueId', field: 'game_venue_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameVenue
}
