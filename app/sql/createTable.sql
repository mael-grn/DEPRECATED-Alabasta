-- Table: USERS
CREATE TABLE USERS (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       first_name VARCHAR(255),
                       last_name VARCHAR(255),
                       pp_ref VARCHAR(255),
                       is_approved BOOLEAN DEFAULT FALSE,
                       is_admin BOOLEAN DEFAULT FALSE,
                       is_public BOOLEAN DEFAULT TRUE,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: BUG_REPORTS
CREATE TABLE BUG_REPORTS (
                             id SERIAL PRIMARY KEY,
                             user_id INT NOT NULL,
                             category VARCHAR(255),
                             details TEXT,
                             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: SUBSCRIPTIONS
CREATE TABLE SUBSCRIPTIONS (
                               user_id INT NOT NULL,
                               subscribed_id INT NOT NULL,
                               PRIMARY KEY (user_id, subscribed_id),
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
                               FOREIGN KEY (subscribed_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: TMDB_MAGNET_LINKS
CREATE TABLE TMDB_MAGNET_LINKS (
                                   tmdb_id INT NOT NULL,
                                   quality VARCHAR(255) NOT NULL,
                                   magnet_link TEXT NOT NULL,
                                   PRIMARY KEY (tmdb_id, quality),
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: WATCH_LISTS
CREATE TABLE WATCH_LISTS (
                             tmdb_id INT NOT NULL,
                             user_id INT NOT NULL,
                             PRIMARY KEY (tmdb_id, user_id),
                             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: WATCH_PROGRESS
CREATE TABLE WATCH_PROGRESS (
                                id SERIAL PRIMARY KEY,
                                user_id INT NOT NULL,
                                tmdb_id INT NOT NULL,
                                progress DECIMAL(5,2) DEFAULT 0.00,
                                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: OPINIONS
CREATE TABLE OPINIONS (
                          id SERIAL PRIMARY KEY,
                          user_id INT NOT NULL,
                          tmdb_id INT NOT NULL,
                          comment TEXT,
                          grade INT,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: SHARED_WATCH_LISTS
CREATE TABLE SHARED_WATCH_LISTS (
                                    id SERIAL PRIMARY KEY,
                                    name VARCHAR(255) NOT NULL,
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: SHARED_WATCH_LISTS_USERS
CREATE TABLE SHARED_WATCH_LISTS_USERS (
                                          shared_watch_list_id INT NOT NULL,
                                          user_id INT NOT NULL,
                                          PRIMARY KEY (shared_watch_list_id, user_id),
                                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                          FOREIGN KEY (shared_watch_list_id) REFERENCES SHARED_WATCH_LISTS(id) ON DELETE CASCADE,
                                          FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Table: SHARED_WATCH_LISTS_TMDB
CREATE TABLE SHARED_WATCH_LISTS_TMDB (
                                         shared_watch_list_id INT NOT NULL,
                                         tmdb_id INT NOT NULL,
                                         PRIMARY KEY (shared_watch_list_id, tmdb_id),
                                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                         FOREIGN KEY (shared_watch_list_id) REFERENCES SHARED_WATCH_LISTS(id) ON DELETE CASCADE
);