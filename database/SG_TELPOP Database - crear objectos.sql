/*
--------------------------------------------------------------------
Â© 2023 TecnoGlobal All Rights Reserved
--------------------------------------------------------------------
Name   : SG_TELPOP
Link   : https://github.com/oskyba/TG-SG/database
Version: 1.0
--------------------------------------------------------------------
*/

CREATE SCHEMA telpop;
go

CREATE TABLE telpop.usuarios (
 id INT IDENTITY (1,1) PRIMARY KEY,
 usuario VARCHAR(10) NOT NULL,
 contraseña VARBINARY(8000) NOT NULL,
 nombre VARCHAR(30) NOT NULL,
 apellido VARCHAR(30) NOT NULL,
 email VARCHAR(50) NOT NULL,
 telefono VARCHAR(15) NOT NULL,
 funcion VARCHAR(14) NOT NULL,
 estado VARCHAR(145 NOT NULL
);

CREATE TABLE telpop.clientes (
	id INT PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	telefono VARCHAR(11) NOT NULL,
	direccion VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL
);

CREATE TABLE telpop.facturas (
	id INT IDENTITY (1,1) PRIMARY KEY,
	idCliente INT NOT NULL,
	fechaEmision DATE NOT NULL,
	numeroFactura VARCHAR(15) NOT NULL,
	importe DECIMAL(16,2) NOT NULL,
	estado VARCHAR(22) NOT NULL,
	fechaVencimiento DATE NOT NULL,
	fechaCobro DATE,
	comentarios VARCHAR(50),
	contactadoPor varchar(10),
	cobradorAsignado varchar(10)
	FOREIGN KEY (idCliente) REFERENCES telpop.clientes (id)
);