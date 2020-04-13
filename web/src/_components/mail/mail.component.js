import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip, Button, Divider, Dropdown, Menu, Icon, Progress, Badge } from "antd";
import moment from "moment";
import Rodal from "rodal";
import { AsyncStorage } from "AsyncStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faBan } from '@fortawesome/free-solid-svg-icons';

import mailActionts from "../../_actionts/mail.actionts";
import Table from "../../_helpers/Table";
import Form from "../../_helpers/Form";
import clientActionts from "../../_actionts/client.actionts";
// import Functions from "../../_helpers/Functions";
import TextEditor from "../../_helpers/TextEditor";
import Loading from "../../_helpers/Loading";

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
    { header: 'Gestion', value: 'gestion', filter: true, type: 1 },
    { header: 'Enviado', value: 'enviado', filter: true, type: 6 }
];

const form = [
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_activos', col: 6, change: true },
    { name: 'Producto', value: 'id_producto', required: true, type: 7, option: 'productos_cliente', col: 6 },
    { name: 'Texto', value: 'id_texto', required: true, type: 7, option: 'textos_cliente', change: true }
];

class Mail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date_start: moment().startOf('month'),
            date_end: moment().endOf('month'),
            modal: false,
            content: undefined,
            user: undefined,
            body: '',
            modal_text: false,
            modal_detalle: false
        };
    }

    componentDidMount() {
        this.handleGet();
        AsyncStorage.getItem('login_massive', (err, res) => {
            if (!err && res && res != "undefined") {
                var user = JSON.parse(res);
                this.setState({ user: user });
            }
        });
        this.props.dispatch(clientActionts.getActivos());
    }

    render() {
        const { date_start, date_end, modal, modal_text, modal_detalle } = this.state;
        const { threads } = this.props;
        return (
            <div style={{ position: 'relative' }}>
                {modal_detalle &&
                    this.handleModalDetalle()
                }

                {modal &&
                    this.handleModal()
                }
                {modal_text &&
                    this.handleModalText()
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

                <div style={{ width: '100%', height: '68vh', overflowY: 'auto', overflowX: 'hidden', marginTop: 5 }}>
                    {threads && threads.map((item, i) => {
                        return (
                            <div className="row row-thread" key={i}>
                                <div className="col-4 text-center">
                                    <p className="m-0 p-0 h6">{item.name}</p>
                                    <p className="m-0 p-0">{item.usuario}/{item.fecha_creacion}</p>
                                </div>
                                <div className="col-3 text-center">
                                    <div className="row">
                                        <div className="col-md-3" onClick={() => this.handleDetalle(3, item)}>
                                            <Tooltip title="Correo no valido">
                                                <Badge
                                                    count={item.detalle && item.detalle[3] ? item.detalle[3] : 0}
                                                    offset={[15, 0]}
                                                    overflowCount={99999}
                                                    showZero={true}
                                                >
                                                    <FontAwesomeIcon icon={faBan} color="red" />
                                                </Badge>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-3" onClick={() => this.handleDetalle(0, item)}>
                                            <Tooltip title="Pendiente de enviar">
                                                <Badge
                                                    count={item.detalle && item.detalle[0] ? item.detalle[0] : 0}
                                                    offset={[15, 0]}
                                                    overflowCount={99999}
                                                    showZero
                                                    style={{ backgroundColor: '#90a4ae' }}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} color="#90a4ae" />&nbsp;&nbsp;&nbsp;
                                                </Badge>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-3" onClick={() => this.handleDetalle(1, item)}>
                                            <Tooltip title="Enviado">
                                                <Badge
                                                    count={item.detalle && item.detalle[1] ? item.detalle[1] : 0}
                                                    offset={[15, 0]}
                                                    overflowCount={99999}
                                                    showZero
                                                    style={{ backgroundColor: '#81c784' }}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} color="#81c784" />&nbsp;&nbsp;&nbsp;
                                            </Badge>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-3" onClick={() => this.handleDetalle(2, item)}>
                                            <Tooltip title="Leido">
                                                <Badge
                                                    count={item.detalle && item.detalle[2] ? item.detalle[2] : 0}
                                                    offset={[15, 0]}
                                                    overflowCount={99999}
                                                    showZero
                                                    style={{ backgroundColor: 'green' }}
                                                >
                                                    <FontAwesomeIcon icon={faCheckDouble} color="green" />&nbsp;&nbsp;&nbsp;
                                            </Badge>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <Progress percent={item.percentage} />
                                </div>
                                <div className="col-1 text-center">
                                    <Button
                                        type="primary"
                                        icon="redo"
                                        className="ml-1"
                                        size="small"
                                        icon={(item.send == item.length) ? 'redo' : ((item.status == 1) ? 'play-circle' : 'pause')}
                                        onClick={() => {
                                            if (item.send == item.length) {
                                                const values = item;
                                                this.handleAdd(values);
                                            } else {
                                                this.handleActios(item);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
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
            this.props.dispatch(mailActionts.getThreads(data));
        }
    }

    handleModal() {
        const { modal, content } = this.state;
        const { clientes_activos, productos_cliente, textos_cliente, _disabled } = this.props;
        return (
            <Rodal
                animation={'slideRight'}
                duration={500}
                visible={modal}
                onClose={() => { this.setState({ modal: !modal }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 600 || window.innerHeight < 450 ? window.innerWidth : 600)}
                height={(window.innerWidth < 600 || window.innerHeight < 450 ? window.innerHeight : 450)}
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
                        disabled={_disabled}
                        content={content}
                        handleSubmit={this.handleAdd.bind(this)}
                        optionsChange={this.handleOptionsChange.bind(this)}
                    />
                    <div className="row">
                        <div className="col-md-2 offset-md-10 text-right">
                            <Tooltip title="Permite visualizar el mensaje a enviar">
                                <Button type="primary" icon="file-search" shape="circle" onClick={() => this.setState({ modal_text: true })} />
                            </Tooltip>
                        </div>
                    </div>
                    <br />
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <p className="text-center" style={{ color: '#bdbdbd' }}>
                        Enviar No incluye los siguientes estatus PROMESA DE PAGO, ACLARACION,FINIQUITO,RETENIDO POR EL CLIENTE,CHEQUE PREFECHADO
                    </p>

                    {(_disabled == true) &&
                        <div className="upload-transaction">
                            <Loading type={true} />
                            <p className="upload-transaction-title">En proceso...</p>
                        </div>
                    }
                </div>
            </Rodal>
        );
    }

    handleAdd(values) {
        const { user } = this.state;
        values.id_usuario = user.id_usuario;
        this.props.dispatch(mailActionts.addLot(values));
        // Functions.message('info', 'lote creado. en unos momentos se procedera con el envio!');
        // this.setState({ modal: false });
    }

    handleOptionsChange(value, res) {
        console.log(value, res);
        if (res == 'id_cliente') {
            this.props.dispatch(clientActionts.getProductoCliente({ 'id_cliente': value }));
            this.props.dispatch(clientActionts.getTextoCliente({ 'id_cliente': value }));
        } else {
            const { textos_cliente } = this.props;
            var _textos_cliente = textos_cliente.filter(item => {
                return item.id_texto == value;
            });
            console.log(_textos_cliente);
            this.setState({ body: _textos_cliente[0].body });
        }
    }

    handleGetLotes() {
        const { user } = this.state;
        this.props.dispatch(mailActionts.OpenOrClosePanel(true, user.id_usuario));
    }

    handleModalDetalle() {
        const { mails } = this.props;
        const { modal_detalle } = this.state;
        return (
            <Rodal
                animation={'slideLeft'}
                duration={500}
                visible={modal_detalle}
                onClose={() => this.setState({ modal_detalle: !modal_detalle })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 900 || window.innerHeight < 550 ? window.innerWidth : 900)}
                height={(window.innerWidth < 900 || window.innerHeight < 550 ? window.innerHeight : 550)}
            >
                <div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="p-0 m-0 h4">
                                DETALLE LOTE
                            </p>
                        </div>
                    </div>
                    <Divider style={{ backgroundColor: '#4caf50' }} />
                    <br /><br />
                    <div>
                        <Table
                            height="450px"  
                            data={mails}
                            arr={table}
                        />
                    </div>
                </div>
            </Rodal>
        );
    }

    handleModalText() {
        const { modal_text, body } = this.state;
        return (
            <Rodal
                animation='flip'
                duration={500}
                visible={modal_text}
                onClose={() => this.setState({ modal_text: false })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={500}
                height={400}
            >
                <div>
                    <div className="row">
                        <div className="col-8 offset-2 text-center">
                            <p className="m-0 p-0 h5">TEXTO A ENVIAR</p>
                        </div>
                    </div>
                    <TextEditor
                        body={body}
                        height={350}
                        disabled={true}
                    />
                </div>
            </Rodal>
        );
    }

    handleActios(thread) {
        var _thread = thread;
        _thread.get_thread = 1;
        _thread.status = thread.status == 1 ? 0 : 1;
        this.props.dispatch(mailActionts.changeStatusThread(_thread));
    }

    handleDetalle(send, thread) {
        const data = {
            'id_thread': thread.id_thread,
            'enviado': send,
            'date_start': moment(thread.fecha_creacion, "DD-MM-YYYY").format('YYYY-MM-DD'),
            'date_end': moment(thread.fecha_creacion, "DD-MM-YYYY").format('YYYY-MM-DD'),
        };
        this.props.dispatch(mailActionts.get(data));
        this.setState({
            modal_detalle: true
        });
    }
}

function mapsStateToProps(state) {
    const { _mails, _clients } = state;
    const { mails, lote, threads, modal_panel, _disabled } = _mails;
    const { clientes_activos, productos_cliente, textos_cliente } = _clients;
    return { mails, lote, clientes_activos, productos_cliente, textos_cliente, threads, modal_panel, _disabled };
}

export default connect(mapsStateToProps)(Mail);