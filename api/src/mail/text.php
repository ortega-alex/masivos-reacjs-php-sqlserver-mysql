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
$intIdTexto = isset($_POST['id_texto']) ? intval($_POST['id_texto']) : 0;
$strSubject = isset($_POST['subject']) ? mb_convert_encoding(trim($_POST['subject']), "UTF-8") : '';
$strBody = isset($_POST['body']) ? mb_convert_encoding(trim($_POST['body']), "UTF-8") : '';
$strDescripcion = isset($_POST['descripcion']) ? mb_convert_encoding(trim($_POST['descripcion']), "UTF-8") : '';
$strSender = isset($_POST['sender']) ? trim($_POST['sender']) : '';
$intEstado = isset($_POST['estado']) ? intval($_POST['estado']) : 0;
$intIdImage = isset($_POST['id_image']) ? intval($_POST['id_image']) : 0;

if (isset($_GET['get'])) {
    // COBROS
    $strQuery = "   SELECT a.id_texto, a.subject, a.body, a.descripcion, a.sender,
                        a.individual, a.suspendido,
                        b.id_cliente, b.nombre,
                        c.id_operation, c.name AS operacion
                    FROM masivos.dbo.correos_textos a
                    INNER JOIN oca_sac.dbo.clientes b ON a.id_cliente = b.id_cliente
                    INNER JOIN masivos.dbo.operation c ON a.id_operation = c.id_operation
                    WHERE b.suspendido = 0
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
            'id_operation' => $rTmp->id_operation,
            'operacion' => $rTmp->operacion,
        );
    }

    //TMK
    $strQuery = "   SELECT a.id_texto, a.subject, a.body, a.descripcion, a.sender,
                        a.individual, a.suspendido, a.id_cliente,
                        b.id_operation, b.name AS operacion
                    FROM masivos.dbo.correos_textos a
                    INNER JOIN masivos.dbo.operation b ON a.id_operation = b.id_operation
                    WHERE a.id_operation = 2";
    $qTmp = $_con->db_consulta($strQuery);
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $strQuery1 = "  SELECT descripcion  AS nombre
                        FROM tmk_ventas.cat_clientes
                        WHERE id_cliente = {$rTmp->id_cliente}
                        AND estado = 1";
        $qTmp1 = $con->db_consulta($strQuery1);
        if ($con->db_num_rows($qTmp1) > 0) {
            $rTmp1 = $con->db_fetch_object($qTmp1);
            $arr[] = array(
                'id_texto' => $rTmp->id_texto,
                'subject' => mb_convert_encoding(($rTmp->subject), "UTF-8"),
                'body' => mb_convert_encoding(($rTmp->body), "UTF-8"),
                'descripcion' => mb_convert_encoding(($rTmp->descripcion), "UTF-8"),
                'sender' => $rTmp->sender,
                'individual' => $rTmp->individual,
                'estado' => $rTmp->suspendido,
                'id_cliente' => $rTmp->id_cliente,
                'nombre' => $rTmp1->nombre,
                'id_operation' => $rTmp->id_operation,
                'operacion' => $rTmp->operacion,
            );
        }
    }

    $res['textos'] = $arr;
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

if (isset($_GET['add'])) {
    if ($intIdTexto > 0) {
        $strQuery = "   UPDATE masivos.dbo.correos_textos
                        SET id_cliente = {$intIdCliente},
                            id_operation = {$intIdOperation},
                            subject = '{$strSubject}',
                            body = '{$strBody}',
                            descripcion = '{$strDescripcion}',
                            sender = '{$strSender}',
                            individual = 0,
                            suspendido = {$intEstado}
                        WHERE Id_texto = {$intIdTexto}";
    } else {
        $strQuery = "   INSERT INTO masivos.dbo.correos_textos (id_cliente, id_operation, subject, body, descripcion, sender, individual, suspendido)
                        VALUES ({$intIdCliente}, {$intIdOperation}, '{$strSubject}', '{$strBody}', '{$strDescripcion}', '{$strSender}', 0, {$intEstado})";
    }
    print($strQuery);

    if ($_con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Texto guardado exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

if (isset($_GET['change_status'])) {
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

if (isset($_GET['get_images'])) {
    $strQuery = "   SELECT id_image, title, value, fecha, estado
                    FROM masivos.dbo.image
                    ORDER BY fecha ";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_image' => $rTmp->id_image,
            'title' => mb_convert_encoding(($rTmp->title), "UTF-8"),
            'value' => $rTmp->value,
            'fecha' => date('d-m-Y', strtotime($rTmp->fecha)),
            'estado' => $rTmp->estado,
        );
    }
    $res['images'] = $arr;
}

if (isset($_GET['get_images_activas'])) {
    $strQuery = "   SELECT id_image, title, value
                    FROM masivos.dbo.image
                    WHERE estado = 0
                    ORDER BY fecha ";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'id_image' => $rTmp->id_image,
            'title' => mb_convert_encoding(($rTmp->title), "UTF-8"),
            'value' => $_url . $rTmp->value,
        );
    }
    $res['images_activas'] = $arr;
}

if (isset($_GET['add_image'])) {
    if (sizeof($_FILES) > 0) {
        $_name = $_FILES['file']['name'];
        $_file = time() . "." . substr(strrchr($_name, "."), 1);
        $_url = "../../public/img/" . $_file;

        $_MV = move_uploaded_file($_FILES['file']['tmp_name'], $_url);
        if (!empty($_MV)) {
            $strQuery = "   INSERT INTO masivos.dbo.image (title, value)
                            VALUES ('{$_name}', '{$_file}')";

            if ($_con->db_consulta($strQuery)) {
                $res['err'] = 'false';
                $res['msj'] = "Carga realizada exitosamente!";
            }
        }
    } else {
        $res['msj'] = "No se pudo recuperar informacion de archivo!";
    }
}

if (isset($_GET['change_status_image'])) {
    $strQuery = "   UPDATE masivos.dbo.image
                    SET estado = {$intEstado}
                    WHERE id_image = {$intIdImage}";
    if ($_con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Cambios realizados exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

print(json_encode($res));
$_con->db_close();
