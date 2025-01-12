const pool = require('./pool');

async function getAllGames () {
  const { rows } = await pool.query('SELECT * FROM game');
  return rows;
}

async function getGameDetails (gameId) {
  const { rows } = await pool.query(`
    SELECT
      g.id,
      g.name AS game_name,
      g.release_date,
      COALESCE(STRING_AGG(DISTINCT gen.name, ', '), '') AS genres,
      COALESCE(STRING_AGG(DISTINCT dev.name, ', '), '') AS developers
    FROM
      game g
      LEFT JOIN game_genre gg ON g.id = gg.game_id
      LEFT JOIN genre gen ON gg.genre_id = gen.id
      LEFT JOIN game_developer gd ON g.id = gd.game_id
      LEFT JOIN developer dev ON gd.developer_id = dev.id
    WHERE
      g.id = $1
    GROUP BY
      g.id;
    `, [gameId]);
  return rows;
}

async function getGameGenres (gameId) {
  const { rows } = await pool.query(`
    SELECT
      -- genre.id,
      -- g.name,
      genre.name
    FROM
      game_genre gg
      INNER JOIN game g ON g.id = gg.game_id
      INNER JOIN genre ON gg.genre_id = genre.id
    WHERE
      g.id= $1;
    `, [gameId]);
  return rows;
}

async function getGameDevs (gameId) {
  const { rows } = await pool.query(`
    SELECT
      d.id as developer_id,
      d.name
    FROM
      game_developer gd
      INNER JOIN game g ON g.id = gd.game_id
      INNER JOIN developer d ON gd.developer_id = d.id
    WHERE
      g.id = $1;
    `, [gameId]);
  return rows;
}

async function getDevelopersGames (developerId) {
  const { rows } = await pool.query(`
    SELECT
      g.id,
      g.name AS game_name,
      g.release_date
    FROM
      game g
      INNER JOIN game_developer gd ON g.id = gd.game_id
      INNER JOIN developer dev ON gd.developer_id = dev.id
    WHERE
      dev.id = $1;
    `, [developerId]);
  return rows;
}

async function getGenreGames (genreId) {
  const { rows } = await pool.query(`
    SELECT
      g.id,
      genre.name,
      g.name AS game_name,
      g.release_date
    FROM
      game g
      INNER JOIN game_genre gg ON g.id = gg.game_id
      INNER JOIN genre ON gg.genre_id = genre.id
    WHERE
      genre.id = $1;
    `, [genreId]);
  return rows;
}

async function createGame (gameName, releaseDate) {
  const { rows } = await pool.query(`
    INSERT INTO
      game (name, release_date)
    VALUES
      ( $1, $2 );
    `, [gameName, releaseDate]);
  return rows;
}

async function createDeveloper (devName) {
  const { rows } = await pool.query(`
    INSERT INTO
      developer (name)
    VALUES
      ( $1 );
    `, [devName]);
  return rows;
}

async function createGenre (genreName) {
  const { rows } = await pool.query(`
    INSERT INTO
      genre (name)
    VALUES
      ( $1 );
    `, [genreName]);
  return rows;
}

module.exports = {
  getAllGames,
  getGameDetails,
  getGameGenres,
  getGameDevs,
  getDevelopersGames,
  getGenreGames,
  createGame,
  createDeveloper,
  createGenre
};
