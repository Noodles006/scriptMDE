import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'codemirror';
import { initEditor, updateMarkdown } from '../actions/Markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/theme/monokai.css';

require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/search/search.js");
require("codemirror/addon/dialog/dialog.js");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/edit/closebrackets.js");
require("codemirror/addon/comment/comment.js");
require("codemirror/addon/wrap/hardwrap.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/mode/markdown/markdown.js");
require("codemirror/mode/gfm/gfm.js");
require("codemirror/mode/javascript/javascript.js");
require("codemirror/keymap/sublime.js");

class Editor extends Component {
  componentDidMount() {
    const { text, dispatch } = this.props;

    const editorNode = document.getElementById('smd-editor');
    const codemirror = CodeMirror.fromTextArea(editorNode, {
      // value: text,
      mode: {
        name: 'gfm',
      },
      backdrop: 'gfm',
      // mode: 'markdown',
      keyMap: "sublime",
      theme: "monokai",
      tabSize: 2,
      indentUnit: 2,
      indentWithTabs: true,
      lineNumbers: true,
      autofocus: false,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
    });

    codemirror.on('change', (cm) => {
      const text = cm.getValue();
      dispatch(updateMarkdown(text));
    });

    // init editor in store
    dispatch(initEditor(codemirror));
  }

  render() {
    return (
      <div
        hidden={this.props.hidden}
        className="smd-edit-area col"
      >
        <textarea id="smd-editor"></textarea>
      </div>
    );
  }
}

export default connect()(Editor);
