import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip } from "antd";
import moment from "moment";
require("moment/min/locales.min");
moment.locale('es');

class Mail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date_start: moment().startOf('month'),
            date_end: moment().endOf('month'),
        };
    }

    componentDidMount() {

    }

    render() {
        const { date_start, date_end } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="p-0 m-0 h3"><b>ENVIO DE CORREOS MASIVOS</b></p>
                        <p className="m-0 p-0">Permite seleccionar diferentes filtros para enviar campa;as de correos de forma automactica</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-6">
                                <Tooltip title="Permite filtrar registros por un rango de fechas"><b>Fecha Inicial:</b></Tooltip>
                                <DatePicker
                                    className="inp"
                                    format="DD-MM-YYYY"
                                    onChange={(value) => {
                                        // this.setState({ fecha_init: value }, () => {
                                        //     this.handleGetPcs();
                                        // });
                                    }}
                                    value={date_start}
                                />
                            </div>
                            <div className="col-6">
                                <Tooltip title="Permite filtrar registros por un rango de fechas"><b>Fecha Fin:</b></Tooltip>
                                <DatePicker
                                    className="inp"
                                    format="DD-MM-YYYY"
                                    onChange={(value) => {
                                        // this.setState({ fecha_init: value }, () => {
                                        //     this.handleGetPcs();
                                        // });
                                    }}
                                    value={date_end}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapsStateToProps(state) {
    return {};
}

export default connect(mapsStateToProps)(Mail);