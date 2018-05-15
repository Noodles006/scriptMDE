import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'codemirror';
import { setPageMode } from '../actions/Page';
import Navbar from './Navbar';
import Editor from './Editor';
import Doc from './Doc';
import syncScroll from '../utils/syncScroll';
import CONSTANTS from '../constants';
import '../styles/style.css';
window.Popper = require('popper.js/dist/popper.min.js');
require('bootstrap/dist/js/bootstrap.min.js');

class App extends Component {
  componentDidMount() {
    const $ = window.$;
    const self = this;
    $(window).on('resize', () => {
      const { mode, dispatch } = this.props;

      if ($(window).width() < 768 && mode === CONSTANTS.SPLIT_MODE) {
        dispatch(setPageMode(CONSTANTS.EDIT_MODE));
      }
    });

    const editElement = document.querySelector('.smd-edit-area .CodeMirror-scroll');
    const viewElement = window.$('.smd-preview-area');
    editElement.addEventListener('scroll', () => window._.throttle(syncScroll.syncScrollToView(this.props.editor, viewElement), 5), true);
    viewElement[0].addEventListener('scroll', () => window._.throttle(syncScroll.syncScrollToEditor(this.props.editor, viewElement), 5), true);
  }

  render() {
    const { markdown, mode } = this.props;
    const containerClassName = `container ${mode !== CONSTANTS.VIEW_MODE ? 'smd-container' : ''}`;

    return (
      <div className="smd-wrapper">
        <header>
          <Navbar />
        </header>
        <div className={containerClassName}>
          <div className="row">
            <Editor hidden={mode === CONSTANTS.VIEW_MODE} text={markdown} />
            <Doc hidden={mode === CONSTANTS.EDIT_MODE} text={markdown} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { markdown, mode, editor } = state;

  return {
    markdown,
    mode,
    editor,
  }
}

export default connect(mapStateToProps)(App);
