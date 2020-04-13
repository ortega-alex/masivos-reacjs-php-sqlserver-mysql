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
// require_once '../config/dbClassMysql.php';
// $_con = new dbClassMysql();

getHeader();
$res['err'] = "true";
$res['msj'] = "404 Pagina no en_contrada";

$_date = new DateTime();
$_date->modify('first day of this month');
$_dtDateStart = $_date->format('Y-m-d');
$_date->modify('last day of this month');
$_dtDateEnd = $_date->format('Y-m-d');

$dtDateStart = isset($_POST['date_start']) ? date('Y-m-d', strtotime($_POST['date_start'])) : $_dtDateStart;
$dtDateEnd = isset($_POST['date_end']) ? date('Y-m-d H:m:s', strtotime($_POST['date_end'] . " 23:59:59")) : $_dtDateEnd . " 23:59:59";

$objThread = isset($_POST['thread']) ? json_decode($_POST['thread']) : null;
$arrLote = isset($_POST['lote']) ? json_decode($_POST['lote']) : null;

$intIdCliente = isset($_POST['id_cliente']) ? intval($_POST['id_cliente']) : 0;
$intIdProducto = isset($_POST['id_producto']) ? intval($_POST['id_producto']) : 0;
$intIdTexto = isset($_POST['id_texto']) ? intval($_POST['id_texto']) : 0;
$strTexto = isset($_POST['texto']) ? trim($_POST['texto']) : '';
$intIdUsuario = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;
$intIdThread = isset($_POST['id_thread']) ? intval($_POST['id_thread']) : 0;
$intGetThread = isset($_POST['get_thread']) ? intval($_POST['get_thread']) : 0;
$intStatus = isset($_POST['status']) ? intval($_POST['status']) : 0;
$intEnviado = isset($_POST['enviado']) ? intval($_POST['enviado']) : 0;

if (isset($_GET['get'])) {
    $strQuery = "   SELECT a.Id_outbound_correos, a.control, a.email, a.enviado, a.fecha_envio, a.fecha_creacion, a.id_thread,
                        b.id_texto, b.descripcion,
                        c.id_usuario, c.login AS usuario,
                        d.nombre AS cliente,
                        e.id_gestion_clave, e.descripcion AS gestion
                    FROM masivos.dbo.outbound_correos a
                    INNER JOIN masivos.dbo.correos_textos b ON a.id_texto = b.Id_texto
                    INNER JOIN oca_sac.dbo.usuarios c ON a.id_usuario_envia = c.id_usuario
                    INNER JOIN oca_sac.dbo.clientes d ON b.id_cliente  = d.id_cliente
                    INNER JOIN oca_sac.dbo.gestiones_claves e ON a.id_gestion_clave = e.id_gestion_clave
                    WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                    AND id_thread = {$intIdThread}
                    AND enviado = {$intEnviado}
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
            'id_gestion_clave' => $rTmp->id_gestion_clave,
            'gestion' => $rTmp->gestion,
        );
    }
    $res['mails'] = $arr;
}

