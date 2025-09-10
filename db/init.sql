CREATE DATABASE IF NOT EXISTS licenciasdb;
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
