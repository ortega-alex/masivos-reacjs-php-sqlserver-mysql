import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Link } from 'react-router-dom';
import { Menu as MenuAntd, Icon, Button } from 'antd';
import { AsyncStorage } from 'AsyncStorage';

import UserActions from "../../_actionts/user.actionts";
import Message from "../message/message.component";
import Mail from "../mail/mail.component";
import Notification from "../../_helpers/Notification";
import mailActionts from '../../_actionts/mail.actionts';
import Text from "../mail/text.component";
import Image from "../mail/image.component";
import ClientTMK from '../client_product/clientTMK.component';
import  ProductTMK from "../client_product/productTMK.component";

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
        const { notification } = this.props;
        return (
            <HashRouter>
                {(notification && pathname != '/') &&
                    this.handleNotificacion()
                }
                <MenuAntd
                    mode="horizontal"
                    defaultSelectedKeys={[pathname]}
                    className="menu"
                >
                    <Item key="/" >
                        <Link to="/"
                            onClick={() => { this.setState({ pathname: "/" }) }}
                            style={{ color: pathname == '/' ? 'green' : color }}
                        >
                            <Icon type="mail" />
                            <span>Correos</span>
                        </Link>
                    </Item>
                    <Item key="/message">
                        <Link to="/message"
                            onClick={() => { this.setState({ pathname: "/message" }) }}
                            style={{ color: pathname == '/message' ? 'green' : color }}
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
                        style={{ marginLeft: window.innerWidth < 500 ? 0 : window.innerWidth - 500 }}
                    >
                        <Item disabled="true">
                            <Icon type="user" />
                            <span>{user.nombre}</span>
                        </Item>
                        <SubMenu
                            title={
                                <span>
                                    <Icon type="usergroup-add" />
                                    <span>Clientes</span>
                                </span>
                            }
                        >
                            <Item key="/client_tmk">
                                <Link to="/client_tmk"
                                    onClick={() => { this.setState({ pathname: "/client_tmk" }) }}
                                >
                                    <Icon type="credit-card" />
                                    <span>TMK</span>
                                </Link>
                            </Item>
                        </SubMenu>
                        <SubMenu
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>Correo</span>
                                </span>
                            }
                        >
                            <Item key="/imagenes">
                                <Link to="/imagenes"
                                    onClick={() => { this.setState({ pathname: "/imagenes" }) }}
                                >
                                    <Icon type="file-image" />
                                    <span>Imagenes</span>
                                </Link>
                            </Item>
                            <Item key="/textos">
                                <Link to="/textos"
                                    onClick={() => { this.setState({ pathname: "/textos" }) }}
                                >
                                    <Icon type="file-done" />
                                    <span>Textos</span>
                                </Link>
                            </Item>
                        </SubMenu>
                        <SubMenu
                            title={
                                <span>
                                    <Icon type="usergroup-add" />
                                    <span>Productos</span>
                                </span>
                            }
                        >
                            <Item key="/product_tmk">
                                <Link to="/product_tmk"
                                    onClick={() => { this.setState({ pathname: "/product_tmk" }) }}
                                >
                                    <Icon type="credit-card" />
                                    <span>TMK</span>
                                </Link>
                            </Item>
                        </SubMenu>
                        <Item onClick={this.cerrarSession.bind(this)}>
                            <Icon type="logout" />
                            <span>Cerrar session</span>
                        </Item>
                    </SubMenu>
                </MenuAntd>

                <div className="m-3">
                    <Route path="/" exact component={Mail} />
                    <Route path="/message" component={Message} />
                    <Route path="/textos" component={Text} />
                    <Route path="/imagenes" component={Image} />
                    <Route path="/client_tmk" component={ClientTMK} />
                    <Route path="/product_tmk" component={ProductTMK} />
                </div>
            </HashRouter>
        );
    }

    cerrarSession() {
        this.props.dispatch(UserActions.logout());
    }

    handleNotificacion() {
        const { notifications_thread } = this.props
        return (
            <div className="notificaions">
                {notifications_thread && Object.keys(notifications_thread).map((item, i) => {
                    return (
                        <Notification
                            key={i}
                            thread={notifications_thread[item]}
                            handleClose={this.handleClose.bind(this)}
                            handleOpen={this.handleLink.bind(this)}
                        />
                    )
                })}
            </div>
        );
    }

    handleClose(id_thread) {
        this.props.dispatch(mailActionts.removeNotificationThread(id_thread));
    }

    handleLink(id_thread) {
        return (
            <Link to="/"
                onClick={() => {
                    this.setState({ pathname: "/" });
                    this.props.dispatch(mailActionts.removeNotificationThread(id_thread));
                }}
            >
                <Button type="primary" size="small" icon="mail">
                    <span>ABRIR</span>
                </Button>
            </Link>
        );
    }
}

function mapsProsToState(state) {
    const { _mails } = state;
    const { notification, notifications_thread } = _mails;
    return { notification, notifications_thread };
}

export default connect(mapsProsToState)(Menu);