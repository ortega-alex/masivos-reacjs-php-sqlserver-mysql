------------------------------------------------------------------------------
--                      2020-04-15  MARLON ORTEGA                           --
--  permite obtener informacion de cuando se creo y edito el cliente		--
------------------------------------------------------------------------------

ALTER TABLE tmk_ventas.cat_clientes ADD fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL;
ALTER TABLE tmk_ventas.cat_clientes ADD fecha_edit TIMESTAMP NULL;


------------------------------------------------------------------------------
--                      2020-04-15  MARLON ORTEGA                           --
--  permite obtener informacion de cuando se creo y edito el producto		--
------------------------------------------------------------------------------
ALTER TABLE tmk_ventas.cat_producto ADD fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL;
ALTER TABLE tmk_ventas.cat_producto ADD fecha_edit TIMESTAMP NULL;
