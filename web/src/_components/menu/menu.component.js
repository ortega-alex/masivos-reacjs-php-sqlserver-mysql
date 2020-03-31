import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { Menu as MenuAntd, Button, Switch, Icon, Tooltip } from 'antd';
import { AsyncStorage } from 'AsyncStorage';

import UserActions from "../../_actionts/user.actionts";
import Message from "../message/message.component";
import Mail from "../mail/mail.component";

const { Item, SubMenu } = MenuAntd;

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: '/',
            loadin: false,
            user: {},
            color: 'white'
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('login_massive', (err, res) => {
            if (!err && res && res != "undefined") {
                const user = JSON.parse(res);
                this.setState({ user });
            }
        });
    }

    render() {
        const { pathname, user, color } = this.state;
        return (
            <HashRouter>
                <MenuAntd
                    mode="horizontal"
                    defaultSelectedKeys={[pathname]}
                    className="menu"
                >
                    <Item key="/" >
                        <Link to="/"
                            onClick={() => { this.setState({ pathname: "/" }) }}
                            style={{ color: pathname == '/' ? 'black' : color }}
                        >
                            <Icon type="mail" />
                            <span>Correos</span>
                        </Link>
                    </Item>
                    <Item key="/message">
                        <Link to="/message"
                            onClick={() => { this.setState({ pathname: "/message" }) }}
                            style={{ color: pathname == '/message' ? 'black' : color }}
                        >
                            <Icon type="message" />
                            <span>Mensajes</span>
                        </Link>
                    </Item>

                    <SubMenu
                        title={
                            <span style={{ color: color }}>
                                <Icon type="setting" />
                                <span>Configuracion</span>
                            </span>
                        }
                        className="menu-user"
                    >
                        <Item disabled="true">
                            <Icon type="user" />
                            <span>{user.nombre}</span>
                        </Item>
                        <Item onClick={this.cerrarSession.bind(this)}>
                            <Icon type="logout" />
                            <span>Cerrar session</span>
                        </Item>
                    </SubMenu>
                </MenuAntd>

                <div className="container mt-3">
                    <Route path="/" exact component={Mail} />
                    <Route path="/message" component={Message} />
                </div>
            </HashRouter>
        );
    }

    cerrarSession() {
        this.props.dispatch(UserActions.logout());
    }
}

export default Menu;