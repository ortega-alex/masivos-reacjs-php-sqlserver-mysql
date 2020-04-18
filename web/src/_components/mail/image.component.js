import React, { Component } from "react";
import { connect } from "react-redux";
import { Tooltip, Button, Upload, Icon } from "antd";

import textActionts from "../../_actionts/text.actionts";
import Table from "../../_helpers/Table";

const table = [
    { header: 'Fecha', value: 'fecha', filter: true, type: 1 },
    { header: 'Titulo', value: 'title', filter: true, type: 1 },
    { header: 'Estado', value: 'estado', filter: true, type: 7 },
    { header: 'Opciones', value: null, filter: false, type: 4, discontinued: true }
];

class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_image: undefined,
            estado: true,
            content: undefined,
            file: null,
            uploading: false
        }
    }

    componentDidMount() {
        this.props.dispatch(textActionts.getImages());
    }

    render() {
        const { uploading } = this.state;
        const { images } = this.props;
        const propsUpload = {
            disabled: uploading,
            onRemove: () => { this.setState({ file: null }); },
            onChange: (info) => {
                info.file.status = "done";
                this.setState({ subiendo: false })
            },
            multiple: false,
            customRequest: ({ onSuccess, onError, file }) => {
                this.setState({ subiendo: true, file });
                this.props.dispatch(textActionts.addImage({ file }));
            },
            accept: ".jpg",
            listType: "picture",
            name: 'file',
        };

        return (
            <div>
                <dv className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="m-0 p-0 h3">IMAGENES PARA CORREOS ELECTRONICOS</p>
                        <p className="m-0 p-0">Permite administrar diferentes plantillas de imágenes para configurar los textos a envía vía correo electrónico</p>
                    </div>
                </dv>

                <div className="row">
                    <div className="col-md-2 offset-md-10 text-right mt-3">
                        <Tooltip title="Permite cargar una nueva imagen al sistema">
                            <Upload
                                {...propsUpload}
                            >
                                <Button
                                    type="primary"
                                    htmlType="button"
                                >
                                    <Icon type="upload" /> Nueva
                            </Button>
                            </Upload>
                        </Tooltip>
                    </div>
                </div>
                <Table
                    data={images}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                />
            </div>
        );
    }

    handleEditEstado(value, image) {
        const data = {
            id_image: image.id_image,
            estado: (value == true ? 0 : 1)
        };
        this.props.dispatch(textActionts.changeStatusImage(data));
    }
}

function mapsStateToProps(state) {
    const { _texts } = state;
    const { images } = _texts;
    return { images };
}

export default connect(mapsStateToProps)(Image);
