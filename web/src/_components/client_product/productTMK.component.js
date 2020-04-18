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
    { header: 'Cliente', value: 'cliente', filter: true, type: 1 },
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Estado', value: 'estado', filter: true, type: 3 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true }
];
const form = [
    { name: 'Cliente', value: 'id_cliente', required: true, type: 7, option: 'clientes_operacion' },
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' }
];

class ProductTMK extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_producto: undefined,
            modal: false,
            content: undefined,
            estado: true,
            id_operation: 2
        };
    }

    componentDidMount() {
        const { id_operation } = this.state;
        this.props.dispatch(clientActions.getProductOperation({ id_operation }));
        this.props.dispatch(clientActions.getClientOperation({ id_operation }));
    }

    render() {
        const { modal } = this.state;
        const { productos_operacion } = this.props;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
                <dv className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="m-0 p-0 h3">PRODUCTOS TMK</p>
                        <p className="m-0 p-0">Permite administrar los diferentes productos de TMK dentro del sistema.</p>
                    </div>
                </dv>

                <div className="row">
                    <div className="col-md-2 offset-md-10 text-right mt-3">
                        <Tooltip title="Permite configurar un nuevo texto dentro del sistema">
                            <Button
                                type="primary"
                                icon="plus-circle"
                                onClick={() => this.setState({ modal: true, id_producto: undefined, estado: true, content: undefined })}
                            >
                                Nuevo
                        </Button>
                        </Tooltip>
                    </div>
                </div>
                <Table
                    data={productos_operacion}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                />
            </div>
        )
    }

    handleEditEstado(value, producto) {
        const { id_operation } = this.state;
        const data = {
            id_producto: producto.id_producto,
            estado: value == true ? 1 : 0,
            id_operation
        };
        this.props.dispatch(clientActionts.changeStatusProduct(data));
    }

    handleEdit(producto) {
        this.setState({
            id_producto: producto.id_producto,
            estado: producto.estado == 1 ? true : false,
            content: producto,
            modal: true
        });
    }

    handleModal() {
        const { modal, id_producto, content, estado } = this.state;
        const { clientes_operacion } = this.props;
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
                            <p className="m-0 p-0 h-4"><b>{id_producto ? 'EDITAR' : 'NUEVO'} PRODUCTO</b></p>
                        </div>
                    </div>
                    <Form
                        edit={true}
                        footer={true}
                        arr={form}
                        content={content}
                        handleSubmit={this.handleSubmit.bind(this)}
                        options={{ clientes_operacion }}
                    />
                </div>
            </Rodal>
        );
    }

    handleSubmit(values) {
        const { id_operation, id_producto, estado } = this.state;
        values.id_producto = id_producto;
        values.estado = estado == true ? 1 : 0;
        values.id_operation = id_operation;
        this.props.dispatch(clientActions.addProduct(values));
        this.setState({
            id_producto: undefined,
            content: undefined,
            estado: true,
            modal: false
        });
    }
}

function mapsStateToProps(state) {
    const { _clients } = state;
    const { productos_operacion, clientes_operacion } = _clients;
    return { productos_operacion, clientes_operacion };
}

export default connect(mapsStateToProps)(ProductTMK);