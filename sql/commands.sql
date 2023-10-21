CREATE TABLE users(
    id         varchar(36)  NOT NULL PRIMARY KEY,
    type       varchar(36)  NOT NULL, -- (PERSON, COMPANY, ORGANIZATION)
    name       varchar(128) NOT NULL,
    email      varchar(128) NOT NULL,
    password   varchar(128) NOT NULL,
    is_admin   int          NOT NULL,
    created_at varchar(24)  NOT NULL,
    updated_at varchar(24)  NOT NULL
);

CREATE TABLE organizations(
    id          varchar(36) NOT NULL PRIMARY KEY,
    user_id     varchar(36) NOT NULL,
    phone       varchar(36) NOT NULL,
    description text        NOT NULL,
    is_active   int         NOT NULL,
    created_at  varchar(24) NOT NULL,
    updated_at  varchar(24) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE organization_addresses(
    id              varchar(36) NOT NULL PRIMARY KEY,
    organization_id varchar(36) NOT NULL,
    city            varchar(64) NOT NULL,
    state           varchar(64) NOT NULL,
    street          varchar(64) NOT NULL,
    number          varchar(8)  NOT NULL,
    zip_code        varchar(12)  NOT NULL,
    district        varchar(64) NOT NULL,
    created_at      varchar(24) NOT NULL,
    updated_at      varchar(24) NOT NULL,
    FOREIGN KEY(organization_id) REFERENCES organizations(id)
);
