CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER NOT NULL PRIMARY KEY,
  home_team_id INTEGER REFERENCES teams(id) NOT NULL,
  away_team_id INTEGER REFERENCES teams(id) NOT NULL,
  date_col DATE NOT NULL,
  home_team_score INTEGER NOT NULL,
  away_team_score INTEGER NOT NULL,
  winner_id INTEGER REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  correct_guesses INTEGER DEFAULT 0,
  total_guesses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date_col DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS prediction_details (
  id SERIAL PRIMARY KEY,
  prediction_id INTEGER REFERENCES predictions(id),
  game_id INTEGER REFERENCES games(id),
  pick_id INTEGER REFERENCES teams(id),
  is_correct INTEGER NOT NULL DEFAULT -1
);