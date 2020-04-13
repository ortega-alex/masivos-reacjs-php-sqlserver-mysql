import React, { Component } from "react";
import { connect } from "react-redux";
import { Tooltip, Select, Button, Switch } from "antd";
import Rodal from "rodal";

import clientActionts from "../../_actionts/client.actionts";
import Table from "../../_helpers/Table";
import Form from "../../_helpers/Form";
import TextEditor from "../../_helpers/TextEditor";
import Functions from "../../_helpers/Functions";

const { Option } = Select;
const table = [
    { header: 'Cliente', value: 'nombre', filter: true, type: 1 },
    { header: 'Descripcion', value: 'descripcion', filter: true, type: 1 },
    { header: 'Titulo', value: 'subject', filter: true, type: 1 },
    { header: 'Suspendido', value: 'estado', filter: true, type: 3 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true }
];
const form = [
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes', col: 6 },
    { name: 'Correo de envio', value: 'sender', required: true, type: 1, icon: 'mail', col: 6 },
    { name: 'Titulo', value: 'subject', required: true, type: 1, icon: 'font-size', col: 6 },
    { name: 'Descripcion', value: 'descripcion', required: true, type: 1, icon: 'bold', col: 6 }
];

class Text extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_texto: undefined,
            modal: false,
            estado: true,
            content: undefined,
            _textos: undefined
        }
    }

    componentDidMount() {
        this.props.dispatch(clientActionts.getTextos());
        this.props.dispatch(clientActionts.get());
        this.props.dispatch(clientActionts.getImagesACT());
    }

    render() {
        const { modal, _textos } = this.state;
        const { textos, clientes } = this.props;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
                <dv className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="m-0 p-0 h3">TEXTO CORREO</p>
                        <p className="m-0 p-0">informacion adicional que describe accion</p>
                    </div>
                </dv>

                <div className="row">
                    <div className="col-md-2">
                        <Tooltip title="Permite filtrar por el cliente"><b>Cliente:</b></Tooltip>
                        <Select
                            className="inp"
                            showSearch
                            autoClearSearchValue
                            placeholder="Selecciona un cliente"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={(value) => this.handleFilterTexts(value)}
                        >
                            {clientes && clientes.map((item, i) => (
                                <Option key={i} value={item.id_cliente}>{item.nombre}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-md-2 offset-md-8 text-right mt-3">
                        <Tooltip title="Permite configurar un nuevo texto dentro del sistema">
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
                <Table
                    data={_textos ? _textos : textos}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                />
            </div>
        );
    }

    handleFilterTexts(value) {
        this.setState({ _textos: undefined }, () => {
            if (value != '' || value != null) {
                const { textos } = this.props;
                var _textos = textos.filter(item => {
                    return item.id_cliente == value;
                });
                this.setState({ _textos });
            }
        });
    }

    handleModal() {
        const { modal, id_texto, content, estado } = this.state;
        const { clientes, images_activas } = this.props;
        return (
            <Rodal
                animation="flip"
                duration={500}
                visible={modal}
                onClose={() => this.setState({ modal: false })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(600)}
                height={600}
            >
                <div className="txt-mail">
                    <div className="row">
                        <div className="col-md-2">
                            <Tooltip title="Activar/Desactivar" placement='right'>
                                <div>
                                    <Switch
                                        defaultChecked={estado}
                                        checkedChildren="Activo"
                                        unCheckedChildren="Inactivo"
                                        onChange={(value) => this.setState({ estado: value })}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="col-md-8 text-center">
                            <p className="m-0 p-0 h-4">{id_texto ? 'EDITAR' : 'NUEVO'} TEXTO CORREO</p>
                        </div>
                    </div>
                    <Form
                        edit={true}
                        footer={true}
                        options={{ clientes }}
                        arr={form}
                        content={content}
                        handleSubmit={this.handleSubmit.bind(this)}
                    />
                    <TextEditor
                        body={content && content.body ? content.body : ''}
                        onEditorChange={this.handleOnEditorChange.bind(this)}
                        height={300}
                        image_list={images_activas}
                    />
                </div>
            </Rodal>
        );
    }

    handleSubmit(values) {
        const { content, id_texto, estado } = this.state;
        if (!Functions.validEmail(values.sender)) {
            Functions.message('warning', 'por favor ingrese un correo valido!');
            return;
        }
        if (!content || !content.body) {
            Functions.message('warning', 'por favor ingrese un texto!');
            return;
        }
        values.id_texto = id_texto;
        values.estado = (estado == true ? 0 : 1);
        values.body = content.body;
        this.props.dispatch(clientActionts.addText(values));
        this.setState({
            id_texto: undefined,
            content: undefined,
            estado: true,
            modal: false
        });
    }

    handleOnEditorChange(value) {
        const { content } = this.state;
        var _content = {};
        if (content) {
            _content = content;
        }
        _content.body = value;
        this.setState({ content: _content });
    }

    handleEditEstado(value, texto) {
        const data = {
            id_texto: texto.id_texto,
            estado: (value == true ? 0 : 1)
        };
        this.props.dispatch(clientActionts.changeStatusText(data));
    }

    handleEdit(texto) {
        const estado = texto.suspendido == 1 ? true : false;
        this.setState({
            estado,
            id_texto: texto.id_texto,
            content: texto,
            modal: true
        });
    }
}

function mapsStateToProps(state) {
    const { _clients } = state;
    const { clientes, textos, images_activas } = _clients;
    return { clientes, textos, images_activas };
}

export default connect(mapsStateToProps)(Text);
