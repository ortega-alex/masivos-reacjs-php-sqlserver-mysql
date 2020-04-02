<?php
class dbClassPDO
{
    public $conexion;
    public function __construct()
    {
        try {
            $this->conexion = new PDO('odbc:Driver={SQL Server};Server=172.29.10.20; Database=oca_sac; Uid=sa;Pwd=oca;');
        } catch (PDOException $e) {
            print "¡Error!: " . $e->getMessage() . "<br/>";
            die();
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
     * procdimientos almacenados
     */

    public function db_procedure($strQuery)
    {
        $sth = $this->conexion->prepare($strQuery);
        $sth->execute();
        return $sth;
    }

    public function db_fetch_assoc($qTMP)
    {
        if ($qTMP != null) {
            return $qTMP->fetch(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }

    public function db_fetch_object($qTMP)
    {
        if ($qTMP != null) {
            return $qTMP->fetch(PDO::FETCH_OBJ);
        } else {
            return null;
        }
    }

    /*
     * cierra la conexion
     */
    public function db_close()
    {
        $this->conexion = null;
    }

    /*
     *    Obtiene el número de filas de un resultado
     */
    public function db_num_rows($qTMP)
    {
        return $qTMP->rowCount();
    }
}
