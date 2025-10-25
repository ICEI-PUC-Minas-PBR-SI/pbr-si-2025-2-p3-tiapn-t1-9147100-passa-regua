CREATE TABLE IF NOT EXISTS usuarios (
    id IDENTITY PRIMARY KEY,
    primeiro_nome VARCHAR(100) NOT NULL,
    ultimo_nome VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    celular VARCHAR(30),
    senha VARCHAR(255),
    hash_senha VARCHAR(255),
    genero VARCHAR(30),
    idade INT,
    two_factor_method VARCHAR(20),
    two_factor_code VARCHAR(10),
    two_factor_expires_at TIMESTAMP,
    two_factor_verified BOOLEAN,
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);
