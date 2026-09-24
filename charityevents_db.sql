DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE charityevents_db;

CREATE TABLE organizations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mission VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  website VARCHAR(255) NULL,
  address VARCHAR(180) NOT NULL,
  city VARCHAR(80) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organization_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  summary VARCHAR(255) NOT NULL,
  full_description TEXT NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  venue_name VARCHAR(140) NOT NULL,
  address VARCHAR(180) NOT NULL,
  city VARCHAR(80) NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  fundraising_goal DECIMAL(12,2) NOT NULL,
  amount_raised DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  capacity INT UNSIGNED NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  status ENUM('active', 'suspended', 'cancelled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_events_category
    FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT chk_event_dates CHECK (end_datetime > start_datetime),
  CONSTRAINT chk_event_money CHECK (
    ticket_price >= 0 AND fundraising_goal >= 0 AND amount_raised >= 0
  ),
  INDEX idx_events_date (start_datetime),
  INDEX idx_events_city (city),
  INDEX idx_events_category (category_id),
  INDEX idx_events_status (status)
) ENGINE=InnoDB;

INSERT INTO organizations
  (name, mission, description, email, phone, website, address, city)
VALUES
  (
    'Harbour Hope Community Foundation',
    'Turning local generosity into practical support for families, young people and neighbourhood services.',
    'Harbour Hope works with local partners to fund food relief, education, health and community connection programs across the region.',
    'hello@harbourhope.example',
    '+61 2 5550 0140',
    'https://harbourhope.example',
    '18 Community Lane',
    'Harbour City'
  );

INSERT INTO categories (name, slug, description) VALUES
  ('Fun Run', 'fun-run', 'Community walks and runs that raise funds through entry donations.'),
  ('Gala', 'gala', 'Formal dinners and social evenings supporting a nominated cause.'),
  ('Auction', 'auction', 'Fundraising auctions featuring donated goods and experiences.'),
  ('Concert', 'concert', 'Live music events that connect performers and community causes.'),
  ('Workshop', 'workshop', 'Practical learning sessions with proceeds supporting local programs.'),
  ('Community Day', 'community-day', 'Inclusive family and neighbourhood fundraising activities.');

INSERT INTO events
  (organization_id, category_id, name, slug, summary, full_description, purpose,
   start_datetime, end_datetime, venue_name, address, city, ticket_price, currency,
   fundraising_goal, amount_raised, capacity, image_path, status)
