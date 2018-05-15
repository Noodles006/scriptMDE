import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import ToolbarAction from '../actions/Toolbar';
import PageAction from '../actions/Page';
import ToolbarBtnGroup from '../components/ToolbarBtnGroup';
import CONSTANTS from '../constants';

class Toolbar extends Component {
  getToolbars(editor, mode) {
    const toolbars = [];

    const modeToolbar = {
      id: 'mode',
      groups: [
        [
          {
            icon: 'eye',
            tooltip: 'View mode',
            theme: 'dark',
            click: () => this.props.setPageMode('view'),
          },
          {
            icon: 'columns',
            tooltip: 'Split mode',
            theme: 'dark',
            click: () => this.props.setPageMode('split'),
          },
          {
            icon: 'edit',
            tooltip: 'Edit Mode',
            theme: 'dark',
            click: () => this.props.setPageMode('edit'),
          }
        ]
      ]
    };

    const basicToolbar = {
      id: 'basic',
      groups: [
        [
          {
            icon: 'heading',
            tooltip: 'Add header text',
            click: () => this.props.head(editor),
          },
          {
            icon: 'bold',
            tooltip: 'Bold',
            click: () => this.props.basic(editor, 'bold'),
          },
          {
            icon: 'italic',
            tooltip: 'Italic',
            click: () => this.props.basic(editor, 'italic'),
          },
          {
            icon: 'strikethrough',
            tooltip: 'Strikethrough',
            click: () => this.props.basic(editor, 'strikethrough'),
          }
        ],
        [
          {
            icon: 'quote-left',
            tooltip: 'Quote',
            click: () => this.props.basic(editor, 'quote'),
          },
          {
            icon: 'code',
            tooltip: 'Code',
            click: () => this.props.basic(editor, 'code'),
          },
          {
            icon: 'link',
            tooltip: 'Add a link',
            click: () => this.props.basic(editor, 'link'),
          }
        ],
        [
          {
            icon: 'list-ul',
            tooltip: 'Generic List',
            click: () => this.props.list(editor, 'ul'),
          },
          {
            icon: 'list-ol',
            tooltip: 'Numbered List',
            click: () => this.props.list(editor, 'ol'),
          },
          {
            icon: 'check-square',
            tooltip: 'Checkbox',
            click: () => this.props.basic(editor, 'checkbox'),
          }
        ],
        [
          {
            icon: 'image',
            tooltip: 'Add a image',
            click: () => this.props.basic(editor, 'image'),
          },
          {
            icon: 'table',
            tooltip: 'Add a table',
            click: () => this.props.basic(editor, 'table'),
          },
          {
            icon: 'comment',
            tooltip: 'Add a comment',
            click: () => this.props.basic(editor, 'comment'),
          }
        ],
        [
          {
            icon: 'fab stripe-s',
            tooltip: 'Sequence diagram',
            click: () => this.props.basic(editor, 'sequence'),
          },
          {
            icon: 'fab facebook-f',
            tooltip: 'Flow chart',
            click: () => this.props.basic(editor, 'flow'),
          },
          {
            icon: 'fab glide-g',
            tooltip: 'Graphviz',
            click: () => this.props.basic(editor, 'graphviz'),
          },
          {
            icon: 'fab maxcdn',
            tooltip: 'Mermaid',
            click: () => this.props.basic(editor, 'mermaid'),
          },
          {
            icon: 'music',
            tooltip: 'ABC',
            click: () => this.props.basic(editor, 'music'),
          }
        ],
        [
          {
            icon: 'chart-pie',
            tooltip: 'Chart pie',
            click: () => this.props.basic(editor, 'chart-pie'),
          },
          {
            icon: 'chart-line',
            tooltip: 'Chart line',
            click: () => this.props.basic(editor, 'chart-line'),
          },
          {
            icon: 'chart-bar',
            tooltip: 'Chart bar',
            click: () => this.props.basic(editor, 'chart-bar'),
          }
        ]
      ]
    };

    toolbars.push(modeToolbar);

    if (mode !== CONSTANTS.VIEW_MODE) {
      toolbars.push(basicToolbar);
    }

    return toolbars;
  }

  render() {
    const toolbars = this.getToolbars(this.props.editor, this.props.mode);

    return (
      <div className="toolbars">
      <ul className="navbar-nav mr-auto">
      { 
        toolbars.map((toolbar) => {
          const toolbarClassName = `btn-toolbar ${toolbar.id}`;

          return (
            <li className="nav-item">
            <div
              key={toolbar.id}
              className={toolbarClassName}
              role="toolbar"
              aria-label="markdown toolbar"
            >
              {
                toolbar.groups.map((group, index) => <ToolbarBtnGroup key={index} meta={group} />)
              }
            </div>
            </li>
          )
        })
      }
      </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editor: state.editor,
    mode: state.mode,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    head: bindActionCreators(ToolbarAction.head, dispatch),
    basic: bindActionCreators(ToolbarAction.basic, dispatch),
    list: bindActionCreators(ToolbarAction.list, dispatch),
    setPageMode: bindActionCreators(PageAction.setPageMode, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