if (isset($_GET['add_lot'])) {
    if ($intGetThread == 0) {
        $strQuery = "   SELECT a.nombre, b.descripcion AS produto, c.descripcion  AS texto
                        FROM oca_sac.dbo.clientes a
                        INNER JOIN oca_sac.dbo.productos b ON a.id_cliente = b.id_cliente
                        INNER JOIN masivos.dbo.correos_textos c ON a.id_cliente = c.id_cliente
                        WHERE a.id_cliente = {$intIdCliente}
                        AND b.id_producto = {$intIdProducto}
                        AND c.Id_texto = {$intIdTexto}";
        $qTmp = $_con->db_consulta($strQuery);
        $rTmp = $_con->db_fetch_assoc($qTmp);
        $strNombre = $rTmp['nombre'] . "/" . $rTmp['produto'] . "/" . $rTmp['texto'];

        $strQuery = "   INSERT INTO masivos.dbo.thread (id_usuario, Id_texto, id_cliente, id_producto, name, send, percentage)
                        VALUES ( {$intIdUsuario}, {$intIdTexto}, {$intIdCliente}, {$intIdProducto}, '{$strNombre}', 0, 0)";
        if ($_con->db_consulta($strQuery)) {
            $intIdThread = $_con->db_last_id('masivos.dbo.thread');
        }
    }

    $strQuery = "   SELECT a.id_remesa,
                          b.no_linea, b.control,
                          c.id_gestion_clave
                    FROM oca_sac.dbo.remesas a
                    INNER JOIN oca_sac.dbo.remesas_cuentas b ON a.id_remesa = b.id_remesa
                    INNER JOIN oca_sac.dbo.gestiones_claves c ON b.id_gestion_clave  = c.id_gestion_clave
                    WHERE c.id_gestion_clave  NOT IN(2, 14, 17, 19, 24, 27, 33, 125, 127)
                    AND a.id_cliente = {$intIdCliente}
                    AND a.id_producto = {$intIdProducto}";

    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    $index = 0;
    $count = 0;
    while ($rTmp = $_con->db_fetch_object($qTmp)) {
        $strQuery1 = "  SELECT valor
                        FROM oca_sac.dbo.remesas_cuentas_campos_adicionales
                        WHERE valor LIKE'%@%'
                        AND id_remesa = {$rTmp->id_remesa}
                        AND no_linea = {$rTmp->no_linea}";
        $qTmp1 = $_con->db_consulta($strQuery1);
        $arrEmails = array();
        $_index = 0;
        $_no_valido = "";

        while ($rTmp1 = $_con->db_fetch_object($qTmp1)) {
            if (istAValidEmail($rTmp1->valor)) {
                $arrEmails[$_index] = $rTmp1->valor;
                $_index++;
            } else {
                $_no_valido .= " Correo:" . $rTmp1->valor . ". ";
            }
        }

        if (sizeof($arrEmails) > 0) {
            $emails = implode(',', $arrEmails);
            $intEnviado = 0;
        } else {
            $emails = "Correos no validos o inexistentes: " . $_no_valido;
            $intEnviado = 3;
        }

        if ($count >= 150) {
            $index++;
            $count = 0;
        }

        $arr[$index][$count] = "('{$rTmp->control}', '{$emails}', {$intIdTexto}, {$intIdUsuario}, {$intEnviado}, NULL, {$intIdThread}, {$rTmp->id_gestion_clave})";
        $count++;
    }

    foreach ($arr as $key => $value) {
        $VALUES = implode(',', $value);
        $strQuery = "   INSERT INTO masivos.dbo.outbound_correos (control, email, id_texto , id_usuario_envia, enviado, fecha_envio, id_thread, id_gestion_clave )
                        VALUES {$VALUES}";
        $qTmp = $_con->db_consulta($strQuery);
    }

    $strQuery = "   SELECT a.Id_outbound_correos, a.email,
                        b.id_producto, b.id_cliente,
                        c.control, c.no_cuenta AS cuenta, c.nombre_completo AS nombre, c.direccion, c.llave3 AS tarjeta
                    FROM masivos.dbo.outbound_correos a
                    INNER JOIN masivos.dbo.thread b ON a.id_thread = b.id_thread
                    INNER JOIN oca_sac.dbo.remesas_cuentas c ON a.control = c.control
                    WHERE a.enviado = 0
                    AND a.id_thread = {$intIdThread}";

    $qTmp = $_con->db_consulta($strQuery);

    $arr = array();
    $index = 0;
    $count = 0;
    while ($rTmp = $_con->db_fetch_object($qTmp)) {

        if ($count >= 100) {
            $index++;
            $count = 0;
        }

        if (($rTmp->id_producto == 232 || $rTmp->id_producto == 211 || $rTmp->id_producto == 185) ||
            ($rTmp->id_producto == 52 && !empty($rTmp->tarjeta) && trim($rTmp->tarjeta) != '' && $rTmp->tarjeta != null)) {

            $_leng = strlen($rTmp->tarjeta);
            if ($_leng > 0 && $rTmp->id_cliente != 46) {
                $_inicio = substr($rTmp->tarjeta, 0, 4);
                $_fin = substr($rTmp->tarjeta, ($_leng - 4), $_leng);
                $_cuerpo = '';
                for ($i = 4; $i < ($_leng - 4); $i++) {
                    $_cuerpo .= 'X';
                }
                $cuenta = $_inicio . '-' . $_cuerpo . '-' . $_fin;
            }

            $destinatario = 'Tarjeta-habiente';
            $tipo = 'TARJETA ';
        } else {

            $_leng = strlen($rTmp->cuenta);
            if ($_leng > 0 && $rTmp->id_cliente != 46) {
                $_inicio = substr($rTmp->cuenta, 0, 2);
                $_fin = substr($rTmp->cuenta, 6, $_leng);
                $cuenta = $_inicio . "XXXX" . $_fin;
            } else {
                $cuenta = $rTmp->cuenta;
            }
            $destinatario = 'Cliente';
            $tipo = 'CUENTA ';
        }

        $arr[$index][] = array(
            'Id_outbound_correos' => $rTmp->Id_outbound_correos,
            'email' => $rTmp->email,
            'control' => $rTmp->control,
            'nombre' => $rTmp->nombre,
            'direccion' => $rTmp->direccion,
            'cuenta' => $cuenta,
            'destinatario' => $destinatario,
            'tipo' => $tipo,
        );
        $count++;
    }

    $_length = sizeof($arr);
    $strQuery = "   UPDATE masivos.dbo.thread
                    SET length = {$_length}
                    WHERE id_thread = {$intIdThread}";
    $_con->db_consulta($strQuery);

    $strQuery = "   SELECT a.id_thread, a.name, a.send, a.percentage, status,
                        b.Id_texto , b.subject, b.body, b.sender,
                        c.id_usuario, c.login
                    FROM masivos.dbo.thread a
                    INNER JOIN masivos.dbo.correos_textos b ON a.id_texto = b.Id_texto
                    INNER JOIN oca_sac.dbo.usuarios c ON a.id_usuario = c.id_usuario
                    WHERE a.id_thread = {$intIdThread}";
    $qTmp = $_con->db_consulta($strQuery);
    $rTmp = $_con->db_fetch_assoc($qTmp);
    $arrThread = array(
        'id_thread' => $rTmp['id_thread'],
        'name' => mb_convert_encoding(($rTmp['name']), "UTF-8"),
        'id_texto' => $rTmp['Id_texto'],
        'subject' => mb_convert_encoding(($rTmp['subject']), "UTF-8"),
        'body' => mb_convert_encoding(($rTmp['body']), "UTF-8"),
        'sender' => $rTmp['sender'],
        'send' => $rTmp['send'],
        'percentage' => $rTmp['percentage'],
        'length' => $_length,
        'status' => $rTmp['status'],
        'id_usuario' => $rTmp['id_usuario'],
        'usuario' => $rTmp['login'],
    );
    $res['lote'] = $arr;
    $res['thread'] = $arrThread;
}

