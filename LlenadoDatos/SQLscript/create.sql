CREATE TABLE IF NOT EXISTS LDM (
    fecha_hora TIMESTAMP PRIMARY KEY NOT NULL,
    nemo VARCHAR(100) NOT NULL,
    planta_generadora VARCHAR(255) NOT NULL,
    potencia_disponible DOUBLE PRECISION NOT NULL,
    costo DOUBLE PRECISION NOT NULL,
    fpne DOUBLE PRECISION NOT NULL,
    banda VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS POE (
    fecha_hora TIMESTAMP PRIMARY KEY NOT NULL,
    poe DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS GENERACION (
    fecha_hora TIMESTAMP PRIMARY KEY NOT NULL,
    generacion DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS INFORMACION (
    fecha_hora TIMESTAMP PRIMARY KEY NOT NULL,
    indicador INT NOT NULL,
    liquidacion_poe DOUBLE PRECISION NOT NULL,
    liquidacion_cvg DOUBLE PRECISION NOT NULL,
    agente_a DOUBLE PRECISION NOT NULL,
    agente_b DOUBLE PRECISION NOT NULL
);

