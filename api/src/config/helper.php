<?php

function getHeader()
{
    header('Content-Type: application/json');
    ini_set("display_errors", 0);
    header('Access-Control-Allow-Origin: *');
}

function istAValidEmail($str)
{
    $matches = null;
    return (1 === preg_match('/^[A-z0-9\\._-]+@[A-z0-9][A-z0-9-]*(\\.[A-z0-9_-]+)*\\.([A-z]{2,6})$/', trim($str), $matches));
}

function encryptPassword($pass)
{
    $val = 0;
    for ($i = 0; $i < strlen($pass); $i++) {
        $val += ord(substr($pass, $i, 1));
    }
    return $val;
}

function nameMonth($n)
{
    $arr = array(
        'ENERO',
        'FEBRERO',
        'MARZO',
        'ABRIL',
        'MAYO',
        'JUNIO',
        'JULIO',
        'AGOSTO',
        'SEPTIEMBRE',
        'OCTUBRE',
        'NOVIEMBRE',
        'DICIEMBRE',
    );
    return $arr[intval($n) - 1];
}

function insertManagement($arr, $_con)
{
    $_management = utf8_decode($arr['gestion']);
    $_year = date('Y');
    $_month = date('m');
    $_day = date('d');
    $_time = date('H');
    $_telefono = utf8_decode("Información");
    $strQuery = "	INSERT INTO oca_sac.dbo.gestion (id_remesa, no_linea, id_usuario, id_gestion_clave, observaciones,
                                                    fecha_inicio, fecha_fin, telefono, descripcion_telefono, fecha_seguimiento,
                                                    fecha_pago, monto, automatico, monto_2, confirmacion,
                                                    porcentaje_descuento, descuento, porcentaje_descuento_2, descuento_2, mes,
                                                    ano, dia, hora)
                    SELECT b.id_remesa, b.no_linea, isnull({$arr['id_usuario']},1), b.id_gestion_clave, '{$_management}',
                            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '{$_telefono}', '{$_telefono}', b.fecha_seguimiento,
                            b.promesa_fecha_pago, b.promesa_monto, 0, b.promesa_monto_2, 0,
                            b.porcentaje_descuento, b.descuento, b.porcentaje_descuento_2, b.descuento_2, '{$_month}',
                            '{$_year}', '{$_day}', '{$_time}'
                    FROM oca_sac.dbo.remesas_cuentas b
                    WHERE control = '{$arr['control']}'";
                    // print($strQuery);
                    // exit();
    $_con->db_consulta($strQuery);
}
