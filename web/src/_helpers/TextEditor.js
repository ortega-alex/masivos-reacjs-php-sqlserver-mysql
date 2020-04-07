import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";

class TextEditor extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { body, height, disabled } = this.props
        return(
            <Editor
                initialValue={body}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                }}
                onEditorChange={(value) => {
                    if (!disabled) {
                        this.props.onEditorChange(value);
                    }
                }}
                disabled={disabled ? disabled : false}
            /> 
        );
    }
}

export default TextEditor;