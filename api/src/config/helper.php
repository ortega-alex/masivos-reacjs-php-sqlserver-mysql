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
