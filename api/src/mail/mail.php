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
require_once '../config/dbClassMysql.php';
$con = new dbClassMysql();

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

$intIdOperation = isset($_POST['id_operation']) ? intval($_POST['id_operation']) : 0;
$strNombreArchivo = isset($_POST['nombre_archivo']) ? trim($_POST['nombre_archivo']) : "NULL";
$strPath = isset($_POST['path']) ? trim($_POST['path']) : "NULL";
$intIdEstado = isset($_POST['id_estado']) ? intval($_POST['id_estado']) : 0;
$strControl = isset($_POST['control']) ? trim($_POST['control']) : null;

if (isset($_GET['get'])) {
    $_AND = (!empty($strControl) && $strControl != null) ? "AND a.control = '{$strControl}'" : "AND a.id_thread2 = {$intIdThread}";
    $strQuery = "   SELECT a.Id_outbound_correos, a.control, a.email, a.enviado, a.fecha_envio, a.fecha_creacion, management_status,
                        b.id_thread, b.name AS nombre,
                        c.id_usuario, c.login AS usuario                    
                    FROM masivos.dbo.outbound_correos a
                    INNER JOIN masivos.dbo.thread b ON a.id_thread2 = b.id_thread
                    INNER JOIN oca_sac.dbo.usuarios c ON a.id_usuario_envia = c.id_usuario
                    WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                    AND a.enviado = {$intEnviado}
                    {$_AND}
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
            'id_usuario' => $rTmp->id_usuario,
            'usuario' => $rTmp->usuario,
            'gestion' => $rTmp->management_status,
            'nombre' => $rTmp->nombre
        );
    }
    $res['mails'] = $arr;
}

