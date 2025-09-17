-- Crear todas las bases de datos necesarias
DROP DATABASE IF EXISTS licenciasdb;
DROP DATABASE IF EXISTS portal_paciente_db;
DROP DATABASE IF EXISTS validador_aseguradora_db;

CREATE DATABASE licenciasdb;
CREATE DATABASE portal_paciente_db;
CREATE DATABASE validador_aseguradora_db;

-- Configurar licenciasdb
USE licenciasdb;

CREATE TABLE IF NOT EXISTS licenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(50) UNIQUE,
  patientId VARCHAR(50) NOT NULL,
  doctorId VARCHAR(50) NOT NULL,
  diagnosis VARCHAR(255),
  startDate DATE,
  days INT,
  status VARCHAR(20)
);

-- Configurar portal_paciente_db
USE portal_paciente_db;

CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patient_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId VARCHAR(50) NOT NULL,
  sessionToken VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configurar validador_aseguradora_db
USE validador_aseguradora_db;

-- Estructura que espera el código del validador
CREATE TABLE IF NOT EXISTS insurance_validations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(50) NOT NULL,
  validation_result BOOLEAN,
  validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  insurer_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  license_number VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
