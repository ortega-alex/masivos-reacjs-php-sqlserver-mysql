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
$intdIdOutboundCorreos = isset($_GET['OUT']) ? intval($_GET['OUT']) : 0;

$strQuery = "   SELECT a.id_usuario_envia, a.control, a.email, a.enviado,
                    b.id_thread, b.name, b.fecha_creacion, b.id_operation, b.id_cliente,
                    c.login AS usuario
                FROM masivos.dbo.outbound_correos a
                INNER JOIN masivos.dbo.thread b ON a.id_thread2 = b.id_thread
                INNER JOIN oca_sac.dbo.usuarios c ON a.id_usuario_envia = c.id_usuario
                WHERE a.Id_outbound_correos = {$intdIdOutboundCorreos}";
$qTmp = $_con->db_consulta($strQuery);
$rTmp = $_con->db_fetch_assoc($qTmp);

if ($rTmp['enviado'] != 2) {
    $_fecha = date('d-m-Y', strtotime($rTmp['fecha_creacion']));

    $_db = $rTmp['id_operation'] == 1 ? "oca_sac" :
    ($rTmp['id_cliente'] == 1 ? 'tmk_ventas' :
        ($rTmp['id_cliente'] == 2 ? 'tmk_tarjetas_promerica' : 'sm_sos'));
    $_arr = array(
        'db' => $_db,
        'id_operation' => $rTmp['id_operation'],
        'id_usuario' => $rTmp['id_usuario_envia'],
        'control' => $rTmp['control'],
        'gestion' => "CORREO LEIDO: {$rTmp['email']}, LT: {$rTmp['id_thread']}, NMB: {$rTmp['name']}, FCH: {$_fecha}. US: {$rTmp['usuario']}",
    );
    $__con = $objThread->id_operation == 1 ? $_con : $con;
    insertManagement($_arr, $__con);

    $strQuery = "   UPDATE masivos.dbo.outbound_correos
                    SET enviado  = 2
                    WHERE Id_outbound_correos = {$intdIdOutboundCorreos}";
    $_con->db_consulta($strQuery);
}

$_img = "../../public/img/logo_oca.png";
if (file_exists($_img)) {
    header('Content-Type: image/png');
    readfile($_img);
    exit;
} else {
    echo "no existe:" . $_img;
}
