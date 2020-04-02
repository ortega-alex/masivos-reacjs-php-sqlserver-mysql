<?php

require_once "../../libs/phpmailer/class.phpmailer.php";
require_once "../../libs/phpmailer/class.smtp.php";
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

$dtDateStart = isset($_POST['date_start']) ? date('Y-m-d', strtotime($_POST['date_start'])) : date('Y-m-d');
$dtDateEnd = isset($_POST['date_end']) ? date('Y-m-d H:m:s', strtotime($_POST['date_end'] . " 23:59:59")) : date('Y-m-d') . " 23:59:59";

$strOrigen = isset($_POST['origin']) ? trim($_POST['origin']) : 'sistema@ocacall.com';
$strTitle = isset($_POST['title']) ? trim($_POST['title']) : 'Pruebas';
$strSubTitle = isset($_POST['subtitle']) ? trim($_POST['subtitle']) : 'prueba';
$arrDestination = isset($_POST['destination']) ? explode(',', $_POST['destination']) :
array('m.ortega@ocacall.oca', 'mortegalex27@gmail.com', 'ortegalexbleach@gmail.com', 'mortegalex27@outlook.es');
$strBody = isset($_POST['body']) ? trim($_POST['body']) : '<b>Esto es una prueba</b>';

$strNombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$intIdCliente = isset($_POST['id_cliente']) ? intval($_POST['id_cliente']) : 0;
$intIdProducto = isset($_POST['id_producto']) ? intval($_POST['id_producto']) : 0;
$intIdTexto = isset($_POST['id_texto']) ? intval($_POST['id_texto']) : 0;
$strTexto = isset($_POST['texto']) ? trim($_POST['texto']) : '';
$intIdUsuario = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;
$intIdThread = isset($_POST['id_thread']) ? intval($_POST['id_thread']) : 1;

if (isset($_GET['get'])) {
    $strQuery = "SELECT a.Id_outbound_correos, a.control, a.email, a.enviado, a.fecha_envio, a.fecha_creacion, a.id_thread,
                    b.id_texto, b.descripcion,
                    c.id_usuario, c.login AS usuario,
                    d.nombre AS cliente
                FROM masivos..outbound_correos a
                INNER JOIN masivos..correos_textos b ON a.id_texto = b.Id_texto
                INNER JOIN oca_sac..usuarios c ON a.id_usuario_envia = c.id_usuario
                INNER JOIN oca_sac..clientes d ON b.id_cliente  = d.id_cliente
                WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                ORDER BY a.fecha_envio, a.email, c.login";
    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $arr[] = array(
            'Id_outbound_correos' => $rTmp->Id_outbound_correos,
            'control' => $rTmp->control,
            'email' => $rTmp->email,
            'enviado' => $rTmp->enviado,
            'fecha_envio' => !empty($rTmp->fecha_envio) ? date('d-m-Y H:m:s', strtotime($rTmp->fecha_envio)) : null,
            'fecha_creacion' => date('d-m-Y H:m:s', strtotime($rTmp->fecha_creacion)),
            'id_thread' => $rTmp->id_thread,
            'id_texto' => $rTmp->id_texto,
            'descripcion' => $rTmp->descripcion,
            'id_usuario' => $rTmp->id_usuario,
            'usuario' => $rTmp->usuario,
            'cliente' => $rTmp->cliente,
        );
    }
    $res['mails'] = $arr;
}

