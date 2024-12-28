#! /usr/bin/env node

const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS game (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  release_date DATE
);

CREATE TABLE IF NOT EXISTS genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS developer (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_genre (
  game_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (game_id, genre_id),
  FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_developer (
  game_id INT NOT NULL,
  developer_id INT NOT NULL,
  PRIMARY KEY (game_id, developer_id),
  FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
  FOREIGN KEY (developer_id) REFERENCES developer(id) ON DELETE CASCADE
);

INSERT INTO
  genre (name)
VALUES
  ('Action'),
  ('Adventure'),
  ('RPG'),
  ('Roguelike'),
  ('Metroidvania'),
  ('Souls-like'),
  ('Platformer'),
  ('FPS'),
  ('Card Game');

INSERT INTO
  developer (name)
VALUES
  ('LocalThunk'),
  ('Team Cherry'),
  ('Motion Twin'),
  ('343 Industries'),
  ('Splash Damage'),
  ('Ruffian Games'),
  ('Bungie'),
  ('Saber Interactive');

INSERT INTO
  game (name, release_date)
VALUES
  ('Balatro', '2024-02-20'),
  ('Hollow Knight', '2017-02-24'),
  ('Dead Cells', '2018-08-07'),
  (
    'Halo The Master Chief Collection',
    '2019-12-03'
  );

INSERT INTO
  game_genre (game_id, genre_id)
VALUES
  (1, 4),
  (1, 9),
  (2, 5),
  (2, 6),
  (2, 7),
  (3, 1),
  (3, 2),
  (3, 4),
  (3, 5),
  (3, 7),
  (4, 1),
  (4, 8);

INSERT INTO
  game_developer (game_id, developer_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (4, 5),
  (4, 6),
  (4, 7),
  (4, 8);
`;

async function main () {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DB_STRING
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
