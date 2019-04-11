'use strict'

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    defaultCapacity: { type: DataTypes.INTEGER, allowNull: true, field: 'default_capacity' },
  }, {
    tableName: 'Venues',
  })

  Venue.associate = models => {
    Venue.belongsToMany(models.Game, {
      as: 'games',
      through: models.GameVenue,
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    Venue.hasMany(models.GameVenue, {
      as: 'gameVenues',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    Venue.hasMany(models.Room, {
      as: 'rooms',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Venue
}
