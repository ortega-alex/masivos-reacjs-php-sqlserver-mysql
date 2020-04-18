import React, { Component } from "react";
import { connect } from "react-redux";
import { Tooltip, Button, Switch } from "antd";
import Rodal from "rodal";

import clientActions from "../../_actionts/client.actionts";
import Table from "../../_helpers/Table";
import Form from "../../_helpers/Form";
import clientActionts from "../../_actionts/client.actionts";

const table = [
    { header: 'Fecha', value: 'fecha', filter: true, type: 1 },
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Estado', value: 'estado', filter: true, type: 3 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true }
];
const form = [
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' }
];

class ClientTMK extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_cliente: undefined,
            modal: false,
            content: undefined,
            estado: true,
            id_operation: 2
        };
    }

    componentDidMount() {
        const { id_operation } = this.state;
        this.props.dispatch(clientActions.getClientOperation({ id_operation }));
    }

    render() {
        const { modal } = this.state;
        const { clientes_operacion } = this.props;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
                <dv className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="m-0 p-0 h3">CLIENTES TMK</p>
                        <p className="m-0 p-0">Permite administrar las diferentes cliente de TMK dentro del sistema.</p>
                    </div>
                </dv>

                <div className="row">
                    <div className="col-md-2 offset-md-10 text-right mt-3">
                        <Tooltip title="Permite configurar un nuevo texto dentro del sistema">
                            <Button
                                type="primary"
                                icon="plus-circle"
                                onClick={() => this.setState({ modal: true, id_cliente: undefined, estado: true, content: undefined })}
                            >
                                Nuevo
                        </Button>
                        </Tooltip>
                    </div>
                </div>
                <Table
                    data={clientes_operacion}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                />
            </div>
        )
    }

    handleEditEstado(value, cliente) {
        const { id_operation } = this.state;
        const data = {
            id_cliente: cliente.id_cliente,
            estado: value == true ? 1 : 0,
            id_operation
        };
        this.props.dispatch(clientActionts.changeStatus(data));
    }

    handleEdit(cliente) {
        this.setState({
            id_cliente: cliente.id_cliente,
            estado: cliente.estado == 1 ? true : false,
            content: cliente,
            modal: true
        });
    }

    handleModal() {
        const { modal, id_cliente, content, estado } = this.state;
        return (
            <Rodal
                animation="flip"
                duration={500}
                visible={modal}
                onClose={() => this.setState({ modal: false })}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={400}
                height={300}
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
                            <p className="m-0 p-0 h-4"><b>{id_cliente ? 'EDITAR' : 'NUEVO'} CLIENTE</b></p>
                        </div>
                    </div>
                    <Form
                        edit={true}
                        footer={true}
                        arr={form}
                        content={content}
                        handleSubmit={this.handleSubmit.bind(this)}
                    />
                </div>
            </Rodal>
        );
    }

    handleSubmit(values) {
        const { id_operation, id_cliente, estado } = this.state;
        values.id_cliente = id_cliente;
        values.estado = estado == true ? 1 : 0;
        values.id_operation = id_operation;
        this.props.dispatch(clientActions.add(values));
        this.setState({
            id_cliente: undefined,
            content: undefined,
            estado: true,
            modal: false
        });
    }
}

function mapsStateToProps(state) {
    const { _clients } = state;
    const { clientes_operacion } = _clients;
    return { clientes_operacion };
}

export default connect(mapsStateToProps)(ClientTMK);