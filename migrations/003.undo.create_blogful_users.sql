-- 17.19 Add relationships to Blogful

ALTER TABLE blogful_articles
  DROP COLUMN author;

DROP TABLE IF EXISTS blogful_users;