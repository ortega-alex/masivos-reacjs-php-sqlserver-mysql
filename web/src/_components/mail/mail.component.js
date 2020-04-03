import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip, Button, Divider, Dropdown, Menu, Icon, notification, Progress } from "antd";
import moment from "moment";
import Rodal from "rodal";
import { AsyncStorage } from "AsyncStorage";

import mailActionts from "../../_actionts/mail.actionts";
import Table from "../../_hepers/Table";
import Form from "../../_hepers/Form";
import clientActionts from "../../_actionts/client.actionts";
import Functions from "../../_hepers/Functions";

require("moment/min/locales.min");
moment.locale('es');

const { Item } = Menu;
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
    { name: 'Nombre del lote', value: 'nombre', required: true, type: 1, icon: 'idcard' },
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_activos', col: 6, change: true },
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
            content: undefined,
            user: undefined,
            // notification: false,
            // percent: 0,
            modal_lote: false
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('login_massive', (err, res) => {
            if (!err && res && res != "undefined") {
                var user = JSON.parse(res);
                this.setState({ user: user }, () => {
                    console.log(this.state.user);
                });
            }
        });
        this.handleGet();
        this.props.dispatch(clientActionts.getActivos());
        // setInterval(() => {
        //     this.setState({ percent: this.state.percent + 1 });
        // }, 3000);
    }

    render() {
        const { date_start, date_end, modal, modal_lote } = this.state;
        const { mails, notification } = this.props;
        return (
            <div style={{ position: 'relative' }}>
                {notification &&
                    this.handleNotificacion()
                }
                {modal &&
                    this.handleModal()
                }
                {modal_lote &&
                    this.handleModalLotes()
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
                        <Dropdown
                            overlay={
                                <Menu theme="dark">
                                    <Item onClick={() => { this.setState({ modal: true }) }} >
                                        <Icon type="plus-circle" />Nuevo
                                    </Item>
                                    <Item onClick={this.handleGetLotes.bind(this)}>
                                        <Icon type="unordered-list" />Estado lotes
                                    </Item>
                                </Menu>
                            }
                        >
                            <Button type="primary" icon="setting">
                                Opciones
                            </Button>
                        </Dropdown>
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
                width={(window.innerWidth < 600 || window.innerHeight < 550 ? window.innerWidth : 600)}
                height={(window.innerWidth < 600 || window.innerHeight < 550 ? window.innerHeight : 550)}
            >
                <div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="p-0 m-0 h4">
                                Envio de Correos - Recordatorios (Promesas y Programaciones)
                            </p>
                        </div>
                    </div>
                    <br />
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <Form
                        edit={true}
                        footer={true}
                        options={{ clientes_activos, productos_cliente, textos_cliente }}
                        arr={form}
                        content={content}
                        handleSubmit={this.handleAdd.bind(this)}
                        optionsChange={this.handleOptionsChange.bind(this)}
                    />
                    <div className="row">
                        <div className="col-md-2 offset-md-10 text-right">
                            <Tooltip title="Permite visualizar el mensaje a enviar">
                                <Button type="primary" icon="file-search" shape="circle" />
                            </Tooltip>
                        </div>
                    </div>
                    <br />
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <p className="text-center" style={{ color: '#bdbdbd' }}>Enviar No incluye los siguientes estatus PROMESA DE PAGO, ACLARACION,FINIQUITO,RETENIDO POR EL CLIENTE,CHEQUE PREFECHADO</p>
                </div>
            </Rodal>
        );
    }

    handleAdd(values) {
        const { user } = this.state;
        values.id_usuario = user.id_usuario;
        this.props.dispatch(mailActionts.getLote(values));
        Functions.message('info', 'lote creado. en unos momentos se procedera con el envido!');
    }

    handleOptionsChange(value) {
        this.props.dispatch(clientActionts.getProductoCliente({ 'id_cliente': value }));
        this.props.dispatch(clientActionts.getTextoCliente({ 'id_cliente': value }));
    }

    handleNotificacion() {
        const { thread } = this.props
        return (
            <div className="notificaion">
                {(thread) &&
                    <div>
                        <div className="row">
                            <div className="col-2 offset-10 text-right">
                                <Button size="small" type="link" icon="close-circle" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <p className="m-0 p-0 h6"><b>{thread.name}</b></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Progress percent={thread.percentage} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 offset-10 mt-2">
                                <Button type="primary" size="small" onClick={() => this.setState({ /*notification: false,*/ modal_lote: true })}>
                                    Abrir
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    handleGetLotes() {
        const { user } = this.state;
        this.props.dispatch(mailActionts.getThreads({ id_usuario: user.id_usuario }));
        this.setState({ modal_lote: true, notification: false })
    }

    handleModalLotes() {
        const { modal_lote } = this.state;
        const { threads } = this.props;
        return (
            <Rodal
                animation={'slideLeft'}
                duration={500}
                visible={modal_lote}
                onClose={() => { this.setState({ modal_lote: !modal_lote }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 700 || window.innerHeight < 550 ? window.innerWidth : 700)}
                height={(window.innerWidth < 700 || window.innerHeight < 550 ? window.innerHeight : 550)}
            >
                <div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="p-0 m-0 h4">
                                Adminitracion de lotes
                            </p>
                        </div>
                    </div>
                    <Divider style={{ backgroundColor: '#4caf50' }} />

                    <div style={{ width: '100%', height: window.innerHeight < 550 ? (window.innerHeight - 300) : 500, overflowY: 'auto', overflowX: 'hidden'}}>
                        {threads && threads.map((item, i) => {
                            return (
                                <div className="row row-thread" key={i}>
                                    <div className="col-6 mt-1 text-center">
                                        <p className="m-0 p-0 h6">{item.name}</p>
                                        <p className="m-0 p-0">{item.fecha_creacion}</p>
                                    </div>                                
                                    <div className="col-4">
                                        <Progress percent={item.percentage} />
                                    </div>
                                    <div className="col-2">
                                        <Button 
                                            type="link" 
                                            icon="redo" 
                                            className="ml-1" 
                                            size="small" 
                                            icon={(item.send == item.length) ? 'redo' : ((item.status == 1) ? 'play-circle' : 'pause-circle')}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Rodal>
        );
    }
}

function mapsStateToProps(state) {
    const { _mails, _clients } = state;
    const { mails, notification, lote, thread, threads } = _mails;
    const { clientes_activos, productos_cliente, textos_cliente } = _clients;
    return { mails, lote, clientes_activos, productos_cliente, textos_cliente, notification, thread, threads };
}

export default connect(mapsStateToProps)(Mail);