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
$intIdTexto = isset($_POST['id_texto']) ? intval($_POST['id_texto']) : 0;
$strSubject = isset($_POST['subject']) ? mb_convert_encoding(trim($_POST['subject']), "UTF-8") : '';
$strBody = isset($_POST['body']) ? mb_convert_encoding(trim($_POST['body']), "UTF-8") : '';
$strDescripcion = isset($_POST['descripcion']) ? mb_convert_encoding(trim($_POST['descripcion']), "UTF-8") : '';
$strSender = isset($_POST['sender']) ? trim($_POST['sender']) : '';
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;

if (isset($_GET['get'])) {
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
    $res['clientes'] = $arr;
}

if (isset($_GET['get_activos'])) {
    $strQuery = "   SELECT id_cliente, nombre
                    FROM oca_sac.dbo.clientes
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
    $arr[] = array(
        'id_cliente' => '',
        'nombre' => '-- LIMPIAR TODO --',
    );
    $res['clientes_activos'] = $arr;
}

if (isset($_GET['get_productos_cliente'])) {
    $strQuery = "   SELECT id_producto, descripcion AS nombre
                    FROM oca_sac.dbo.productos
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
                    FROM masivos.dbo.correos_textos
                    WHERE id_cliente = {$intIdCliente}
                    AND suspendido = 0
                    AND individual = 0
                    ORDER BY nombre";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_texto' => $rTmp->id_texto,
            'nombre' => mb_convert_encoding(($rTmp->nombre), "UTF-8"),
            'body' => mb_convert_encoding(($rTmp->body), "UTF-8"),
        );
    }
    $arr[] = array(
        'id_texto' => '',
        'nombre' => "-- LIMPIAR TODO --",
        'body' => '',
    );
    $res['textos_cliente'] = $arr;
}

if (isset($_GET['get_textos'])) {
    $strQuery = "   SELECT a.id_texto, a.subject, a.body, a.descripcion, sender, individual, a.suspendido,
                        b.id_cliente, b.nombre
                    FROM masivos.dbo.correos_textos a
                    INNER JOIN oca_sac.dbo.clientes b ON a.id_cliente = b.id_cliente
                    ORDER BY b.nombre, a.descripcion, a.subject";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_texto' => $rTmp->id_texto,
            'subject' => mb_convert_encoding(($rTmp->subject), "UTF-8"),
            'body' => mb_convert_encoding(($rTmp->body), "UTF-8"),
            'descripcion' => mb_convert_encoding(($rTmp->descripcion), "UTF-8"),
            'sender' => $rTmp->sender,
            'individual' => $rTmp->individual,
            'estado' => $rTmp->suspendido,
            'id_cliente' => $rTmp->id_cliente,
            'nombre' => $rTmp->nombre,
        );
    }
    $res['textos'] = $arr;
}

if (isset($_GET['add_text'])) {
    if ($intIdTexto > 0) {
        $strQuery = "   UPDATE masivos.dbo.correos_textos
                        SET id_cliente = $intIdCliente,
                            subject = '{$strSubject}',
                            body = '{$strBody}',
                            descripcion = '{$strDescripcion}',
                            sender = '{$strSender}',
                            individual = 0,
                            suspendido = {$intEstado}
                        WHERE Id_texto = {$intIdTexto}";
    } else {
        $strQuery = "   INSERT INTO masivos.dbo.correos_textos (id_cliente, subject, body, descripcion, sender, individual, suspendido)
                        VALUES ({$intIdCliente}, '{$strSubject}', '{$strBody}', '{$strDescripcion}', '{$strSender}', {$intEstado})";
    }

    if ($_con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Texto guardado exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['change_status_text'])) {
    $strQuery = "   UPDATE masivos.dbo.correos_textos
                    SET suspendido = {$intEstado}
                    WHERE id_texto = {$intIdTexto}";
    if ($_con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Cambios realizados exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

print(json_encode($res));
$_con->db_close();
