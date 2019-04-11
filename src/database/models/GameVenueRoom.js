'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameVenueRoom = sequelize.define('GameVenueRoom', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    capacity: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity' },
  }, {
    tableName: 'GameVenueRooms',
  })

  GameVenueRoom.associate = models => {
    GameVenueRoom.belongsTo(models.GameVenue, {
      as: 'gameVenue',
      foreignKey: { name: 'gameVenueId', field: 'game_venue_id' },
      onDelete: 'RESTRICT',
    })
    GameVenueRoom.belongsTo(models.Room, {
      as: 'room',
      foreignKey: { name: 'roomId', field: 'room_id' },
      onDelete: 'RESTRICT',
    })
    GameVenueRoom.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'gameVenueRoomId', field: 'game_venue_room_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameVenueRoom
}