VALUES
  (1, 6, 'Winter Warmth Community Day', 'winter-warmth-community-day',
   'A neighbourhood collection day supporting the winter essentials program.',
   'Local volunteers collected blankets, warm clothing and pantry staples while families enjoyed free activities and community information stalls.',
   'Provide winter essentials to households experiencing financial pressure.',
   '2026-07-12 10:00:00', '2026-07-12 16:00:00', 'Civic Green', '2 Market Street', 'Harbour City', 0.00, 'AUD',
   12000.00, 12840.00, 500, 'assets/images/community-day.png', 'active'),
  (1, 5, 'School Ready Skills Workshop', 'school-ready-skills-workshop',
   'A practical afternoon of learning activities for children and carers.',
   'Education volunteers will share reading, organisation and confidence-building activities. Ticket donations fund school supply packs for local students.',
   'Fund 250 school supply packs before the new school year.',
   '2026-09-26 13:00:00', '2026-09-26 16:30:00', 'Riverside Learning Hub', '44 River Road', 'Harbour City', 15.00, 'AUD',
   8500.00, 3920.00, 140, 'assets/images/workshop.png', 'active'),
  (1, 1, 'Harbour Hope Fun Run', 'harbour-hope-fun-run',
   'Choose a 5 km run or 2 km family walk along the foreshore.',
   'The annual Harbour Hope Fun Run brings together runners, walkers and families. Entry donations support emergency accommodation and transport assistance.',
   'Expand the emergency support fund for people moving into safe housing.',
   '2026-10-18 07:30:00', '2026-10-18 12:00:00', 'Harbour Foreshore Park', '1 Seaview Parade', 'Harbour City', 35.00, 'AUD',
   30000.00, 18450.00, 900, 'assets/images/fun-run.png', 'active'),
  (1, 2, 'Light the Way Gala', 'light-the-way-gala',
   'Dinner, local stories and live music in support of youth mentoring.',
   'Guests will hear from mentors and program graduates during an evening featuring a seasonal dinner and performances from local musicians.',
   'Fund a full year of mentoring for 60 young people.',
   '2026-11-07 18:30:00', '2026-11-07 22:30:00', 'The Glasshouse Ballroom', '80 Ocean Avenue', 'Harbour City', 145.00, 'AUD',
   50000.00, 27600.00, 260, 'assets/images/gala.png', 'active'),
  (1, 3, 'Gifts of Good Silent Auction', 'gifts-of-good-silent-auction',
   'Bid on locally donated art, dining and weekend experiences.',
   'The online-supported silent auction concludes with an in-person viewing evening. Every winning bid contributes to the mobile food relief service.',
   'Keep the mobile food relief van operating through summer.',
   '2026-11-21 17:00:00', '2026-11-21 21:00:00', 'Old Ferry Terminal', '9 Wharf Street', 'Portside', 10.00, 'AUD',
   22000.00, 9150.00, 320, 'assets/images/auction.png', 'active'),
  (1, 4, 'Voices for Hope Concert', 'voices-for-hope-concert',
   'An all-ages evening featuring emerging artists and community choirs.',
   'Local artists donate their performances for an accessible night of music. Ticket proceeds help fund counselling sessions for young people.',
   'Provide 400 no-cost counselling sessions during 2027.',
   '2026-12-05 16:00:00', '2026-12-05 21:30:00', 'Memorial Arts Theatre', '16 King Street', 'Harbour City', 42.00, 'AUD',
   28000.00, 11040.00, 700, 'assets/images/concert.png', 'active'),
  (1, 6, 'Summer Pantry Packing Day', 'summer-pantry-packing-day',
   'Help assemble family pantry boxes before the holiday period.',
   'Volunteers work in small teams to sort donated food and prepare balanced pantry boxes. Free registration helps us plan equipment and refreshments.',
   'Prepare and distribute 500 pantry boxes to partner services.',
   '2026-12-12 09:00:00', '2026-12-12 15:00:00', 'Harbour Hope Warehouse', '25 Foundry Lane', 'West Harbour', 0.00, 'AUD',
   18000.00, 7420.00, 180, 'assets/images/community-day.png', 'active'),
  (1, 5, 'Community Garden Workshop', 'community-garden-workshop',
   'Learn practical growing skills while supporting neighbourhood gardens.',
   'Garden educators cover seed raising, composting and water-wise planting. Proceeds purchase tools and seedlings for shared garden sites.',
   'Equip four neighbourhood garden sites for the 2027 growing season.',
   '2027-01-23 10:00:00', '2027-01-23 13:00:00', 'Northside Community Garden', '7 Acacia Way', 'Northside', 20.00, 'AUD',
   9000.00, 2180.00, 80, 'assets/images/workshop.png', 'active'),
  (1, 1, 'Coast to Creek Charity Walk', 'coast-to-creek-charity-walk',
   'A supported 12 km walk connecting coastal and creek reserves.',
   'Walkers follow a signed route with rest points, water and volunteer support. Entry donations fund inclusive outdoor activities for people with disability.',
   'Purchase adaptive outdoor equipment and fund trained activity leaders.',
   '2027-02-14 07:00:00', '2027-02-14 13:00:00', 'Coastal Reserve Gate', '101 Coast Road', 'Seabreeze', 30.00, 'AUD',
   26000.00, 4875.00, 600, 'assets/images/fun-run.png', 'active'),
  (1, 2, 'New Beginnings Breakfast', 'new-beginnings-breakfast',
   'A community breakfast celebrating local housing support partnerships.',
   'The breakfast connects supporters with frontline housing teams and people who have rebuilt stable lives. Proceeds fund tenancy starter kits.',
   'Provide complete starter kits for 100 households entering secure housing.',
   '2027-03-06 07:30:00', '2027-03-06 10:00:00', 'Harbour Convention Centre', '3 Quay Boulevard', 'Harbour City', 75.00, 'AUD',
   24000.00, 3560.00, 300, 'assets/images/gala.png', 'active'),
  (1, 4, 'Unverified Promoter Concert', 'unverified-promoter-concert',
   'This record demonstrates an event suspended under the publishing policy.',
   'The event is retained in the database for administration but must never be returned in public event listings.',
   'Demonstrate the suspended-event rule.',
   '2026-11-29 18:00:00', '2026-11-29 21:00:00', 'Temporary Venue', '1 Example Road', 'Harbour City', 55.00, 'AUD',
   10000.00, 0.00, 200, 'assets/images/concert.png', 'suspended');

CREATE USER IF NOT EXISTS 'charityevents_app'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT SELECT ON charityevents_db.* TO 'charityevents_app'@'localhost';
FLUSH PRIVILEGES;
