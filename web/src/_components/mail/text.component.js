import React, { Component } from "react";
import { connect } from "react-redux";
import { Tooltip, Button, Switch } from "antd";
import Rodal from "rodal";

import textActionts from "../../_actionts/text.actionts";
import clientActions from "../../_actionts/client.actionts";
import Table from "../../_helpers/Table";
import Form from "../../_helpers/Form";
import TextEditor from "../../_helpers/TextEditor";
import Functions from "../../_helpers/Functions";

const table = [
    { header: 'Operacion', value: 'operacion', filter: true, type: 1 },
    { header: 'Cliente', value: 'nombre', filter: true, type: 1 },
    { header: 'Descripcion', value: 'descripcion', filter: true, type: 1 },
    { header: 'Titulo', value: 'subject', filter: true, type: 1 },
    { header: 'Suspendido', value: 'estado', filter: true, type: 7 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, discontinued: true }
];
const form = [
    { name: 'Operacion', value: 'id_operation', required: true, type: 7, option: 'operaciones', change: true, col: 6 },
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_activos', col: 6 },
    { name: 'Correo de envio', value: 'sender', required: true, type: 1, icon: 'mail' },
    { name: 'Titulo', value: 'subject', required: true, type: 1, icon: 'font-size' },
    { name: 'Descripcion', value: 'descripcion', required: true, type: 1, icon: 'bold' }
];

class Text extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_texto: undefined,
            modal: false,
            estado: true,
            content: undefined
        }
    }

    componentDidMount() {
        this.props.dispatch(textActionts.get());
        this.props.dispatch(clientActions.getOperation());
        this.props.dispatch(textActionts.getImagesACT());
    }

    render() {
        const { modal } = this.state;
        const { textos } = this.props;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
                <dv className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="m-0 p-0 h3">TEXTO CORREO</p>
                        <p className="m-0 p-0">Permite administrar las diferentes platillas de texto a utilizar en el envió de correos electrónicos dentro del sistema.</p>
                    </div>
                </dv>

                <div className="row">
                    <div className="col-md-2 offset-md-10 text-right mt-3">
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
                    data={textos}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                />
            </div>
        );
    }

    handleModal() {
        const { modal, id_texto, content, estado } = this.state;
        const { images_activas, operaciones, clientes_activos } = this.props;
        return (
            <Rodal
                animation="flip"
                duration={500}
                visible={modal}
                onClose={() => this.setState({ modal: false })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={window.innerWidth - 100}
                height={window.innerHeight - 100}
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
                            <p className="m-0 p-0 h-4"><b>{id_texto ? 'EDITAR' : 'NUEVO'} TEXTO CORREO</b></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Form
                                edit={true}
                                footer={true}
                                options={{ clientes_activos, operaciones }}
                                arr={form}
                                content={content}
                                handleSubmit={this.handleSubmit.bind(this)}
                                optionsChange={this.handleOptionsChange.bind(this)}
                            />
                        </div>
                        <div className="col-md-8">
                            <TextEditor
                                body={content && content.body ? content.body : ''}
                                onEditorChange={this.handleOnEditorChange.bind(this)}
                                height={window.innerHeight - 200}
                                image_list={images_activas}
                            />
                        </div>
                    </div>
                </div>
            </Rodal>
        );
    }

    handleOptionsChange(value, res) {
        this.props.dispatch(clientActions.getActivos({ 'id_operation': value }));
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
        
        this.props.dispatch(textActionts.add(values));
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
        this.props.dispatch(textActionts.changeStatusText(data));
    }

    handleEdit(texto) {
        this.handleOptionsChange(texto.id_operation, texto);
        const estado = texto.estado == 0 ? true : false;
        this.setState({
            estado,
            id_texto: texto.id_texto,
            content: texto,
            modal: true
        });
    }
}

function mapsStateToProps(state) {
    const { _clients, _texts } = state;
    const { textos, images_activas } = _texts;
    const { operaciones, clientes_activos } = _clients;
    return { textos, images_activas, operaciones, clientes_activos };
}

export default connect(mapsStateToProps)(Text);
