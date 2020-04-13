import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";

class TextEditor extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { body, height, disabled, image_list } = this.props
        return (
            <Editor
                initialValue={body}
                init={{
                    height: height,
                    menubar: 'insert',
                    selector: 'textarea',  // change this value according to your HTML
                    plugins: [
                        'image',
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'image | undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help',
                    image_list: image_list,
                    language: 'es',
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