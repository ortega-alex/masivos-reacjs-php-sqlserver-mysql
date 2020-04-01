import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip, Button, Divider, Icon } from "antd";
import moment from "moment";
import Rodal from "rodal";

import mailActionts from "../../_actionts/mail.actionts";
import Table from "../../_hepers/Table";
import Form from "../../_hepers/Form";
import clientActionts from "../../_actionts/client.actionts";

require("moment/min/locales.min");
moment.locale('es');

const table = [
    { header: 'Fecha', value: 'fecha_creacion', filter: true, type: 1 },
    { header: 'Fecha envio', value: 'fecha_envio', filter: true, type: 1 },
    { header: 'Cliente', value: 'cliente', filter: true, type: 1 },
    { header: 'Control', value: 'control', filter: true, type: 1 },
    { header: 'Correo', value: 'email', filter: true, type: 1 },
    { header: 'Detalle', value: 'descripcion', filter: true, type: 1 },
    { header: 'Usuario', value: 'usuario', filter: true, type: 1 },
    { header: 'Enviado', value: 'enviado', filter: true, type: 3 }
];

const form = [
    { name: 'Nombre del lote', value: 'nombre', required: true, type: 1, icon: 'idcard'},
    { name: 'Fecha inicial', value: 'date_start_lot', required: true, type: 6, col: 6 },
    { name: 'Fecha Fin', value: 'date_end_lot', required: true, type: 6, col: 6 },
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_activos', col: 6 },
    { name: 'Producto', value: 'id_producto', required: true, type: 7, option: 'productos_cliente', col: 6 },
    { name: 'Texto', value: 'id_texto', required: true, type: 7, option: 'textos_cliente' }
];

class Mail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date_start: moment(),
            date_end: moment(),
            modal: false,
            content: undefined
        };
    }

    componentDidMount() {
        this.handleGet();
        this.props.dispatch(clientActionts.getActivos());
    }

    render() {
        const { date_start, date_end, modal } = this.state;
        const { mails } = this.props;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
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
                    <div className="col-md-2 offset-md-6 mt-3 text-right">
                        <Button
                            type="primary"
                            onClick={() => { this.setState({ modal: true }) }}
                            icon="plus-circle"
                        >
                            Nuevo
                        </Button>
                    </div>
                </div>
                <Table
                    data={mails}
                    arr={table}
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

    handleModal() {
        const { modal, content } = this.state;
        const { clientes_activos, productos_cliente, textos_cliente } = this.props;
        return (
            <Rodal
                animation={'slideRight'}
                duration={500}
                visible={modal}
                onClose={() => { this.setState({ modal: !modal }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 600 || window.innerHeight < 600 ? window.innerWidth : 600)}
                height={(window.innerWidth < 600 || window.innerHeight < 600 ? window.innerHeight : 600)}
            >
                <div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="p-0 m-0 h4">                                
                                 Envio de Correos - Recordatorios (Promesas y Programaciones)
                            </p>
                        </div>
                    </div>
                    <br/>
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <Form
                        edit={true}
                        footer={true}
                        options={{ clientes_activos, productos_cliente, textos_cliente }}
                        arr={form}
                        content={content}
                        handleSubmit={this.handleAdd.bind(this)}
                    />
                    <div className="row">
                        <div className="col-md-2 offset-md-10 text-right">
                            <Tooltip title="Permite visualizar el mensaje a enviar">
                                <Button type="primary" icon="file-search" shape="circle" />
                            </Tooltip>
                        </div>
                    </div>
                    <br/>
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <p className="text-center">Enviar No incluye los siguientes estatus PROMESA DE PAGO, ACLARACION,FINIQUITO,RETENIDO POR EL CLIENTE,CHEQUE PREFECHADO</p>
                </div>
            </Rodal>
        );
    }

    handleAdd(values) {
        console.log(values);
    }
}

function mapsStateToProps(state) {
    const { _mails, _clients } = state;
    const { mails } = _mails;
    const { clientes_activos } = _clients;
    return { mails, clientes_activos };
}

export default connect(mapsStateToProps)(Mail);