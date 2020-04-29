-- 'do' migration file
-- added a new column called style that corresponds to the enum type we'll call article_category


CREATE TYPE article_category AS ENUM (
    'Listicle',
    'How-to',
    'News',
    'Interview',
    'Story'
);

ALTER TABLE blogful_articles
  ADD COLUMN
    style article_category;

