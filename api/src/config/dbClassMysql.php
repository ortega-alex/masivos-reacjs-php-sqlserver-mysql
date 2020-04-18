<?php
class dbClassMysql
{

    public function __construct()
    {
        $this->conexion = new mysqli('172.29.11.26', 'esaavedra', 'EsAAv2016', 'tmk_ventas');
        if ($this->conexion->connect_error) {
            die('Connect Error(' . $this->conexion->connect_errno . ') ' . $this->conexion->connect_error);
        }
    }

    /*
     * consulta
     */
    public function db_consulta($strQuery)
    {
        $resultado = $this->conexion->query($strQuery);
        if (!$resultado) {
            print "<pre>Ha ocurrido un error intente nuevamente:  <br> Query:  <br>" . $strQuery . " <br> Error: <br>" . $this->conexion->error . "</pre>";
            return null;
        } else {
            return $resultado;
        }
    }

    /*
     *   Retorna un array asociativo correspondiente a la fila obtenida o NULL si no hubiera más filas.
     */
    public function db_fetch_assoc($qTMP)
    {
        if ($qTMP != null) {
            return $qTMP->fetch_assoc();
        } else {
            return null;
        }
    }

    /*
     *   Devuelve la fila actual de un conjunto de resultados como un objeto.
     */
    public function db_fetch_object($qTMP)
    {
        if ($qTMP != null) {
            return $qTMP->fetch_object();
        } else {
            return null;
        }
    }

    /*
     *   Libera la memoria del resultado
     */
    public function db_free_result($qTMP)
    {
        if ($qTMP != null) {
            return $qTMP->free();
        }

    }

    /*
     *   cierra la conexion
     */
    public function db_close()
    {
        return $this->conexion->close();
    }

    /*
     *    para obtener la última identificación de inserción que se ha generado MySQL
     */
    public function db_last_id()
    {
        $strQuery = "SELECT LAST_INSERT_ID() id";
        $qTMP = $this->db_fetch_assoc($this->db_consulta($strQuery));
        return intval($qTMP["id"]);
    }

    /*
     *    Obtiene el número de filas de un resultado
     */
    public function db_num_rows($qTMP)
    {
        return mysqli_num_rows($qTMP);
    }
}
