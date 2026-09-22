-- Apply once to databases created before Song.duration_seconds was added.
-- SQLAlchemy's create_all() creates missing tables but does not alter existing ones.
ALTER TABLE songs
    ADD COLUMN duration_seconds INT NULL AFTER genre;