if (isset($_GET['send'])) {

    try {
        $strQuery = "   SELECT status
                        FROM masivos.dbo.thread
                        WHERE id_thread = {$objThread->id_thread}";
        $qTmp = $_con->db_consulta($strQuery);
        $rTmp = $_con->db_fetch_assoc($qTmp);
        if ($rTmp['status'] == 1) {
            $res['pausar'] = "true";
            $res['thread'] = $objThread;
        } else {
            // $mail = new PHPMailer();
            // $mail->IsSMTP();
            // $mail->SMTPSecure = "ssl";
            // $mail->SMTPAuth = true;

            // $mail->Host = "mail.ocacall.com"; // SMTP a utilizar. Por ej. smtp.elserver.com
            // $mail->Username = "helpdesk@ocacall.com"; // Correo completo a utilizar
            // $mail->Password = "Ge@FAG8C8km-QC9fNAb9x@XT5b!ytHRk3nK7FN4hq=9dQ"; // Contraseña

            // $mail->Port = 465; // Puerto a utilizar
            // $mail->From = $objThread->sender; // Desde donde enviamos (Para mostrar)
            // $mail->FromName = "OCA"; //$strTitle;
            // $mail->Subject = $objThread->subject; // Este es el titulo del email.
            // $mail->IsHTML(true); // El correo se envía como HTML

            // $arr_temp = array(
            //     '$cuenta', '$nombre', '$direccion', '$fecha',
            // );
            // $_fecha = ' ' . date('d') . ' DE ' . nameMonth(date('n')) . ' DE ' . date('Y');
            $fecha = date('Y-m-d H:m:s');
            foreach ($arrLote as $key => &$value) {
                // $_arr = array($value->cuenta, $value->nombre, $value->direccion, $_fecha);

                // $_body = str_replace($arr_temp, $_arr, $objThread->body);
                // $mail->Body = $_body . "<br/><br/> <img src='http://168.234.50.2:8080/dev/masivo/api/src/mail/response.php?OUT=" . $value->Id_outbound_correos . "' />";

                // $mail->AddAddress("{$value->email}");

                $_management = mb_convert_encoding("* TC {$objThread->name} * FCH {$fecha} * CLT {$value->destinatario} {$value->nombre} * {$value->tipo} {$value->cuenta} * ", "UTF-8");
                $_arr = array(
                    'id_usuario' => $objThread->id_usuario,
                    'control' => $value->control,
                    'gestion' => "ENVIO DE CORREO " . $_management,
                );
                insertManagement($_arr, $_con);
                
                $strQuery = "   UPDATE masivos.dbo.outbound_correos
                                SET enviado = 1,
                                    procesado = 1,
                                    management = '{$_management}',
                                    fecha_envio = '{$fecha}'
                                WHERE Id_outbound_correos = {$value->Id_outbound_correos}";
                $_con->db_consulta($strQuery);

                // $mail->CharSet = 'UTF-8';
                // $exito = $mail->Send(); //Envía el correo.

                // if ($exito) {
                //     $mail->clearAddresses();
                // }
            }

            $objThread->send = $objThread->send + 1;
            $objThread->percentage = intval(round(($objThread->send / $objThread->length) * 100));
            if ($objThread->send == $objThread->length) {
                $objThread->status = 1;
            }

            $strQuery = "   UPDATE masivos.dbo.thread
                            SET percentage = {$objThread->percentage},
                                send = {$objThread->send},
                                length = {$objThread->length}
                            WHERE id_thread = {$objThread->id_thread}";
            $_con->db_consulta($strQuery);
            $res['pausar'] = "false";
            $res['thread'] = $objThread;
        }
    } catch (Exception $e) {
        print(json_encode('Excepción capturada: ' . $e->getMessage()));
    }
}

