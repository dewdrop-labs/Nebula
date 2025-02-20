
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    user_twitter VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR NOT NULL,
    token VARCHAR NOT NULL,
    amount VARCHAR NOT NULL,
    transaction_type VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR NOT NULL,
    message VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

