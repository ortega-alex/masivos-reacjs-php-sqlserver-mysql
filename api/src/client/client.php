<?php

require_once '../config/helper.php';
if (extension_loaded('mssql')) {
    require_once '../config/dbClassMSSQL.php';
    $_con = new dbClassMSSQL();
} else {
    require_once '../config/dbClassPDO.php';
    $_con = new dbClassPDO();
}

getHeader();

$res['err'] = "true";
$res['msj'] = "404 Pagina no en_contrada";

$intIdCliente = isset($_POST['id_cliente']) ? intval($_POST['id_cliente']) : 0;

if (isset($_GET['get_activos'])) {
    $strQuery = "   SELECT id_cliente, nombre
                    FROM clientes
                    WHERE suspendido = 0
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_cliente' => $rTmp->id_cliente,
            'nombre' => $rTmp->nombre,
        );
    }
    $res['clientes_activos'] = $arr;
}

if (isset($_GET['get_productos_cliente'])) {
    $strQuery = "   SELECT id_producto, descripcion AS nombre
                    FROM oca_sac..productos
                    WHERE id_cliente = {$intIdCliente}
                    AND suspendido = 0
                    ORDER BY descripcion";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_producto' => $rTmp->id_producto,
            'nombre' => $rTmp->nombre,
        );
    }
    $res['productos_cliente'] = $arr;
}

if (isset($_GET['get_textos_cliente'])) {
    $strQuery = "   SELECT id_texto, descripcion AS nombre, body
                    FROM masivos..correos_textos
                    WHERE id_cliente = {$intIdCliente}
                    AND suspendido = 0
                    AND individual = 0
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_texto' => $rTmp->id_texto,
            'nombre' => $rTmp->nombre,
            'body' => $rTmp->body,
        );
    }
    $res['textos_cliente'] = $arr;
}

print(json_encode($res));
$_con->db_close();