if (isset($_GET['get_threads'])) {
    $strQuery = "    SELECT a.id_thread, a.id_cliente, a.id_producto, a.id_texto, a.name,
                        a.fecha_creacion, a.send, a.percentage, a.length, a.status,
                        b.id_usuario, b.login
                    FROM masivos.dbo.thread a
                    INNER JOIN oca_sac.dbo.usuarios b ON a.id_usuario = b.id_usuario
                    WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                    ORDER BY a.fecha_creacion DESC";

    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {

        $strQuery1 = "  SELECT enviado, COUNT(*) AS total
                        FROM masivos.dbo.outbound_correos
                        WHERE id_thread = $rTmp->id_thread
                        GROUP BY enviado";
        $qTmp1 = $_con->db_consulta($strQuery1);
        $arrDetalle = array();
        while ($rTmp1 = $_con->db_fetch_object($qTmp1)) {
            $arrDetalle[$rTmp1->enviado] = $rTmp1->total;
        }

        $arr[] = array(
            'id_thread' => $rTmp->id_thread,
            'id_cliente' => $rTmp->id_cliente,
            'id_producto' => $rTmp->id_producto,
            'id_texto' => $rTmp->id_texto,
            'fecha_creacion' => date('d-m-Y H:m:s', strtotime($rTmp->fecha_creacion)),
            'name' => mb_convert_encoding($rTmp->name, "UTF-8"),
            // 'name' => $rTmp->name,
            'send' => $rTmp->send,
            'percentage' => $rTmp->percentage,
            'length' => $rTmp->length,
            'status' => $rTmp->status,
            'detalle' => $arrDetalle,
            'id_usuario' => $rTmp->id_usuario,
            'usuario' => $rTmp->login,
        );
    }
    $res['threads'] = $arr;
}

if (isset($_GET['change_status_thread'])) {
    $strQuery = "   UPDATE masivos.dbo.thread
                    SET status = {$intStatus}
                    WHERE id_thread = {$intIdThread}";
    if ($_con->db_consulta($strQuery)) {
        $res['err'] = 'false';
        $res['msj'] = "Cambios realizados exitosamente!";
    } else {
        $res['msj'] = "Ha ocurrido un error!";
    }
}

print(json_encode($res));
$_con->db_close();
