import React, { Component } from "react";
import { Button, Progress } from "antd";

class Notification extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { thread } = this.props
        return (
            <div className="notification">
                <div className="row">
                    <div className="col-2 offset-10 text-right">
                        <Button
                            size="small"
                            type="link"
                            icon="close-circle"
                            onClick={() => this.props.handleClose(thread.id_thread)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <p className="m-0 p-0 h6"><b>{thread.name}</b></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Progress percent={thread.percentage} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 offset-8 mt-2">
                        {this.props.handleOpen(thread.id_thread)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;