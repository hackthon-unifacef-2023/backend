CREATE TABLE users(
    id         varchar(36)  NOT NULL PRIMARY KEY,
    name       varchar(128) NOT NULL,
    email      varchar(128) NOT NULL,
    password   varchar(128) NOT NULL,
    created_at varchar(24)  NOT NULL,
    updated_at varchar(24)  NOT NULL
);
