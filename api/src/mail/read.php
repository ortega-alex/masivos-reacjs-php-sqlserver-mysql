<?php

ini_set('max_execution_time', 1200);

require_once "../config/helper.php";
if (extension_loaded('mssql')) {
    require_once '../config/dbClassMSSQL.php';
    $_con = new dbClassMSSQL();
} else {
    require_once '../config/dbClassPDO.php';
    $_con = new dbClassPDO();
}
getHeader();

$connection = imap_open('{mail.ocacall.com:993/imap/ssl/novalidate-cert}INBOX', 'm.ortega', '8<fhW;!"ps/gw]GxZ?@?FAvSFM9UUjDt') or die('Cannot connect: ' . imap_last_error());
// $connection = imap_open('{mail.ocacall.com:993/imap/ssl/novalidate-cert}INBOX', 'helpdesk', 'Ge@FAG8C8km-QC9fNAb9x@XT5b!ytHRk3nK7FN4hq=9dQ') or die('Cannot connect: ' . imap_last_error());

$_fecha = strtoupper(date("d-M-Y", strtotime(date('Y-m-d') . "- 1 days")));
$emails = imap_search($connection, 'SINCE "' . $_fecha . '"');
$arr = array();
if (!empty($emails)) {

    foreach ($emails as $emailIdent) {

        // CONTENIDO DEL MAIL
        $overview = imap_fetch_overview($connection, $emailIdent, 0);
        $date = date("d F, Y", strtotime($overview[0]->date)) . "<br/>";

        $subject = '';
        $subject_array = imap_mime_header_decode($overview[0]->subject);
        foreach ($subject_array as $obj) {
            $subject .= utf8_encode(rtrim($obj->text, "t"));
        }

        // CUERTPO DEL MAIL
        $message = imap_fetchbody($connection, $emailIdent, '1');
        $messageExcerpt = substr($message, 0, 500);
        $partialMessage = trim(quoted_printable_decode($messageExcerpt));

        $arr[] = array(
            'de' => $overview[0]->from,
            'fecha' => $date,
            'subject' => utf8_decode($subject),
            'mensaje' => $partialMessage,
        );
    }
}

foreach ($arr as $key => $value) {
    $_rebote = strrpos($value['subject'], 'failure notice');
    $email = null;
    $_out = null;
    if ($_rebote === false) {
        $_rebote = strrpos($value['subject'], '[');
        if ($_rebote === false) {
            echo "";
        } else {
            $_out_arr = explode('[', $value['subject']);
            if (sizeof($_out_arr) > 0) {
                $_out_arr1 = explode(']', $_out_arr['1']);
                if (sizeof($_out_arr1) > 0) {
                    $_out = $_out_arr1[0];
                }
            }
        }

        if (!empty($_out)) {
            $strQuery = "   UPDATE masivos.dbo.outbound_correos
                            SET enviado  = 4,
                                response = '{$value['mensaje']}'
                            WHERE Id_outbound_correos = {$_out}";

            if ($_con->db_consulta($strQuery)) {
                echo "registro actualizado";
            }
        }
    } else {
        $_arr_email = explode('<', $value['mensaje']);
        if (sizeof($_arr_email) > 0) {
            $_arr_email1 = explode('>', $_arr_email['1']);
            if (sizeof($_arr_email1) > 0) {
                $email = $_arr_email1[0];
            }
        }

        if(!empty($email)) {
            $strQuery = "   SELECT email
                            FROM masivos.dbo.black_list
                            WHERE email = '{$email}'";

            $qTmp = $_con->db_consulta($strQuery);
            if($_con->db_num_rows($qTmp) <= 0 ) {
                $strQuery = "   INSERT INTO masivos.dbo.black_list (email)
                                VALUES ('{$email}')";
                if($_con->db_consulta($strQuery)) {
                    echo "coreo no valido insertado";
                }

                $strQuery = "   UPDATE masivos.dbo.outbound_correos
                                SET enviado  = 3
                                WHERE Id_outbound_correos > 0
                                AND email = '{$email}'";
                $_con->db_consulta($strQuery);
            } else {
                echo "coreo no valido ya existe";
            }
        }
    }
}

imap_close($connection);
