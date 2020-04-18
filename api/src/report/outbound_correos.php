<?php

// require_once '../config/dbClassMysql.php';
require_once '../config/helper.php';
include "../../libs/PHPExcel.php";
if (extension_loaded('mssql')) {
    require_once '../config/dbClassMSSQL.php';
    $_con = new dbClassMSSQL();
} else {
    require_once '../config/dbClassPDO.php';
    $_con = new dbClassPDO();
}

$objPHPExcel = new PHPExcel();
// $con = new dbClassMysql();

$dtDateStart = isset($_GET['DTS']) ? date('Y-m-d H:i:s', strtotime(trim($_GET['DTS']) . " 00:00:00")) : date('Y-m-d H:i:s');
$dtDateEnd = isset($_GET['DTE']) ? date('Y-m-d H:i:s', strtotime(trim($_GET['DTE']) . " 23:59:59")) : date('Y-m-d H:i:s');
$intIdThread = isset($_GET['TH']) ? intval($_GET['TH']) : 0;
$strControl = isset($_GET['CNT']) ? trim($_GET['CNT']) : null;
$intEnviado = isset($_GET['ENV']) ? intval($_GET['ENV']) : 0;

$objPHPExcel->getProperties()
    ->setCreator("Alex ortega")
    ->setLastModifiedBy("Alex ortega")
    ->setTitle("Documento Excel")
    ->setSubject("Documento Excel")
    ->setDescription("crear archivos de Excel desde PHP.")
    ->setKeywords("Excel Office 2007 php")
    ->setCategory("Pruebas de Excel");

$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);
$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(25);

$objPHPExcel->getActiveSheet()->freezePane('A2');

$boldArray = array(
    'font' => array('bold' => true, 'color' => array('rgb' => 'ffffff')),
    'fill' => array('type' => PHPExcel_Style_Fill::FILL_SOLID, 'color' => array('rgb' => '001850')),
    'alignment' => array('horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER),
);

$objPHPExcel->getActiveSheet()->getStyle('A1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('B1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('C1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('D1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('E1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('F1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('G1')->applyFromArray($boldArray);
$objPHPExcel->getActiveSheet()->getStyle('H1')->applyFromArray($boldArray);

$objPHPExcel->setActiveSheetIndex(0)
    ->setCellValue('A1', 'NOMBRE')
    ->setCellValue('B1', 'FECHA')
    ->setCellValue('C1', 'FECHA DE ENVIO')
    ->setCellValue('D1', 'USUARIO')
    ->setCellValue('E1', 'CONTROL')
    ->setCellValue('F1', 'CORREO')
    ->setCellValue('G1', 'ESTADO GESTION')
    ->setCellValue('H1', 'ESTADO');

$_AND = (!empty($strControl) && $strControl != null) ? "AND a.control = '{$strControl}'" : "AND a.id_thread2 = {$intIdThread}";
$strQuery = "   SELECT a.control, a.email, a.enviado, a.fecha_creacion, a.fecha_envio, a.management_status,
                    CASE
                        WHEN a.enviado = 0 THEN 'PENDIENTE DE ENVIAR'
                        WHEN a.enviado = 1 THEN 'ENVIADO'
                        WHEN a.enviado = 2 THEN 'LEIDO'
                        ELSE 'CORREO NO VALIDO'
                    END AS estado,
                    b.name,
                    c.login
                FROM masivos.dbo.outbound_correos a
                INNER JOIN masivos.dbo.thread b ON a.id_thread2 = b.id_thread
                INNER JOIN oca_sac.dbo.usuarios c ON a.id_usuario_envia = c.id_usuario
                WHERE a.fecha_creacion BETWEEN '{$dtDateStart}' AND '{$dtDateEnd}'
                AND a.enviado = {$intEnviado}
                {$_AND}
                ORDER BY a.fecha_envio, a.email, c.login";
$cel = 2;
$qTmp = $_con->db_consulta($strQuery);
while ($rTmp = $_con->db_fetch_object($qTmp)) {
    $objPHPExcel->getActiveSheet()->getStyle('B' . $cel)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_DDMMYYYY);
    $objPHPExcel->getActiveSheet()->getStyle('C' . $cel)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_DDMMYYYY);

    $objPHPExcel->setActiveSheetIndex(0)
        ->setCellValue('A' . $cel, $rTmp->name)
        ->setCellValue('B' . $cel, date('d-m-Y', strtotime($rTmp->fecha_creacion)))
        ->setCellValue('C' . $cel, date('d-m-Y', strtotime($rTmp->fecha_envio)))
        ->setCellValue('D' . $cel, $rTmp->login)
        ->setCellValue('E' . $cel, $rTmp->control)
        ->setCellValue('F' . $cel, $rTmp->email)
        ->setCellValue('G' . $cel, $rTmp->management_status)
        ->setCellValue('H' . $cel, $rTmp->estado);
    $cel++;
}

$qTmp = $_con->db_consulta($strQuery);

$name = "DETALLE ENVIO MASIVO " . date('d-m-Y') . ".xlsx";
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="' . $name . '"');
header('Cache-Control: max-age=0');
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');

$con->db_close();
