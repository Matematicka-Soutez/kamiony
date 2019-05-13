/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    /* COMMON PROPERTIES */
    email: { type: DataTypes.STRING, allowNull: false, field: 'email' },
    firstName: { type: DataTypes.STRING, allowNull: true, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: true, field: 'last_name' },
    password: { type: DataTypes.STRING, allowNull: true, field: 'password' },
    problemScanningToken: { type: DataTypes.STRING, allowNull: true, unique: true, field: 'problem_scanning_token' },
    /* ADMINISTRATIVE PROPERTIES */
    disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'disabled' },
    publicToken: { type: DataTypes.STRING, field: 'public_token' },
    passwordPublicToken: { type: DataTypes.STRING, field: 'password_public_token' },
    duplicateResetPasswordToken: { type: DataTypes.STRING, field: 'duplicate_reset_password_token' },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'confirmed' },
    passwordLastUpdatedAt: { type: DataTypes.DATE, defaultValue: new Date(), field: 'password_last_updated_at' },
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
  }, {
    tableName: 'Users',
    timestamps: true,
  })

  User.associate = models => {
    User.belongsToMany(models.Game, {
      as: 'games',
      through: 'GameUsers',
      foreignKey: { name: 'userId', field: 'user_id' },
      onDelete: 'RESTRICT',
    })
    User.hasMany(models.TeamSolutionChange, {
      as: 'createdTeamSolutionChanges',
      foreignKey: { name: 'createdBy', field: 'created_by' },
      onDelete: 'RESTRICT',
    })
  }

  return User
}
