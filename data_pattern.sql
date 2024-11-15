CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY
);

CREATE TABLE characters (
    user_id VARCHAR(255),
    character_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    level INT,
    class VARCHAR(255),
    experience INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE inventory (
    item_id VARCHAR(255) PRIMARY KEY,
    character_id VARCHAR(255),
    name VARCHAR(255),
    type VARCHAR(255),
    quantity INT,
    FOREIGN KEY (character_id) REFERENCES characters(character_id)
);

CREATE TABLE prompts (
    prompt_id VARCHAR(255) PRIMARY KEY,
    character_id VARCHAR(255),
    prompt VARCHAR(255),
    FOREIGN KEY (character_id) REFERENCES characters(character_id)
);
