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
$intdIdOutboundCorreos = isset($_GET['OUT']) ? intval($_GET['OUT']) : 0;

try {
    $strQuery = "   SELECT a.control, a.fecha_envio, a.email, a.management, 
                        b.name, b.id_usuario,
                        c.sender,
                        d.nombre_completo
                    FROM masivos.dbo.outbound_correos a
                    INNER JOIN masivos.dbo.thread b ON a.id_thread = b.id_thread
                    INNER JOIN masivos.dbo.correos_textos c ON b.id_texto = c.Id_texto
                    INNER JOIN oca_sac.dbo.remesas_cuentas d ON a.control = d.control
                    WHERE a.Id_outbound_correos = {$intdIdOutboundCorreos}";
    $qTmp = $_con->db_consulta($strQuery);
    $rTmp = $_con->db_fetch_assoc($qTmp);
    $_fecha = date('d-m-Y H:m:s', strtotime($rTmp['fecha_envio']));

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPSecure = "ssl";
    $mail->SMTPAuth = true;

    $mail->Host = "mail.ocacall.com"; // SMTP a utilizar. Por ej. smtp.elserver.com
    $mail->Username = "helpdesk@ocacall.com"; // Correo completo a utilizar
    $mail->Password = "Ge@FAG8C8km-QC9fNAb9x@XT5b!ytHRk3nK7FN4hq=9dQ"; // Contraseña

    // $mail->Host = "smtp.gmail.com";
    // $mail->Username = "mortegalex27@gmail.com";
    // $mail->Password = "**********";

    $mail->Port = 465; // Puerto a utilizar
    $mail->From = "sistema@ocacall.com"; // Desde donde enviamos (Para mostrar)
    $mail->FromName = "NOTIFICACION DE RECEPCION DE CORREO";
    $mail->Subject = "CORREO LEIDO"; // Este es el titulo del email.
    $mail->IsHTML(true); // El correo se envía como HTML

    // $mail->AddAddress($rTmp['sender']); // Esta es la dirección a donde enviamos
    $mail->AddAddress("mortegalex27@gmail.com");

    // foreach ($arrCopi as $key => $email) {
    //     $mail->AddCC("{$email}"); // Copia
    // }

    /*$mail->AddAddress("mortegalex27@gmail.com");
    $mail->AddBCC("m.ortega@ocacall.com");*/

    $mail->Body = "<p>
                        <b>Fecha_envio: " . $_fecha . "</b>
                        <b>Email: " . $rTmp['email'] . " </b>
                        <b>Control: " . $rTmp['control'] . "</b>
                        <b>Nombre: " . $rTmp['nombre_completo'] . "</b>
                        <b>Lote: " . $rTmp['name'] . "</b>
                        El cliente a leido el correo.
                    </p>";

    // foreach ($adjuntos as $key => &$adjunto) {
    //     $mail->AddAttachment("public/" . $adjunto['path'], $adjunto['name']);
    // }

    $mail->CharSet = 'UTF-8';
    $exito = $mail->Send(); //Envía el correo.

    if ($exito) {
        // echo json_encode("El correo fue enviado correctamente.");
        $strQuery = "   UPDATE masivos.dbo.outbound_correos
                        SET enviado  = 2
                        WHERE Id_outbound_correos = {$intdIdOutboundCorreos}";
        $_con->db_consulta($strQuery);
        $_arr = array(
            'id_usuario' =>  $rTmp['id_usuario'],
            'control' => $rTmp['control'],
            'gestion' => "LECTURA DE CORREO " . $rTmp['management']
        );
        insertManagement($_arr, $_con);

        $_img = "../../public/img/ocaicon.png";
        if (file_exists($_img)) {
            header('Content-Type: image/png');
            readfile($_img);
            exit;
        } else {
            echo "no existe:" . $_img;
        }

    } else {
        echo json_encode("Hubo un inconveniente. Contacta a un administrador.");
    }

} catch (Exception $e) {
    print(json_encode('Excepción capturada: ' . $e->getMessage()));
}
