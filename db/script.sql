------------------------------------------------------------------------------
--                      2020-04-01  MARLON ORTEGA                           --
--  Se realizo cambio de propiedad de atributo enviado de bit a char        --
--  esto con el fin de poder manejar mas de dos estados (0 = no enviado,    --
--  1 = enviado, 2 = leido, 3 = error ) y si fuese necesario algun otro.    --
------------------------------------------------------------------------------

ALTER TABLE masivos.dbo.outbound_correos ADD enviado char(1) DEFAULT 0 NULL GO

