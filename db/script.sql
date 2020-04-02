------------------------------------------------------------------------------
--                      2020-04-01  MARLON ORTEGA                           --
--  Se realizo cambio de propiedad de atributo enviado de bit a char        --
--  esto con el fin de poder manejar mas de dos estados (0 = no enviado,    --
--  1 = enviado, 2 = leido, 3 = error ) y si fuese necesario algun otro.    --
------------------------------------------------------------------------------

ALTER TABLE masivos.dbo.outbound_correos ADD enviado char(1) DEFAULT 0 NULL GO


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
	name varchar(100) NULL,
	fecha_creacion datetime DEFAULT getdate() NULL
) GO