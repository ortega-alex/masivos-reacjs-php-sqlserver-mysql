<?php

require_once '../config/helper.php';
if (extension_loaded('mssql')) {
    require_once '../config/dbClassMSSQL.php';
    $_con = new dbClassMSSQL();
} else {
    require_once '../config/dbClassPDO.php';
    $_con = new dbClassPDO();
}
require_once '../config/dbClassMysql.php';
$con = new dbClassMysql();

getHeader();

$res['err'] = "true";
$res['msj'] = "404 Pagina no en_contrada";

$intIdOperation = isset($_POST['id_operation']) ? intval($_POST['id_operation']) : 0;
$intIdCliente = isset($_POST['id_cliente']) ? intval($_POST['id_cliente']) : 0;
$strNombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;
$intIdProducto = isset($_POST['id_producto']) ? intval($_POST['id_producto']) : 0;

if (isset($_GET['get'])) {
    // CLIENTES COBROS
    $strQuery = "   SELECT id_cliente, nombre
                    FROM oca_sac.dbo.clientes
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_cliente' => $rTmp->id_cliente,
            'nombre' => $rTmp->nombre,
        );
    }

    // CLIENTES TMK
    $strQuery = "   SELECT id_cliente, descripcion AS nombre
                    FROM tmk_ventas.cat_clientes
                    ORDER BY nombre";
    $qTmp = $con->db_consulta($strQuery);
    while ($rTmp = $con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_cliente' => $rTmp->id_cliente,
            'nombre' => $rTmp->nombre,
        );
    }

    $res['clientes'] = $arr;
}

if (isset($_GET['get_client_operation'])) {
    $arr = array();
    if ($intIdOperation == 2) {
        $strQuery = "   SELECT id_cliente, descripcion AS nombre, fecha_creacion, estado
                        FROM tmk_ventas.cat_clientes
                        ORDER BY nombre";
        $qTmp = $con->db_consulta($strQuery);
        while ($rTmp = $con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_cliente' => $rTmp->id_cliente,
                'nombre' => $rTmp->nombre,
                'fecha' => date('d-m-Y', strtotime($rTmp->fecha_creacion)),
                'estado' => $rTmp->estado,
            );
        }
    }
    $res['clientes_operacion'] = $arr;
}

if (isset($_GET['add'])) {
    if ($intIdCliente > 0) {
        if ($intIdOperation == 2) {
            $strQuery = "   UPDATE tmk_ventas.cat_clientes
                            SET descripcion = '{$strNombre}',
                                estado = {$intEstado},
                                fecha_edit = CURRENT_TIMESTAMP()
                            WHERE id_cliente = {$intIdCliente}";
            $qTmp = $con->db_consulta($strQuery);
        }
    } else {
        if ($intIdOperation == 2) {
            $strQuery = "   INSERT INTO tmk_ventas.cat_clientes(descripcion, estado)
                            VALUES ('{$strNombre}', {$intEstado})";
            $qTmp = $con->db_consulta($strQuery);
        }
    }

    if ($qTmp) {
        $res['err'] = "false";
        $res['msj'] = "Cliente guardado exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un inconveniente!";
    }
}

if (isset($_GET['get_activos'])) {
    $arr = array();
    if ($intIdOperation == 1) {
        $strQuery = "   SELECT id_cliente, nombre
                        FROM oca_sac.dbo.clientes
                        WHERE suspendido = 0
                        ORDER BY nombre";
        $qTmp = $_con->db_consulta($strQuery);
        while ($rTmp = $_con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_cliente' => $rTmp->id_cliente,
                'nombre' => $rTmp->nombre,
            );
        }
    } else {
        $strQuery = "   SELECT id_cliente, descripcion AS nombre
                        FROM tmk_ventas.cat_clientes
                        WHERE estado = 1
                        ORDER BY nombre";
        $qTmp = $con->db_consulta($strQuery);
        while ($rTmp = $con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_cliente' => intval($rTmp->id_cliente),
                'nombre' => $rTmp->nombre,
            );
        }
    }

    $arr[] = array(
        'id_cliente' => '',
        'nombre' => '-- LIMPIAR TODO --',
    );
    $res['clientes_activos'] = $arr;
}

