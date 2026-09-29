-- Folio's complete schema. Safe to run repeatedly.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  bio text NOT NULL DEFAULT '',
  password_hash text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 180),
  subtitle text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','unpublished')),
  reading_minutes integer NOT NULL DEFAULT 1,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id bigserial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id bigint REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
CREATE TABLE IF NOT EXISTS likes (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS post_views (
  id bigserial PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_hash text,
  read_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_feed_idx ON posts (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts (author_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_idx ON comments (post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS views_post_idx ON post_views (post_id, created_at DESC);
