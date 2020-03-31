import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Form, Icon } from "antd";

import UserActions from "../../_actionts/user.actionts";

const { Item } = Form;
// const _fondo = require('../../media/fondo.jpg');

class Login extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            // <div className="fondo" style={{ backgroundImage: `url(${_fondo})` }}>
            <div className="fondo">
                <div className="login">
                    <Form ref={ref => this.formulariote = ref} onSubmit={this.handleLogin.bind(this)} className="form form-horizontal">
                        <Item>
                            {getFieldDecorator('usuario', {
                                rules: [{ required: true, message: 'Por favor ingrese un usuario' }],
                                initialValue: ''
                            })(
                                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Usuario" />
                            )}
                        </Item>

                        <Item>
                            {getFieldDecorator('pass', {
                                rules: [{ required: true, message: 'Por favor ingrese un Contraseña' }],
                                initialValue: ''
                            })(
                                <Input size="large" type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Contraseña" />
                            )}
                        </Item>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block" type="submit">
                                Enviar
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    handleLogin(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(UserActions.login(values));
            }
        });
    }
}

export default connect()(Form.create()(Login));