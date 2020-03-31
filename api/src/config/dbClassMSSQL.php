<?php
class dbClassMSSQL
{
    public $conexion;
    public function __construct()
    {
        $this->conexion = mssql_connect('172.29.10.20', 'sa', 'oca') or die("Connect Error server");
        mssql_select_db('oca_sac', $this->conexion) or die("Problemas al  seleccionar la base de datos oca_sac");
    }

    /*
     * consulta
     */
    public function db_consulta($strQuery)
    {
        $resultado = mssql_query($strQuery);
        if (!$resultado) {
            print "<pre>Ha ocurrido un error intente nuevamente:  <br> Query:  <br>" . $strQuery . " <br> Error: <br>" . mssql_error() . "</pre>";
            return null;
        } else {
            return $resultado;
        }
    }

    /*
     * procdimientos almacenados
     */
    public function db_procedure($strQuery)
    {
        $resultado = mssql_query($strQuery);
        if (!$resultado) {
            print "<pre>Ha ocurrido un error intente nuevamente:  <br> Query:  <br>" . $strQuery . " <br> Error: <br>" . mssql_error() . "</pre>";
            return null;
        } else {
            return $resultado;
        }
    }

    public function db_fetch_assoc($qTMP)
    {
        if ($qTMP != null) {
            return mssql_fetch_assoc($qTMP);
        } else {
            return null;
        }
    }

    public function db_fetch_object($qTMP)
    {
        if ($qTMP != null) {
            return mssql_fetch_object($qTMP);
        } else {
            return null;
        }
    }

    /*
     * cierra la conexion
     */
    public function db_close()
    {
        mssql_close($this->conexion);
    }

    /*
     *    Obtiene el número de filas de un resultado
     */
    public function db_num_rows($qTMP)
    {
        return mssql_num_rows($qTMP);
    }
}
