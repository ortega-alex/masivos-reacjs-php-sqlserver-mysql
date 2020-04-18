import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker, Tooltip, Button, Divider, Progress, Badge, Upload, Icon, Input } from "antd";
import moment from "moment";
import Rodal from "rodal";
import { AsyncStorage } from "AsyncStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faBan, faMailBulk } from '@fortawesome/free-solid-svg-icons';

import mailActionts from "../../_actionts/mail.actionts";
import Table from "../../_helpers/Table";
import Form from "../../_helpers/Form";
import clientActionts from "../../_actionts/client.actionts";
import TextEditor from "../../_helpers/TextEditor";
import Loading from "../../_helpers/Loading";
import textActionts from "../../_actionts/text.actionts";
import _server from "../../_services/server.services";

require("moment/min/locales.min");
moment.locale('es');

const { Search } = Input;
const table = [
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Fecha', value: 'fecha_creacion', filter: true, type: 1 },
    { header: 'Fecha envio', value: 'fecha_envio', filter: true, type: 1 },
    { header: 'Usuario', value: 'usuario', filter: true, type: 1 },
    { header: 'Control', value: 'control', filter: true, type: 1 },
    { header: 'Correo', value: 'email', filter: true, type: 1 },    
    { header: 'Gestion', value: 'gestion', filter: true, type: 1 },
    { header: 'Enviado', value: 'enviado', filter: true, type: 6 }
];