if (isset($_GET['get_productos_cliente'])) {
    $arr = array();
    if ($intIdOperation == 1) {
        $strQuery = "   SELECT id_producto, descripcion AS nombre
                        FROM oca_sac.dbo.productos
                        WHERE id_cliente = {$intIdCliente}
                        AND suspendido = 0
                        ORDER BY descripcion";
        $qTmp = $_con->db_consulta($strQuery);
        while ($rTmp = $_con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_producto' => $rTmp->id_producto,
                'nombre' => $rTmp->nombre,
            );
        }
    } else {
        $strQuery = "   SELECT id_producto, descripcion AS nombre
                        FROM tmk_ventas.cat_producto
                        WHERE id_cliente = 1
                        AND estado = 1
                        ORDER BY nombre DESC";
        $qTmp = $con->db_consulta($strQuery);
        while ($rTmp = $con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_producto' => $rTmp->id_producto,
                'nombre' => $rTmp->nombre,
            );
        }
    }
    $res['productos_cliente'] = $arr;
}

if (isset($_GET['get_operation'])) {
    $strQuery = "   SELECT id_operation, name AS nombre
                    FROM masivos.dbo.operation
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_operation' => $rTmp->id_operation,
            'nombre' => $rTmp->nombre,
        );
    }
    $res['operaciones'] = $arr;
}

if (isset($_GET['get_operation_act'])) {
    $strQuery = "   SELECT id_operation, name AS nombre
                    FROM masivos.dbo.operation
                    WHERE state = 0
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_operation' => $rTmp->id_operation,
            'nombre' => $rTmp->nombre,
        );
    }

    $arr[] = array(
        'id_operation' => '',
        'nombre' => '-- LIMPIAR --',
    );

    $res['operaciones_act'] = $arr;
}

if (isset($_GET['change_status'])) {
    if ($intIdOperation == 2) {
        $strQuery = "   UPDATE tmk_ventas.cat_clientes
                        SET estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_cliente = {$intIdCliente}";
        $qTmp = $con->db_consulta($strQuery);
    }

    if ($qTmp) {
        $res['err'] = 'false';
        $res['msj'] = "Cambios realizados exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['get_product_operation'])) {
    $arr = array();
    if ($intIdOperation == 2) {
        $strQuery = "   SELECT a.id_producto, a.descripcion AS nombre, a.estado, a.fecha_creacion,
                            b.id_cliente, b.descripcion AS cliente
                        FROM tmk_ventas.cat_producto a
                        INNER JOIN tmk_ventas.cat_clientes b ON a.id_cliente = b.id_cliente
                        ORDER BY nombre DESC";
        $qTmp = $con->db_consulta($strQuery);
        while ($rTmp = $con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_producto' => $rTmp->id_producto,
                'nombre' => $rTmp->nombre,
                'fecha' => date('d-m-Y', strtotime($rTmp->fecha_creacion)),
                'estado' => $rTmp->estado,
                'id_cliente' => $rTmp->id_cliente,
                'cliente' => $rTmp->cliente
            );
        }
    }
    $res['productos_operacion'] = $arr;
}

if (isset($_GET['add_produto'])) {
    if ($intIdProducto > 0) {
        if ($intIdOperation == 2) {
            $strQuery = "   UPDATE tmk_ventas.cat_producto
                            SET id_cliente = {$intIdCliente},
                                descripcion = '{$strNombre}',
                                estado = {$intEstado},
                                fecha_edit = CURRENT_TIMESTAMP()
                            WHERE id_producto = {$intIdProducto}";
            $qTmp = $con->db_consulta($strQuery);
        }
    } else {
        if ($intIdOperation == 2) {
            $strQuery = "   INSERT INTO tmk_ventas.cat_producto(id_cliente, descripcion, estado)
                            VALUES ({$intIdCliente}, '{$strNombre}', {$intEstado})";
            $qTmp = $con->db_consulta($strQuery);
        }
    }

    if ($qTmp) {
        $res['err'] = "false";
        $res['msj'] = "Producto guardado exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un inconveniente!";
    }
}

if (isset($_GET['change_status_product'])) {
    if ($intIdOperation == 2) {
        $strQuery = "   UPDATE tmk_ventas.cat_producto
                        SET estado = {$intEstado},
                            fecha_edit = CURRENT_TIMESTAMP()
                        WHERE id_producto = {$intIdProducto}";
        $qTmp = $con->db_consulta($strQuery);
    }

    if ($qTmp) {
        $res['err'] = 'false';
        $res['msj'] = "Cambios realizados exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

print(json_encode($res));
$_con->db_close();
