-- DROP TABLE users;
-- DROP TABLE messages;
-- DROP TABLE likes;


CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 400),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);


DELETE FROM likes;
DELETE FROM messages;
DELETE FROM users;


INSERT INTO users (username) VALUES ('user01');
INSERT INTO users (username) VALUES ('user02');
INSERT INTO users (username) VALUES ('user03');
INSERT INTO users (username) VALUES ('user04');
INSERT INTO users (username) VALUES ('user05');

INSERT INTO messages (username, content) VALUES ('user01', 'This is the first message from user01.');
INSERT INTO messages (username, content) VALUES ('user02', 'User02 is excited to send the second message.');
INSERT INTO messages (username, content) VALUES ('user03', 'A short message from user03, testing the content field.');
INSERT INTO messages (username, content) VALUES ('user04', 'User04 thinks this is a great way to send messages!');
INSERT INTO messages (username, content) VALUES ('user05', 'Another test message, this time from user05.');

INSERT INTO likes (message_id, username) VALUES (1, 'user02');
INSERT INTO likes (message_id, username) VALUES (2, 'user03');
INSERT INTO likes (message_id, username) VALUES (3, 'user01');
INSERT INTO likes (message_id, username) VALUES (4, 'user05');
INSERT INTO likes (message_id, username) VALUES (5, 'user04');

