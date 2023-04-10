/*
--------------------------------------------------------------------
Â© 2023 TecnoGlobal All Rights Reserved
--------------------------------------------------------------------
Name   : SG_TELPOP
Link   : https://github.com/oskyba/TG-SG/database
Version: 1.0
--------------------------------------------------------------------
*/
-- create schemas
CREATE SCHEMA almacen;
go

CREATE SCHEMA ventas;
go

-- create tables
CREATE TABLE almacen.servicios (
	servicio_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (255) NOT NULL
);

CREATE TABLE almacen.marcas (
	marca_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (255) NOT NULL
);

CREATE TABLE almacen.productos (
	producto_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (255) NOT NULL,
	marca_id INT NOT NULL,
	servicio_id INT NOT NULL,
	fecha SMALLINT NOT NULL,
	precio DECIMAL (10, 2) NOT NULL,
	FOREIGN KEY (servicio_id) REFERENCES almacen.servicios (servicio_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (marca_id) REFERENCES almacen.marcas (marca_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE almacen.existencias (
	existencia_id INT,
	producto_id INT,
	cantidad INT,
	PRIMARY KEY (existencia_id, producto_id),
	FOREIGN KEY (producto_id) REFERENCES almacen.productos (producto_id) ON DELETE CASCADE ON UPDATE CASCADE
);
	
CREATE TABLE ventas.clientes (
	cliente_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (255) NOT NULL,
	apellido VARCHAR (255) NOT NULL,
	telefono VARCHAR (25),
	mail VARCHAR (255) NOT NULL,
	direccion VARCHAR (255),
	ciudad VARCHAR (50),
	estado VARCHAR (25),
	codigo_postal VARCHAR (5)
);

CREATE TABLE ventas.empresas (
	empresa_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (255) NOT NULL,
	telefono VARCHAR (25),
	mail VARCHAR (255),
	direccion VARCHAR (255),
	ciudad VARCHAR (255),
	state VARCHAR (10),
	codigo_postal VARCHAR (5)
);

CREATE TABLE ventas.usuarios (
	usuario_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (50) NOT NULL,
	apellido VARCHAR (50) NOT NULL,
	email VARCHAR (255) NOT NULL UNIQUE,
	telefono VARCHAR (25),
	activo tinyint NOT NULL,
	empresa_id INT NOT NULL,
	responsable_id INT,
	FOREIGN KEY (empresa_id) REFERENCES ventas.empresas (empresa_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (usuario_id) REFERENCES ventas.usuarios (usuario_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE ventas.clientes (
	cliente_id INT IDENTITY (1, 1) PRIMARY KEY,
	nombre VARCHAR (50) NOT NULL,
	apellido VARCHAR (50) NOT NULL,
	email VARCHAR (255) NOT NULL UNIQUE,
	telefono VARCHAR (25),
	activo tinyint NOT NULL,
	empresa_id INT NOT NULL,
	responsable_id INT,
	FOREIGN KEY (empresa_id) REFERENCES ventas.empresas (empresa_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (cliente_id) REFERENCES ventas.usuarios (cliente_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE ventas.pedidos (
	pedido_id INT IDENTITY (1, 1) PRIMARY KEY,
	cliente_id INT,
	estado tinyint NOT NULL,
	-- Estado pedido: 1 = Pendiente; 2 = En proceso; 3 = Rechazado; 4 = Completado
	fecha_pedido DATE NOT NULL,
	fecha_entrega DATE NOT NULL,
	fecha_envio DATE,
	empresa_id INT NOT NULL,
	usuario_id INT NOT NULL,
	FOREIGN KEY (cliente_id) REFERENCES ventas.clientes (cliente_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (usuario_id) REFERENCES ventas.usuarios (usuario_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE ventas.pedidos_elementos (
	pedido_id INT,
	elemento_id INT,
	producto_id INT NOT NULL,
	cantidad INT NOT NULL,
	precio DECIMAL (10, 2) NOT NULL,
	descuento DECIMAL (4, 2) NOT NULL DEFAULT 0,
	PRIMARY KEY (pedido_id, elemento_id),
	FOREIGN KEY (pedido_id) REFERENCES ventas.pedidos (pedido_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (producto_id) REFERENCES almacen.productos (producto_id) ON DELETE CASCADE ON UPDATE CASCADE
);