import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import React, { Component } from 'react';

import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    }
    this.buttons = [
      'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough',
      'subscript', 'superscript', '|', 'fontFamily', 'fontSize',
      'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat',
      'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
      '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly',
      'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters',
      'insertHR', 'selectAll', 'clearFormatting', '|', 'print',
      'spellChecker', 'help', 'html', '|', 'undo', 'redo'
    ]
  }

  handleModelChange = (model) => {
    console.log(model)
    this.setState({
      content: model
    });
  }

  render() {
    return (
      <div className="App">
        <FroalaEditor
          config={{
            placeholderText: 'Enter a description for this job...',
            theme: "dark",
            toolbarButtons: this.buttons,
            imageUpload: true,
            imageUploadURL: 'https://api.cloudinary.com/v1_1/nnlinh97/image/upload',
            imageUploadMethod: 'POST',
            // imageUploadParams: {
            //   api_key: "228277751919448",
            //   upload_preset: "aWV2NQ0bVg6523NVzsd-jynMwGI"
            // },
            // imageUploadParam: 'linh',
            imageUploadRemoteUrls: true,
            events: {
              'froalaEditor.image.uploaded': (e, editor, response) => {
                response = JSON.parse(response);
                // console.log(response  )
                editor.image.insert(response.secure_url, true, null, editor.image.get(), null)
                return false
              }
            }
          }}
          model={this.state.content}
          onModelChange={this.handleModelChange}
        />

      </div>
    );
  }
}

export default App;
