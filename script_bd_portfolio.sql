CREATE TABLE page (
                      id SERIAL PRIMARY KEY,
                      title VARCHAR(255) NOT NULL
);

CREATE TABLE tag (
                     id SERIAL PRIMARY KEY,
                     name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE element_type (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE section_type (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE section_tag (
                             section_id INTEGER REFERENCES section(id) NOT NULL,
                             tag_id INTEGER REFERENCES tag(id) NOT NULL,
                             PRIMARY KEY (section_id, tag_id)
);

CREATE TABLE section (
                         id SERIAL PRIMARY KEY,
                         page_id INTEGER REFERENCES page(id) NOT NULL,
                         type_id INTEGER REFERENCES section_type(id) NOT NULL,
                         position INTEGER NOT NULL,
                         title varchar(255) NOT NULL
);

CREATE TABLE element (
                         id SERIAL PRIMARY KEY,
                         section_id INTEGER REFERENCES section(id) NOT NULL,
                         type_id INTEGER REFERENCES element_type(id) NOT NULL,
                         position INTEGER,
                         content TEXT
);

CREATE TABLE password (
                          id integer PRIMARY KEY,
                          password VARCHAR(255) NOT NULL
);