if (isset($_GET['lot'])) {
    // if ($intIdThread <= 0) {
    //     $strQuery = "   INSERT INTO masivos.dbo.thread (id_usuario, id_cliente, id_producto, id_texto, name)
    //                     VALUES ({$intIdUsuario}, {$intIdCliente}, {$intIdProducto}, {$intIdTexto}, '{$strNombre}')";
    //     if ($_con->db_consulta($strQuery)) {
    //         $strQuery = "   SELECT IDENT_CURRENT('masivos.dbo.thread') AS id";
    //         $qTmp = $_con->db_consulta($strQuery);
    //         $rTmp = $_con->db_fetch_assoc($qTmp);
    //         $intIdThread = $rTmp['id'];
    //     }
    // }

    // $strQuery = "   SELECT a.id_remesa, b.no_linea, b.control
    //                 FROM oca_sac.dbo.remesas a
    //                 INNER JOIN oca_sac.dbo.remesas_cuentas b ON a.id_remesa = b.id_remesa
    //                 INNER JOIN oca_sac.dbo.gestiones_claves c ON b.id_gestion_clave  = c.id_gestion_clave
    //                 WHERE c.id_gestion_clave  NOT IN(2, 14, 17, 19, 24, 27, 33, 125, 127)
    //                 AND a.id_cliente = {$intIdCliente}
    //                 AND a.id_producto = {$intIdProducto}";

    // $qTmp = $_con->db_consulta($strQuery);
    // $arr = array();
    // $index = 0;
    // $count = 0;
    // while ($rTmp = $_con->db_fetch_object($qTmp)) {
    //     $strQuery1 = "  SELECT valor
    //                     FROM oca_sac.dbo.remesas_cuentas_campos_adicionales
    //                     WHERE valor LIKE'%@%'
    //                     AND id_remesa = {$rTmp->id_remesa}
    //                     AND no_linea = {$rTmp->no_linea}";
    //     $qTmp1 = $_con->db_consulta($strQuery1);
    //     $arrEmails = array();
    //     $_index = 0;

    //     while ($rTmp1 = $_con->db_fetch_object($qTmp1)) {
    //         if (istAValidEmail($rTmp1->valor)) {
    //             $arrEmails[$_index] = $rTmp1->valor;
    //             $_index++;
    //         }
    //     }

    //     if (sizeof($arrEmails) > 0) {
    //         $emails = implode(',', $arrEmails);
    //         $intEnviado = 0;
    //     } else {
    //         $emails = "No valido o no cuenta con correo";
    //         $intEnviado = 4;
    //     }

    //     if ($count >= 100) {
    //         $index++;
    //         $count = 0;
    //     }

    //     $arr[$index][$count] = "('{$rTmp->control}', '{$emails}', {$intIdTexto}, {$intIdUsuario}, {$intEnviado}, NULL, {$intIdThread})";
    //     $count++;
    // }

    // foreach ($arr as $key => $value) {
    //     $VALUES = implode(',', $value);
    //     $strQuery = "   INSERT INTO masivos.dbo.outbound_correos (control, email, id_texto , id_usuario_envia, enviado, fecha_envio, id_thread )
    //                     VALUES {$VALUES}";
    //     $qTmp = $_con->db_consulta($strQuery);
    // }

    $strQuery = "   SELECT email
                    FROM masivos.dbo.outbound_correos
                    WHERE enviado = 0
                    AND id_thread = {$intIdThread}";

    $qTmp = $_con->db_consulta($strQuery);

    $arr = array();
    $index = 0;
    $count = 0;
    while ($rTmp = $_con->db_fetch_object($qTmp)) {

        if ($count >= 100) {
            $index++;
            $count = 0;
        }

        $arr[$index][$count] = $rTmp->email;
        $count++;
    }

    $strQuery = "   SELECT a.id_thread, a.name,
                        b.Id_texto , b.subject, b.body, b.sender
                    FROM masivos.dbo.thread a
                    INNER JOIN masivos.dbo.correos_textos b ON a.id_texto = b.Id_texto
                    WHERE a.id_thread = {$intIdThread}
                    AND a.id_usuario = {$intIdUsuario}";
    $qTmp = $_con->db_consulta($strQuery);
    $rTmp = $_con->db_fetch_assoc($qTmp);
    $arrThread = array(
        'id_thread' => $rTmp['id_thread'],
        'name' => mb_convert_encoding(($rTmp['name']), "UTF-8"),
        'id_texto' => $rTmp['Id_texto'],
        'subject' => mb_convert_encoding(($rTmp['subject']), "UTF-8"),
        'body' => mb_convert_encoding(($rTmp['body']), "UTF-8"),
        'sender' => $rTmp['sender']
    );
    $res['lote'] = $arr;
    $res['thread'] = $arrThread;
}

if (isset($_GET['send'])) {
    try {
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->SMTPSecure = "ssl";
        $mail->SMTPAuth = true;

        $mail->Host = "mail.ocacall.com"; // SMTP a utilizar. Por ej. smtp.elserver.com
        $mail->Username = "helpdesk@ocacall.com"; // Correo completo a utilizar
        $mail->Password = "Ge@FAG8C8km-QC9fNAb9x@XT5b!ytHRk3nK7FN4hq=9dQ"; // Contraseña

        $mail->Port = 465; // Puerto a utilizar
        $mail->From = $strOrigen; // Desde donde enviamos (Para mostrar)
        $mail->FromName = $strTitle;
        $mail->Subject = $strSubTitle; // Este es el titulo del email.
        $mail->IsHTML(true); // El correo se envía como HTML

        $mail->Body = $strBody; // mensaje

        foreach ($arrDestination as $key => &$_mail) {
            $mail->AddAddress($_mail); // Esta es la dirección a donde enviamos

            $mail->CharSet = 'UTF-8';
            $exito = $mail->Send(); //Envía el correo.

            if ($exito) {
                echo json_encode("El correo fue enviado correctamente.");
                $mail->clearAddresses();
            } else {
                echo json_encode("Hubo un inconveniente. Contacta a un administrador.");
            }
        }

    } catch (Exception $e) {
        print(json_encode('Excepción capturada: ' . $e->getMessage()));
    }
}

print(json_encode($res));
$_con->db_close();
