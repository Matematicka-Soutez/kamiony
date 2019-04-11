/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamSolution = sequelize.define('TeamSolution', {
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_number', primaryKey: true },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id', primaryKey: true },
    gameId: { type: DataTypes.INTEGER, allowNull: false, field: 'game_id', primaryKey: true },
    solved: { type: DataTypes.BOOLEAN, allowNull: false, default: false, field: 'solved' },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  }, {
    tableName: 'TeamSolutions',
    timestamps: false,
  })

  TeamSolution.associate = models => {
    TeamSolution.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolution.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  TeamSolution.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "TeamSolutions" AS
          SELECT
            ts1."problem_number"  AS problem_number,
            ts1."team_id"         AS team_id,
            ts1."game_id"         AS game_id,
            ts1."solved"          AS solved
          FROM public."TeamSolutionChanges" as ts1
            LEFT JOIN public."TeamSolutionChanges" as ts2
            ON (
              ts1.team_id = ts2.team_id
              AND ts1.problem_number = ts2.problem_number
              AND ts1.game_id = ts2.game_id
              AND ts1."createdAt" < ts2."createdAt"
            )
          WHERE ts2.id IS NULL;
        `, { logging: options.logging })
    }
    return true
  }

  TeamSolution.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "TeamSolutions";',
        { logging: options.logging },
      )
    }
    return true
  }

  TeamSolution.create = () => {
    throw new Error('Can\'t create entries in view "TeamSolutions".')
  }

  TeamSolution.update = () => {
    throw new Error('Can\'t update entries in view "TeamSolutions".')
  }

  TeamSolution.delete = () => {
    throw new Error('Can\'t delete entries in view "TeamSolutions".')
  }

  return TeamSolution
}
