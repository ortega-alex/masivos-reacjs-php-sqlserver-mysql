import React, { Component } from 'react';
import { Tooltip, Switch, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faCheck, faFileAlt, faTrash, faCheckDouble, faBan, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Functions from './Functions';

class Table extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, arr, height } = this.props;
        return (
            <div className="row">
                <div
                    className='ag-theme-balham' style={{ width: '100%', height: height ? height : '70vh' }}
                >
                    <AgGridReact
                        floatingFilter={true}
                        enableSorting={true}
                        animateRows={true}
                        enableColResize={true}
                        rowSelection='single'
                        onGridReady={(params) => { params.api.sizeColumnsToFit(); }}
                        rowData={data}
                    >
                        {arr &&
                            arr.map((res, i) => {
                                return (
                                    res.type == 1 ? this.handleText(res, i)
                                        : (res.type == 2 ? this.handleMoney(res, i)
                                            : (res.type == 3) ? this.handleStatus(res, i)
                                                : (res.type == 4) ? this.handleOptios(res, i)
                                                    : (res.type == 5) ? this.handleNumber(res, i)
                                                        : this.handleStatusEmal(res, i))
                                )
                            })
                        }
                    </AgGridReact>
                </div>
            </div>
        );
    }

    handleText(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={20} minWidth={100} sortable={res.filter} filter={res.filter}
                cellRendererFramework={(param) => {
                    return (
                        <Tooltip title={param.value}>
                            {param.value}
                        </Tooltip>
                    );
                }}
            />
        );
    }

    handleMoney(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={20} minWidth={100} sortable={res.filter} filter={res.filter} cellStyle={{ 'text-align': "right" }}
                cellRendererFramework={(param) => {
                    return (
                        <div style={{ color: (param.value < 0) ? '#dc3545' : '#343a40' }}>
                            {param.value != null ? Functions.commaSeparateNumber(parseFloat(param.value).toFixed(2)) : ''}
                        </div>
                    );
                }}
            />
        );
    }

    handleNumber(res, i) {
        return (
            <AgGridColumn
                key={i}
                headerName={res.header}
                field={res.value}
                width={20}
                minWidth={100}
                sortable={res.filter}
                filter={res.filter}
                cellStyle={{ 'text-align': "center" }}
            />
        );
    }

    handleStatus(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={15} minWidth={100}
                cellStyle={(param) => ((param.value == 0) ? { color: 'green' } : { color: 'red' })}
                cellRendererFramework={(param) => {
                    return (
                        <div className="text-center">
                            <FontAwesomeIcon icon={(param.value == 1) ? faUnlock : faLock} />&nbsp;{(param.value == 0) ? 'Activo' : 'Inactivo'}
                        </div>
                    );
                }}
            />
        );
    }


    handleStatusEmal(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={15} minWidth={100}
                cellStyle={(param) => ((param.value == 0) ? { color: '#e0e0e0' } : ((param.value) == 1 || (param.value) == 2) ? { color: 'green' } : { color: 'red' })}
                cellRendererFramework={(param) => {
                    return (
                        <div className="text-center">
                            <FontAwesomeIcon
                                icon={(param.value == 0 || param.value == 1) ? faCheck : (param.value == 2 ? faCheckDouble : faBan)}
                            />
                        </div>
                    );
                }}
            />
        );
    }

    handleOptios(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field="data" width={15} minWidth={100}
                cellRendererFramework={(param) => {
                    return (
                        <div className="text-right">
                            {res.edit &&
                                <button className="btn btn-sm" onClick={() => { this.props.handleEdit(param.data) }} >
                                    <FontAwesomeIcon icon={faEdit} color="#1890ff" size="sm" />
                                </button>
                            }
                            {res.detalle &&
                                <button className="btn btn-sm" onClick={() => { this.props.handleDetalle(param.data) }} >
                                    <FontAwesomeIcon icon={faFileAlt} color="#1890ff" size="sm" />
                                </button>
                            }
                            {res.delete &&
                                <button className="btn btn-sm"
                                    onClick={this.props.handleDelete.bind(this, param.data)}
                                >
                                    <FontAwesomeIcon icon={faTrash} color="#d32f2f" size="sm" />
                                </button>
                            }
                            {res.permiso &&
                                <button className="btn btn-sm" onClick={() => { this.props.handlePermisos(param.data) }} >
                                    <FontAwesomeIcon icon={faLock} color="#1890ff" size="sm" />
                                </button>
                            }
                            {res.status &&
                                <Switch size="small" defaultChecked={(param.data.estado == 0) ? true : false}
                                    onChange={(valor) => this.props.handleEditEstado(valor, param.data)} />
                            }
                            {res.check &&
                                <Checkbox
                                    onChange={(value) => {
                                        this.props.handleOnCheck(value, param.data)
                                    }}>
                                </Checkbox>
                            }
                        </div>
                    )
                }}
            />
        );
    }
}

export default Table;