import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip, Input } from "antd";
import moment from "moment";

import mailActionts from "../../_actionts/mail.actionts";
import Table from "../../_hepers/Table";

require("moment/min/locales.min");
moment.locale('es');
const { Search } = Input;

const tabla = [
    { header: 'Fecha', value: 'fecha_creacion', filter: true, type: 1 },
    { header: 'Fecha envio', value: 'fecha_envio', filter: true, type: 1 },
    { header: 'Cliente', value: 'cliente', filter: true, type: 1 },
    { header: 'Control', value: 'control', filter: true, type: 1 },
    { header: 'Correo', value: 'email', filter: true, type: 1 },
    { header: 'Detalle', value: 'descripcion', filter: true, type: 1 },
    { header: 'Usuario', value: 'usuario', filter: true, type: 1 },
    { header: 'Enviado', value: 'enviado', filter: true, type: 3 }
];

class Mail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date_start: moment(),
            date_end: moment()
        };
    }

    componentDidMount() {
        this.handleGet();
    }

    render() {
        const { date_start, date_end } = this.state;
        const { mails } = this.props;
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
                                    onChange={(date) => {
                                        this.setState({ date_start: date }, () => {
                                            this.handleGet();
                                        });
                                    }}
                                    value={date_start}
                                />
                            </div>
                            <div className="col-6">
                                <Tooltip title="Permite filtrar registros por un rango de fechas"><b>Fecha Fin:</b></Tooltip>
                                <DatePicker
                                    className="inp"
                                    format="DD-MM-YYYY"
                                    onChange={(date) => {
                                        this.setState({ date_end: date }, () => {
                                            this.handleGet();
                                        });
                                    }}
                                    value={date_end}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-center">
                        <Tooltip title="Permite filtrar registros por control o por cliente">
                            <b style={{ color: '#bdbdbd' }}>.</b>
                        </Tooltip>                                
                        <Search
                            placeholder="Buscar"
                            onSearch={(busqueda) => {
                                this.handleBucar(busqueda);
                            }}
                            enterButton
                        />
                    </div>
                </div>
                <Table
                    data={mails}
                    arr={tabla}
                />
            </div>
        );
    }

    handleGet() {
        const { date_start, date_end } = this.state;
        if (date_start && date_start != null &&
            date_end && date_end != null) {
            var data = {
                date_start: date_start.format('YYYY-MM-DD'),
                date_end: date_end.format('YYYY-MM-DD')
            };
            this.props.dispatch(mailActionts.get(data));
        }
    }

    handleBucar(busqueda) {
        console.log(busqueda);
    }
}

function mapsStateToProps(state) {
    const { _mails } = state;
    const { mails } = _mails;
    return { mails };
}

export default connect(mapsStateToProps)(Mail);