if (isset($_GET['add_lot'])) {
    if ($intGetThread == 0) {
        // COBROS
        if ($intIdOperation == 1) {
            $strQuery = "   SELECT a.nombre AS cliente, b.descripcion AS producto, c.descripcion  AS texto
                            FROM oca_sac.dbo.clientes a
                            INNER JOIN oca_sac.dbo.productos b ON a.id_cliente = b.id_cliente
                            INNER JOIN masivos.dbo.correos_textos c ON a.id_cliente = c.id_cliente
                            WHERE a.id_cliente = {$intIdCliente}
                            AND b.id_producto = {$intIdProducto}
                            AND c.Id_texto = {$intIdTexto}";
            $qTmp = $_con->db_consulta($strQuery);
            $rTmp = $_con->db_fetch_assoc($qTmp);
            $strNombre = $rTmp['cliente'] . "/" . $rTmp['producto'] . "/" . $rTmp['texto'];
        }

        //TMK
        if ($intIdOperation == 2) {
            $strQuery = "   SELECT descripcion  AS texto
                            FROM masivos.dbo.correos_textos
                            WHERE Id_texto = {$intIdTexto}";
            $qTmp = $_con->db_consulta($strQuery);
            $rTmp = $_con->db_fetch_assoc($qTmp);
            $strTexto = $rTmp['texto'];

            $strQuery = "   SELECT a.descripcion AS cliente, b.descripcion AS producto
                            FROM tmk_ventas.cat_clientes a
                            INNER JOIN tmk_ventas.cat_producto b ON a.id_cliente = b.id_cliente
                            WHERE a.id_cliente = {$intIdCliente}
                            AND b.id_producto = {$intIdProducto}";

            $qTmp = $con->db_consulta($strQuery);
            $rTmp = $con->db_fetch_assoc($qTmp);
            $strNombre = $rTmp['cliente'] . "/" . $rTmp['producto'] . "/" . $strTexto;

        }

        $strQuery = "   INSERT INTO masivos.dbo.thread (id_usuario, Id_texto, id_cliente, id_producto, name,
                                                        send, percentage, nombre_archivo, path, id_operation)
                        VALUES ( {$intIdUsuario}, {$intIdTexto}, {$intIdCliente}, {$intIdProducto}, '{$strNombre}',
                                 0, 0, '{$strNombreArchivo}', '{$strPath}', $intIdOperation)";
        if ($_con->db_consulta($strQuery)) {
            $intIdThread = $_con->db_last_id('masivos.dbo.thread');
        }
    }

    if ((!isset($_FILES) || sizeof($_FILES)) == 0 && ($strNombreArchivo == "NULL" || empty($strNombreArchivo) || $strNombreArchivo == null)) {
        //COBROS
        if ($intIdOperation == 1) {
            $_AND = $intIdEstado > 0 ? "AND c.id_gestion_clave = {$intIdEstado}" : "AND c.id_gestion_clave  NOT IN(2, 14, 17, 19, 24, 27, 33, 125, 127)";
            $strQuery = "   SELECT a.id_remesa,
                                b.no_linea, b.control, b.no_cuenta, b.nombre_completo, b.direccion, b.llave3 AS tarjeta,
                                c.id_gestion_clave, c.descripcion,
                                (  SELECT TOP 1 valor AS email
                                    FROM oca_sac.dbo.remesas_cuentas_campos_adicionales
                                    WHERE valor LIKE'%@%'
                                    AND id_remesa = a.id_remesa
                                    AND no_linea = b.no_linea ) AS email
                            FROM oca_sac.dbo.remesas a
                            INNER JOIN oca_sac.dbo.remesas_cuentas b ON a.id_remesa = b.id_remesa
                            INNER JOIN oca_sac.dbo.gestiones_claves c ON b.id_gestion_clave  = c.id_gestion_clave
                            WHERE a.id_cliente = {$intIdCliente}
                            AND a.id_producto = {$intIdProducto}
                            {$_AND}";

            $qTmp = $_con->db_consulta($strQuery);
            while ($rTmp = $_con->db_fetch_object($qTmp)) {
                if (!empty($rTmp->email) && $rTmp->email != null) {
                    if (istAValidEmail($rTmp->email)) {
                        $intEnviado = 0;
                    } else {
                        $intEnviado = 3;
                    }

                    $strQuery1 = "  INSERT INTO masivos.dbo.outbound_correos (control, email, id_texto , id_usuario_envia, enviado, 
                                                                                fecha_envio, id_thread, id_thread2, management_status )
                                    VALUES ('{$rTmp->control}', '{$rTmp->email}', {$intIdTexto}, {$intIdUsuario}, {$intEnviado},
                                             NULL, NULL, {$intIdThread}, '{$rTmp->descripcion}')";
                    if ($_con->db_consulta($strQuery1)) {
                        $intIdOutboundCorreos = $_con->db_last_id('masivos.dbo.outbound_correos');
                        $strQuery1 = "  INSERT INTO masivos.dbo.customer_data ( id_outbound_correos, no_cuenta, nombre_completo, direccion, tarjeta )
                                        VALUES ({$intIdOutboundCorreos}, '{$rTmp->no_cuenta}', '{$rTmp->nombre_completo}', '{$rTmp->direccion}', '{$rTmp->tarjeta}')";
                        $_con->db_consulta($strQuery1);
                    }
                }
            }
        }

        if ($intIdOperation == 2) {
            $_AND = $intIdEstado > 0 ? "AND c.id_sub_estatus = {$intIdEstado}" : "AND c.id_sub_estatus  NOT IN(11,12,16)";
            // G&T/TARJETAS
            if ($intIdCliente == 1 && $intIdProducto == 1) {
                $strQuery = "   SELECT a.control, a.nombre_completo ,
                                    b.direccion_casa AS direccion, b.email,
                                    c.descripcion
                                FROM tmk_ventas.gyt_carga_base a
                                INNER JOIN tmk_ventas.confirmacion_datos b ON a.control = b.control
                                INNER JOIN tmk_ventas.cat_sub_estatus c ON a.sub_estatus = c.id_sub_estatus
                                WHERE a.id_cliente = 1
                                AND a.id_producto = 1
                                AND b.email IS NOT NULL
                                {$_AND}";
            }
            // G&T/PRESTAMOS
            if ($intIdCliente == 1 && $intIdProducto == 2) {
                $strQuery = "   SELECT a.control, a.nombre_completo,
                                    b.direccion_entrega AS direccion, b.email,
                                    c.descripcion
                                FROM  tmk_ventas.gyt_carga_base_prestamos a
                                INNER JOIN tmk_ventas.confirmacion_datos_prestamos b ON a.control = b.control
                                INNER JOIN tmk_ventas.cat_sub_estatus c ON a.sub_estatus = c.id_sub_estatus
                                WHERE a.id_cliente = 1
                                AND a.id_producto = 2
                                AND b.email IS NOT NULL
                                {$_AND}";
            }

            // PROMERICA/TAJETA
            if ($intIdCliente == 2 && $intIdProducto == 3) {
                $strQuery = "   SELECT a.control, a.nombre_completo,
                                    b.direccion_casa AS direccion, b.email,
                                    c.descripcion
                                FROM tmk_tarjetas_promerica.carga_base a
                                INNER JOIN tmk_tarjetas_promerica.confirmacion_datos b ON a.control = b.control
                                INNER JOIN tmk_ventas.cat_sub_estatus c ON a.sub_estatus = c.id_sub_estatus
                                WHERE a.id_cliente = 2
                                AND a.id_producto = 1
                                AND b.email IS NOT NULL
                                {$_AND}";
            }

            if ($intIdCliente == 3 && $intIdProducto == 4) {
                $strQuery = "   SELECT a.control, a.nombre_completo,
                                    c.descripcion
                                FROM sm_sos.carga_base a
                                INNER JOIN sm_sos.cat_sub_estatus c ON a.sub_estatus = c.id_sub_estatus
                                WHERE a.id_cliente = 3
                                AND a.id_producto = 1
                                {$_AND}";
            }

            $qTmp = $con->db_consulta($strQuery);
            while ($rTmp = $con->db_fetch_object($qTmp)) {
                if ((!empty($rTmp->email) && $rTmp->email != null) || $intIdCliente == 3) {
                    if (istAValidEmail($rTmp->email)) {
                        $intEnviado = 0;
                    } else {
                        $intEnviado = 3;
                    }

                    $strQuery1 = "  INSERT INTO masivos.dbo.outbound_correos (control, email, id_texto , id_usuario_envia, enviado,
                                                                                fecha_envio, id_thread, id_thread2, management_status )
                                    VALUES ('{$rTmp->control}', '{$rTmp->email}', {$intIdTexto}, {$intIdUsuario}, {$intEnviado}, NULL, NULL, {$intIdThread}, '{$rTmp->descripcion}')";
                    if ($_con->db_consulta($strQuery1)) {
                        $intIdOutboundCorreos = $_con->db_last_id('masivos.dbo.outbound_correos');
                        $strQuery1 = "  INSERT INTO masivos.dbo.customer_data ( id_outbound_correos, no_cuenta, nombre_completo, direccion, tarjeta )
                                        VALUES ({$intIdOutboundCorreos}, NULL, '{$rTmp->nombre_completo}', '{$rTmp->direccion}', NULL)";
                        $_con->db_consulta($strQuery1);
                    }
                }
            }
        }

    } else {
        // EXCEL
        if (sizeof($_FILES) > 0) {
            $_name = $_FILES['file']['name'];
            $strNombreArchivo = time() . "." . substr(strrchr($_name, "."), 1);
            $strPath = "../../public/file/" . $strNombreArchivo;
            $_MV = move_uploaded_file($_FILES['file']['tmp_name'], $strPath);
        } else {
            $_MV = "M";
        }

        if (!empty($_MV)) {
            require_once '../../libs/PHPExcel.php';
            $inputFileType = PHPExcel_IOFactory::identify($strPath);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($strPath);
            $sheet = $objPHPExcel->getSheet(0);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            for ($row = 2; $row <= $highestRow; $row++) {
                $strControl = trim($sheet->getCell("A" . $row)->getValue());
                $strEmail = trim($sheet->getCell("B" . $row)->getValue());
                $strCuenta = trim($sheet->getCell("C" . $row)->getValue());
                $strNombre = trim($sheet->getCell("D" . $row)->getValue());
                $strDireccion = trim($sheet->getCell("E" . $row)->getValue());
                $strTarjeta = trim($sheet->getCell("F" . $row)->getValue());

                if (istAValidEmail($strEmail)) {
                    $intEnviado = 0;
                } else {
                    $intEnviado = 3;
                }

                $strQuery = "   INSERT INTO masivos.dbo.outbound_correos (control, email, id_texto , id_usuario_envia, enviado,
                                                                            fecha_envio, id_thread, id_thread2, management_status )
                                VALUES ('{$strControl}', '{$strEmail}', {$intIdTexto}, {$intIdUsuario}, {$intEnviado},
                                         NULL, NULL, {$intIdThread}, 'EXCEL')";
                if ($_con->db_consulta($strQuery)) {
                    $intIdOutboundCorreos = $_con->db_last_id('masivos.dbo.outbound_correos');
                    $strQuery = "   INSERT INTO masivos.dbo.customer_data ( id_outbound_correos, no_cuenta, nombre_completo, direccion, tarjeta )
                                    VALUES ({$intIdOutboundCorreos}, '{$strCuenta}', '{$strNombre}', '{$strDireccion}', '{$strTarjeta}')";
                    $_con->db_consulta($strQuery);
                }
            }
        }
    }

    $strQuery = "   SELECT a.Id_outbound_correos, a.email, a.control,
                        b.id_producto, b.id_cliente,
                        c.no_cuenta AS cuenta, c.nombre_completo AS nombre, c.direccion, c.tarjeta
                    FROM masivos.dbo.outbound_correos a
                    INNER JOIN masivos.dbo.thread b ON a.id_thread2 = b.id_thread
                    INNER JOIN masivos.dbo.customer_data c ON a.Id_outbound_correos = c.id_outbound_correos
                    WHERE a.enviado = 0
                    AND a.id_thread2 = {$intIdThread}";

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
        } else {

            $_leng = strlen($rTmp->cuenta);
            if ($_leng > 0 && $rTmp->id_cliente != 46) {
                $_inicio = substr($rTmp->cuenta, 0, 2);
                $_fin = substr($rTmp->cuenta, 6, $_leng);
                $cuenta = $_inicio . "XXXX" . $_fin;
            } else {
                $cuenta = $rTmp->cuenta;
            }
        }

        $arr[$index][] = array(
            'Id_outbound_correos' => $rTmp->Id_outbound_correos,
            'email' => $rTmp->email,
            'control' => $rTmp->control,
            'nombre' => $rTmp->nombre,
            'direccion' => $rTmp->direccion,
            'cuenta' => $cuenta,
        );
        $count++;
    }

    $_length = sizeof($arr);
    $strQuery = "   UPDATE masivos.dbo.thread
                    SET length = {$_length},
                        nombre_archivo = '{$strNombreArchivo}',
                        path = '{$strPath}'
                    WHERE id_thread = {$intIdThread}";
    $_con->db_consulta($strQuery);

    $strQuery = "   SELECT a.id_thread, a.name, a.send, a.percentage, a.status,
                        a.nombre_archivo, a.path, a.fecha_creacion, a.id_operation, a.id_cliente,
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
        'fecha_creacion' => date('d-m-Y H:m:s', strtotime($rTmp['fecha_creacion'])),
        'nombre_archivo' => $rTmp['nombre_archivo'],
        'path' => $rTmp['path'],
        'id_operation' => $rTmp['id_operation'],
        'id_cliente' => $rTmp['id_cliente'],
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
            $mail = new PHPMailer();
            $mail->IsSMTP();
            $mail->SMTPSecure = "ssl";
            $mail->SMTPAuth = true;

            $mail->Host = "mail.ocacall.com"; // SMTP a utilizar. Por ej. smtp.elserver.com
            $mail->Username = "helpdesk@ocacall.com"; // Correo completo a utilizar
            $mail->Password = "Ge@FAG8C8km-QC9fNAb9x@XT5b!ytHRk3nK7FN4hq=9dQ"; // Contraseña

            $mail->Port = 465; // Puerto a utilizar
            $mail->From = $objThread->sender; // Desde donde enviamos (Para mostrar)
            $mail->FromName = "OCA"; //$strTitle;
            $mail->Subject = $objThread->subject; // Este es el titulo del email.
            $mail->IsHTML(true); // El correo se envía como HTML

            $arr_temp = array(
                '$cuenta', '$nombre', '$direccion', '$fecha',
            );
            $_fecha = ' ' . date('d') . ' DE ' . nameMonth(date('n')) . ' DE ' . date('Y');
            $fecha = date('Y-m-d H:m:s');
            foreach ($arrLote as $key => &$value) {
                $_arr = array($value->cuenta, $value->nombre, $value->direccion, $_fecha);
                $_body = str_replace($arr_temp, $_arr, $objThread->body);
                $mail->Body = $_body . "<br/><br/> <img src='http://168.234.50.2:8080/dev/masivo/api/src/mail/response.php?OUT=" . $value->Id_outbound_correos . "' />";

                $mail->AddAddress("{$value->email}");

                $_db = $objThread->id_operation == 1 ? "oca_sac" :
                ($objThread->id_cliente == 1 ? 'tmk_ventas' :
                    ($objThread->id_cliente == 2 ? 'tmk_tarjetas_promerica' : 'sm_sos'));

                $_arr = array(
                    'db' => $_db,
                    'id_operation' => $objThread->id_operation,
                    'id_usuario' => $objThread->id_usuario,
                    'control' => $value->control,
                    'gestion' => "SE ENVIA CORREO ELECTRONICO A: {$value->email}, LT: {$objThread->id_thread}, NMB: {$objThread->name}, FCH: {$objThread->fecha_creacion}. US: {$objThread->usuario}",
                );
                $__con = $objThread->id_operation == 1 ? $_con : $con;
                insertManagement($_arr, $__con);

                $strQuery = "   UPDATE masivos.dbo.outbound_correos
                                SET enviado = 1,
                                    procesado = 1,
                                    fecha_envio = '{$fecha}'
                                WHERE Id_outbound_correos = {$value->Id_outbound_correos}";
                $_con->db_consulta($strQuery);

                $mail->CharSet = 'UTF-8';
                $exito = $mail->Send(); //Envía el correo.

                if ($exito) {
                    $mail->clearAddresses();
                }
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
    $strQuery = "   SELECT a.id_thread, a.id_cliente, a.id_producto, a.id_texto, a.name,
                        a.fecha_creacion, a.send, a.percentage, a.length, a.status,
                        a.nombre_archivo, a.path, a.id_operation,
                        b.id_usuario, b.login,
                        c.id_operation, c.name AS operacion
                    FROM masivos.dbo.thread a
                    INNER JOIN oca_sac.dbo.usuarios b ON a.id_usuario = b.id_usuario
                    INNER JOIN masivos.dbo.operation c ON a.id_operation = c.id_operation
                    WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                    ORDER BY a.fecha_creacion DESC";

    $qTmp = $_con->db_consulta($strQuery);
    $arr = array();
    while ($rTmp = $_con->db_fetch_object($qTmp)) {

        $strQuery1 = "  SELECT enviado, COUNT(*) AS total
                        FROM masivos.dbo.outbound_correos
                        WHERE id_thread2 = $rTmp->id_thread
                        GROUP BY enviado";
        $qTmp1 = $_con->db_consulta($strQuery1);
        $arrDetalle = array();
        $_total = 0;
        while ($rTmp1 = $_con->db_fetch_object($qTmp1)) {
            $arrDetalle[$rTmp1->enviado] = $rTmp1->total;
            $_total += intval($rTmp1->total);
        }

        $arr[] = array(
            'id_thread' => $rTmp->id_thread,
            'id_cliente' => $rTmp->id_cliente,
            'id_producto' => $rTmp->id_producto,
            'id_texto' => $rTmp->id_texto,
            'fecha_creacion' => date('d-m-Y H:m:s', strtotime($rTmp->fecha_creacion)),
            'name' => mb_convert_encoding($rTmp->name, "UTF-8"),
            'send' => $rTmp->send,
            'percentage' => $rTmp->percentage,
            'length' => $rTmp->length,
            'status' => $rTmp->status,
            'id_usuario' => $rTmp->id_usuario,
            'usuario' => $rTmp->login,
            'id_operation' => $rTmp->id_operation,
            'operacion' => $rTmp->operacion,
            'detalle' => $arrDetalle,
            'total' => $_total,
            'nombre_archivo' => $rTmp->nombre_archivo,
            'path' => $rTmp->path,
            'id_operation' => $rTmp->id_operation,
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

if (isset($_GET['get_management_status_act'])) {
    $arr = array();
    if ($intIdOperation == 1) {
        $strQuery = "   SELECT id_gestion_clave, descripcion
                        FROM oca_sac.dbo.gestiones_claves
                        WHERE suspendido = 0
                        ORDER BY descripcion";
        $qTmp = $_con->db_consulta($strQuery);
        while ($rTmp = $_con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_estado' => $rTmp->id_gestion_clave,
                'nombre' => mb_convert_encoding($rTmp->descripcion, "UTF-8"),
            );
        }
    }

    if ($intIdOperation == 2) {
        $_DB = $intIdCliente == 1 ? "tmk_ventas" : ($intIdCliente == 2 ? "tmk_tarjetas_promerica" : "sm_sos");
        $strQuery = "   SELECT id_sub_estatus, descripcion
                        FROM {$_DB}.cat_sub_estatus
                        WHERE estado = 1
                        ORDER BY descripcion ";
        $qTmp = $con->db_consulta($strQuery);
        while ($rTmp = $con->db_fetch_object($qTmp)) {
            $arr[] = array(
                'id_estado' => $rTmp->id_sub_estatus,
                'nombre' => $rTmp->descripcion,
            );
        }
    }
    $res['estados_act'] = $arr;
}

print(json_encode($res));
$_con->db_close();
