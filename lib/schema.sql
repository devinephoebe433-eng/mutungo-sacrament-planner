CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  meeting_type VARCHAR(20) NOT NULL CHECK (meeting_type IN ('testimony','regular','stake','general','special')),
  presiding VARCHAR(255) NOT NULL,
  conducting VARCHAR(255) NOT NULL,
  announcements TEXT[] DEFAULT '{}',
  opening_hymn JSONB NOT NULL,
  opening_prayer VARCHAR(255) NOT NULL,
  ward_business JSONB DEFAULT '[]',
  stake_business BOOLEAN DEFAULT false,
  sacrament_hymn JSONB NOT NULL,
  speakers JSONB DEFAULT '[]',
  closing_hymn JSONB NOT NULL,
  closing_prayer VARCHAR(255) NOT NULL
);

INSERT INTO meetings (date, meeting_type, presiding, conducting, opening_hymn, opening_prayer, sacrament_hymn, speakers, closing_hymn, closing_prayer)
VALUES
('2026-11-22','regular','Elder David Kato','Sister Sarah Namirembe','{"title":"How Great Thou Art","number":86}','Joshua Ssenyonga','{"title":"I Stand All Amazed","number":193}','[{"name":"Miriam Nakitto","topic":"Finding peace in Jesus Christ"},{"name":"Isaac Okello","topic":"Covenant belonging and service"}]','{"title":"Come, Come, Ye Saints","number":30}','Grace Nansubuga'),
('2026-11-15','testimony','Elder Joseph Mugisha','Brother Peter Ouma','{"title":"I Need Thee Every Hour","number":98}','Ruth Achieng','{"title":"The Lord Is My Light","number":89}','[{"name":"Anna Namuli","topic":"Trusting the Savior"}]','{"title":"Where Can I Turn for Peace?","number":129}','Daniel Ssemanda'),
('2026-11-08','stake','President Mark Ssekito','Sister Sarah Namirembe','{"title":"We Gather Together","number":4}','Joshua Ssenyonga','{"title":"As Now We Take the Sacrament","number":169}','[{"name":"President Grace Wamala","topic":"Serving with joy"}]','{"title":"Lead, Kindly Light","number":97}','Miriam Nakitto')
ON CONFLICT (date) DO NOTHING;
