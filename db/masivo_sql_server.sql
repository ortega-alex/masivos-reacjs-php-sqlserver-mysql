----------------------------------------------------------------------------------
--                      2020-04-21  MARLON ORTEGA                           	--
--  nueva propiedad response, guarda el ultimo correo de respuesta del cliente	--
----------------------------------------------------------------------------------

ALTER TABLE masivos.dbo.outbound_correos ADD response text NULL GO

----------------------------------------------------------------------------------
--                      2020-04-21  MARLON ORTEGA                           	--
--  	nueva tabla black list, lista de correos que rebotaron, esto con el		--
--							fin de no crear spam								--
----------------------------------------------------------------------------------

CREATE TABLE masivos.dbo.black_list (
	id_black_list int IDENTITY(0,1) NOT NULL,
	email varchar(100) NULL,
	fecha datetime DEFAULT getdate() NULL
) GO

----------------------------------------------------------------------------------
--                      2020-04-16  MARLON ORTEGA                           	--
--  nueva tabla customer_data, permite guardar los datos del cliente			--
--	recuperados de las diferentes bases de datos y excel cargados al sistema	--
----------------------------------------------------------------------------------

CREATE TABLE masivos.dbo.customer_data (
	id_customer_data int IDENTITY(0,1) NOT NULL,
	id_outbound_correos int NOT NULL,
	no_cuenta varchar(100) NULL,
	nombre_completo varchar(100) NULL,
	direccion varchar(100) NULL,
	tarjeta varchar(100) NULL,
	estado char(1) DEFAULT 1 NULL,
	fecha_creacion datetime DEFAULT getDate() NULL
) GO

------------------------------------------------------------------------------
--                      2020-04-14  MARLON ORTEGA                           --
--  nueva tabla operacion, permite administrar los nombres como 			--
--	cobros, tmk, claro etc. dentro del sistema 		    					--
------------------------------------------------------------------------------

CREATE TABLE masivos.dbo.operation (
	id_operation int IDENTITY(1,1) NOT NULL,
	name varchar(200) COLLATE Modern_Spanish_CI_AS NOT NULL,
	state char(1) COLLATE Modern_Spanish_CI_AS NULL,
	creation_date datetime NULL
) GO

------------------------------------------------------------------------------
--                      2020-04-14  MARLON ORTEGA                           --
--  propiedad operacion, permite la separacion entre cobros y tmk 		    --
------------------------------------------------------------------------------

ALTER TABLE masivos.dbo.correos_textos ADD id_operation int NOT NULL GO

------------------------------------------------------------------------------
--                      2020-04-12  MARLON ORTEGA                           --
--  permite cargar las imagenes personalizadas para los textos a enviar     --
------------------------------------------------------------------------------

CREATE TABLE masivos.dbo.[image] (
	id_image int IDENTITY(0,1) NOT NULL,
	title varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL,
	value varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL,
	fecha datetime NULL,
	estado char(1) COLLATE Modern_Spanish_CI_AS NULL
) GO



------------------------------------------------------------------------------
--                      2020-04-01  MARLON ORTEGA                           --
--  Se realizo cambio de propiedad de atributo enviado de bit a char        --
--  esto con el fin de poder manejar mas de dos estados (0 = no enviado,    --
--  1 = enviado, 2 = leido, 3 = error, 4 = cliente respondio ) y si fuese 	--
--							necesario algun otro.						    --
------------------------------------------------------------------------------
-- Drop table

-- DROP TABLE masivos.dbo.outbound_correos GO

CREATE TABLE masivos.dbo.outbound_correos (
	Id_outbound_correos int IDENTITY(1,1) NOT NULL,
	control varchar(30) COLLATE Modern_Spanish_CI_AS NULL,
	email varchar(100) COLLATE Modern_Spanish_CI_AS NULL,
	id_texto int NULL,
	id_usuario_envia int NULL,
	enviado char(1) COLLATE Modern_Spanish_CI_AS NULL,
	fecha_envio datetime NULL,
	fecha_creacion datetime NULL,
	id_thread varchar(6) COLLATE Modern_Spanish_CI_AS NULL,
	procesado bit NULL,
	management_status varchar(100) COLLATE Modern_Spanish_CI_AS NULL,
	id_thread2 int NULL,
	CONSTRAINT PK_outbound_correos PRIMARY KEY (Id_outbound_correos)
) GO

------------------------------------------------------------------------------
--                      2020-04-02  MARLON ORTEGA                           --
--              tabla para manejar los lotes por usuarios                   --
--  permitiria cread o filtrar todos los correos enviados relacionados      --
-- ---------------------------------------------------------------------------

CREATE TABLE masivos.dbo.thread (
	id_thread int IDENTITY(0,1) NOT NULL,
	id_usuario int NOT NULL,
	id_cliente int NULL,
	id_producto int NULL,
	id_texto int NULL,
	name varchar(100) COLLATE Modern_Spanish_CI_AS NULL,
	fecha_creacion datetime NULL,
	send int NULL,
	percentage int NULL,
	[length] int NULL,
	status bit NULL,
	nombre_archivo varchar(100) COLLATE Modern_Spanish_CI_AS NULL,
	[path] varchar(100) COLLATE Modern_Spanish_CI_AS NULL,
	id_operation int NULL
) GO