const form = [
    { name: 'Operacion', value: 'id_operation', required: true, type: 7, option: 'operaciones', change: true },
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_activos', col: 6, change: true },
    { name: 'Producto', value: 'id_producto', required: true, type: 7, option: 'productos_cliente', col: 6 },
    { name: 'Estado', value: 'id_estado', required: false, type: 7, option: 'estados_act', col: 6 },
    { name: 'Texto', value: 'id_texto', required: true, type: 7, option: 'textos_cliente', change: true, col: 6 }
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
            modal_detalle: false,
            id_operation: null,
            subiendo: false,
            file: null
        };
    }

    componentDidMount() {
        this.handleGet();
        this.props.dispatch(clientActionts.getOperation());
        AsyncStorage.getItem('login_massive', (err, res) => {
            if (!err && res && res != "undefined") {
                var user = JSON.parse(res);
                this.setState({ user: user });
            }
        });
    }

    render() {
        const { date_start, date_end, modal, modal_text, modal_detalle } = this.state;
        const { threads, _disabled, _loading } = this.props;
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

                {_loading &&
                    <div className="loading">
                        <div className="loading-body">
                            <Loading />
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="p-0 m-0 h3"><b>ENVIO DE CORREOS MASIVOS</b></p>
                        <p className="m-0 p-0">Permite administrar los diferentes lotes ha enviar vía correo electrónico de manera automática</p>
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

                        <Tooltip title="Permite generar un lote para el envio de correos">
                            <Button
                                type="primary"
                                icon="plus-circle"
                                onClick={() => this.setState({ modal: true, id_texto: undefined, estado: true, content: undefined })}
                            >
                                Nuevo
                            </Button>
                        </Tooltip>

                    </div>
                </div>

                <div className="thread-panel">
                    {threads && threads.map((item, i) => {
                        return (
                            <div className="row row-thread" key={i}>
                                <div className="col-4 text-center">
                                    <p className="m-0 p-0 h6">{item.name}</p>
                                    <p className="m-0 p-0">{item.usuario}/{item.fecha_creacion}/{item.operacion}</p>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Tooltip title="Total">
                                                <Badge
                                                    count={item.total}
                                                    offset={[15, 0]}
                                                    overflowCount={99999}
                                                    showZero={true}
                                                    style={{ backgroundColor: '#42a5f5' }}
                                                >
                                                    <FontAwesomeIcon icon={faMailBulk} color="#42a5f5" />
                                                </Badge>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-2" onClick={() => this.handleDetalle(3, item)}>
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
                                        <div className="col-md-2" onClick={() => this.handleDetalle(0, item)}>
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
                                        <div className="col-md-2" onClick={() => this.handleDetalle(2, item)}>
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
                                <div className="col-3">
                                    <Progress percent={item.percentage} />
                                </div>
                                <div className="col-1 text-center">
                                    <Button
                                        type="primary"
                                        icon="redo"
                                        className="ml-1"
                                        size="small"
                                        icon={(item.send == item.length) ? 'redo' : ((item.status == 1) ? 'play-circle' : 'pause')}
                                        disabled={_disabled}
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
        const { modal, content, subiendo } = this.state;
        const { clientes_activos, productos_cliente, textos_cliente, _disabled, operaciones, estados_act } = this.props;
        const propsUpload = {
            disabled: subiendo,
            onRemove: () => { this.setState({ file: null }); },
            onChange: (info) => {
                info.file.status = "done";
                this.setState({ subiendo: false })
            },
            multiple: false,
            customRequest: ({ onSuccess, onError, file }) => {
                this.setState({ subiendo: true, file });
            },
            accept: ".xls,.xlsx",
            name: 'file',
        };
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
                height={(window.innerWidth < 600 || window.innerHeight < 500 ? window.innerHeight : 500)}
            >
                <div>
                    <div className="row">
                        <div className="col-md-3 text-left">
                            <Tooltip title="Formato para cargar archivo .xlsx">
                                <Button type="primary" block icon="download" size="small">
                                    <a href={`${_server._url}/public/file/formato.xls`} target="_blank" className="text-white">
                                        Formato
                                    </a>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
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
                        options={{
                            clientes_activos,
                            productos_cliente,
                            textos_cliente,
                            operaciones,
                            estados_act
                        }}
                        arr={form}
                        disabled={_disabled}
                        content={content}
                        handleSubmit={this.handleAdd.bind(this)}
                        optionsChange={this.handleOptionsChange.bind(this)}
                    />
                    <div className="row">
                        <div className="col-md-10">
                            <Tooltip title="Permite cargar una nueva imagen al sistema">
                                <Upload
                                    {...propsUpload}
                                >
                                    <Button
                                        type="primary"
                                        htmlType="button"
                                    >
                                        <Icon type="upload" /> Excel
                                    </Button>
                                </Upload>
                            </Tooltip>
                        </div>
                        <div className="col-md-2 text-right">
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
        const { user, file } = this.state;
        values.id_usuario = user.id_usuario;
        values.file = file;
        this.props.dispatch(mailActionts.addLot(values));
        this.setState({ file: null });
    }

    handleOptionsChange(value, res) {
        console.log(value, res);
        if (res == 'id_operation') {
            this.setState({ id_operation: value });
            this.props.dispatch(clientActionts.getActivos({ 'id_operation': value }));
        } else if (res == 'id_cliente') {
            const { id_operation } = this.state;
            var data = {
                id_operation,
                id_cliente: value
            };
            this.props.dispatch(clientActionts.getProductoCliente(data));
            this.props.dispatch(textActionts.getTextoCliente(data));
            this.props.dispatch(mailActionts.getEstadosAct(data));
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
        const { modal_detalle, content } = this.state;
        return (
            <Rodal
                animation={'slideLeft'}
                duration={500}
                visible={modal_detalle}
                onClose={() => this.setState({ modal_detalle: !modal_detalle })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 1000 || window.innerHeight < 550 ? window.innerWidth : 1000)}
                height={(window.innerWidth < 1000 || window.innerHeight < 550 ? window.innerHeight : 550)}
            >
                <div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="p-0 m-0 h4">
                                DETALLE LOTE
                            </p>
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
                                            if ( date != null ) {
                                                var _conten = content;
                                                _conten.date_start = date;
                                                this.setState({ content: _conten }, () => {
                                                    this.handleSearch();
                                                });
                                            }
                                        }}
                                        value={content && content.date_start ? content.date_start : moment()}
                                    />
                                </div>
                                <div className="col-6">
                                    <Tooltip title="Permite filtrar registros por un rango de fechas"><b>Fecha Fin:</b></Tooltip>
                                    <DatePicker
                                        className="inp"
                                        format="DD-MM-YYYY"
                                        onChange={(date) => {
                                            if ( date != null ) {
                                                var _conten = content;
                                                _conten.date_end = date;
                                                this.setState({ content: _conten }, () => {
                                                    this.handleSearch();
                                                });
                                            }
                                        }}
                                        value={content && content.date_end ? content.date_end : moment()}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 text-center mt-3">
                            <Search
                                placeholder="Control"
                                onSearch={(value) => {
                                    this.handleSearch(value);
                                }}
                                enterButton
                            />
                        </div>
                        <div className="col-md-4 text-right mt-3">
                            <Tooltip title="Permite generar un archivo .xlsx">
                                <Button type="primary" icon="download">
                                    <a href={this.handleGetUrl()} target="_blank" className="text-white">
                                        Reporte
                                    </a>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
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
            id_thread: thread.id_thread,
            enviado: send,
            date_start: moment(thread.fecha_creacion, "DD-MM-YYYY").format('YYYY-MM-DD'),
            date_end: moment(thread.fecha_creacion, "DD-MM-YYYY").format('YYYY-MM-DD')            
        };
        this.props.dispatch(mailActionts.get(data));
        this.setState({
            modal_detalle: true,
            content: {
                enviado: send,
                id_thread: thread.id_thread 
            }
        });
    }

    handleSearch(control = '') {
        const { content } = this.state;
        const data = {
            id_thread: content.id_thread,
            enviado: content.enviado,
            date_start: content.date_start ? content.date_start.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            date_end: content.date_end ? content.date_end.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), 
            control         
        };
        this.props.dispatch(mailActionts.get(data));
        var _content = content; 
        _content.control = control;
        this.setState({ 
            content: _content
         })
    }

    handleGetUrl() {
        const { content } = this.state;       
        const date_start = content && content.date_start ? content.date_start.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const date_end = content && content.date_end ? content.date_end.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const control = content && content.control ? content.control : '';
        const id_thread = content && content.id_thread ? content.id_thread : 0;
        const enviado = content && content.enviado ? content.enviado : 0;
        return `${_server._url}/src/report/outbound_correos.php?DTS=${date_start}$DTE=${date_end}&TH=${id_thread}&ENV=${enviado}&CNT=${control}`;
    }
}

function mapsStateToProps(state) {
    const { _mails, _clients, _texts } = state;
    const { textos_cliente } = _texts;
    const { mails, lote, threads, _disabled, estados_act, _loading } = _mails;
    const { clientes_activos, productos_cliente, operaciones } = _clients;
    return { mails, lote, clientes_activos, productos_cliente, textos_cliente, threads, _disabled, operaciones, estados_act, _loading };
}

export default connect(mapsStateToProps)(Mail);