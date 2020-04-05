<?php

if (extension_loaded('mssql')) {
    require_once '../config/dbClassMSSQL.php';
    $_con = new dbClassMSSQL();
} else {
    require_once '../config/dbClassPDO.php';
    $_con = new dbClassPDO();
}
require_once '../config/helper.php';

getHeader();

$res['err'] = "true";
$res['msj'] = "404 Pagina no en_contrada";

$strUsuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$intPass = isset($_POST['pass']) ? intval(encryptPassword($_POST['pass'])) : 0;

if (isset($_GET['login'])) {
    $strQuery = "  SELECT id_usuario, nombres, apellidos
                        CASE
                            WHEN password != {$intPass} THEN 0
                            ELSE 1
                        END AS estado
                    FROM oca_sac..usuarios
                    WHERE login = '$strUsuario'";

    $qTmp = $_con->db_consulta($strQuery);
    if ($_con->db_num_rows($qTmp) > 0) {
        $rTmp = $_con->db_fetch_assoc($qTmp);
        if (intval($rTmp['estado']) == 1) {            
            $nombres = explode(' ', $rTmp['nombres']);
            $apellidos = explode(' ', $rTmp['apellidos']);
            $user = array(
                'id_usuario' => $rTmp['id_usuario'],
                'usuario' => $strUsuario,
                'nombre' => ($nombres[0] . ' ' . $apellidos[0])
            );
            $res['err'] = "false";
            $res['user'] = $user;
        } else {
            $res['msj'] = "contraseña incorrecta";
        }
    } else {
        $res['msj'] = "Usuario incorrecto";
    }
}

print(json_encode($res));
$_con->db_close();
