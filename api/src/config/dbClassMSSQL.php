<?php
class dbClassMSSQL
{
    public $conexion;
    public function __construct()
    {
        // $this->conexion = mssql_connect('172.29.10.176', 'sa', 'oca') or die("Connect Error server");
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
            print "<pre>Ha ocurrido un error intente nuevamente:  <br> Query:  <br>" . $strQuery . " <br> Error: <br>" . msql_error() . "</pre>";
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
            print "<pre>Ha ocurrido un error intente nuevamente:  <br> Query:  <br>" . $strQuery . " <br> Error: <br>" . msql_error() . "</pre>";
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

     /*
     *    para obtener la última identificación de inserción que se ha generado MySQL
     */
    public function db_last_id($_db)
    {
        $strQuery = "   SELECT IDENT_CURRENT('{$_db}') AS id";
        $qTMP = $this->db_fetch_assoc($this->db_consulta($strQuery));
        return intval($qTMP["id"]);
    }
}
