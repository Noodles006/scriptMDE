import React, { Component } from 'react';
import markdownit from 'markdown-it';
import mathjax from 'markdown-it-mathjax';
import flowchart from 'flowchart.js';
import Viz from 'viz.js';
import mermaid from 'mermaid';
import abcjs from "abcjs/midi";
import Prism from 'prismjs';
import hljs from 'highlight.js';
import S from 'string';
import util from '../utils/util.js';

import '../styles/mermaid.css';
import '@fortawesome/fontawesome/styles.css';
import 'abcjs/abcjs-midi.css';
import 'highlight.js/styles/github-gist.css';

require('prismjs/themes/prism.css');
require('prismjs/components/prism-wiki');
require('prismjs/components/prism-haskell');
require('prismjs/components/prism-go');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-makefile');
require('prismjs/components/prism-gherkin');

// fix lodash error in js-sequence-diagram
window._ = require('underscore/underscore-min.js');

const createMarkup = (text) => {
	return { __html: text };
};

// regex for extra tags
const spaceregex = /\s*/
const notinhtmltagregex = /(?![^<]*>|[^<>]*<\/)/
let coloregex = /\[color=([#|(|)|\s|,|\w]*?)\]/
coloregex = new RegExp(coloregex.source + notinhtmltagregex.source, 'g')
let nameregex = /\[name=(.*?)\]/
let timeregex = /\[time=([:|,|+|-|(|)|\s|\w]*?)\]/
const nameandtimeregex = new RegExp(nameregex.source + spaceregex.source + timeregex.source + notinhtmltagregex.source, 'g')
nameregex = new RegExp(nameregex.source + notinhtmltagregex.source, 'g')
timeregex = new RegExp(timeregex.source + notinhtmltagregex.source, 'g')

const replaceExtraTags = (html) => {
  html = html.replace(coloregex, '<span class="color" data-color="$1"></span>')
  html = html.replace(nameandtimeregex, '<small><i class="fa fa-user"></i> $1 <i class="fa fa-clock-o"></i> $2</small>')
  html = html.replace(nameregex, '<small><i class="fa fa-user"></i> $1</small>')
  html = html.replace(timeregex, '<small><i class="fa fa-clock-o"></i> $1</small>')
  return html
};

function addPart (tokens, idx) {
  if (tokens[idx].map && tokens[idx].level === 0) {
    const startline = tokens[idx].map[0] + 1
    const endline = tokens[idx].map[1]
    tokens[idx].attrJoin('class', 'part')
    tokens[idx].attrJoin('data-startline', startline)
    tokens[idx].attrJoin('data-endline', endline)
  }
}

class Doc extends Component {
	constructor() {
		super();

    const mdConfig = {
      html: true,
      breaks: true,
      langPrefix: '',
      linkify: true,
      typographer: true,
      highlight: this.highlightRender
    };

    const mathjaxConfig = {
      beforeMath: '<span class="mathjax raw">',
      afterMath: '</span>',
      beforeInlineMath: '<span class="mathjax raw">\\(',
      afterInlineMath: '\\)</span>',
      beforeDisplayMath: '<span class="mathjax raw">\\[',
      afterDisplayMath: '\\]</span>'
    };

		const md = markdownit('default', mdConfig)
              .use(mathjax(mathjaxConfig))
              .use(require('markdown-it-task-lists'), { enabled: true })
              .use(require('markdown-it-emoji'))
              .use(require('markdown-it-abbr'))
              .use(require('markdown-it-footnote'))
              .use(require('markdown-it-deflist'))
              .use(require('markdown-it-mark'))
              .use(require('markdown-it-ins'))
              .use(require('markdown-it-sub'))
              .use(require('markdown-it-sup'))
              .use(require('markdown-it-imsize'));

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'raw')
      return self.renderToken(tokens, idx, options, env, self)
    };

    md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'raw')
      if (tokens[idx].map) {
        const startline = tokens[idx].map[0] + 1
        const endline = tokens[idx].map[1]
        tokens[idx].attrJoin('data-startline', startline)
        tokens[idx].attrJoin('data-endline', endline)
      }
      return self.renderToken(tokens, idx, options, env, self)
    };

    md.renderer.rules.ordered_list_open = function (tokens, idx, options, env, self) {
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    }

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    }

    md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    }

    md.renderer.rules.bullet_list_open = function (tokens, idx, options, env, self) {
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    }

    md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'raw')
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    };

    md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'raw')
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    };

    md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrJoin('class', 'raw')
      addPart(tokens, idx)
      return self.renderToken(tokens, idx, options, env, self)
    };

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
      let langName = ''
      let highlighted

      if (info) {
        langName = info.split(/\s+/g)[0]
        if (/!$/.test(info)) token.attrJoin('class', 'wrap')
        token.attrJoin('class', options.langPrefix + langName.replace(/=$|=\d+$|=\+$|!$|=!$/, ''))
        token.attrJoin('class', 'hljs')
        token.attrJoin('class', 'raw')
      }

      if (options.highlight) {
        highlighted = options.highlight(token.content, langName) || md.utils.escapeHtml(token.content)
      } else {
        highlighted = md.utils.escapeHtml(token.content)
      }

      if (highlighted.indexOf('<pre') === 0) {
        return `${highlighted}\n`
      }

      if (tokens[idx].map && tokens[idx].level === 0) {
        const startline = tokens[idx].map[0] + 1
        const endline = tokens[idx].map[1]
        return `<pre class="part" data-startline="${startline}" data-endline="${endline}"><code${self.renderAttrs(token)}>${highlighted}</code></pre>\n`
      }

      return `<pre><code${self.renderAttrs(token)}>${highlighted}</code></pre>\n`
    };

    md.renderer.rules.code_block = (tokens, idx, options, env, self) => {
      if (tokens[idx].map && tokens[idx].level === 0) {
        const startline = tokens[idx].map[0] + 1
        const endline = tokens[idx].map[1]
        return `<pre class="part" data-startline="${startline}" data-endline="${endline}"><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`
      }
      return `<pre><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`
    }

    this.md = md;

    // init mermaid
    mermaid.initialize({
      startOnLoad: false,
      cloneCssStyles: false,
    });
	}

	componentDidUpdate() {
		const $ = window.$;
    const view = $('.smd-preview-area');

    // table
    view.find('table.raw').removeClass('raw').addClass('table table-hover');

    // sequence
		const sequences = view.find('div.sequence-diagram.raw').removeClass('raw');
    sequences.each((key, value) => {
      try {
        var $value = $(value)
        const $ele = $(value).parent().parent()

        const sequence = $value
        sequence.sequenceDiagram({
          theme: 'simple'
        })

        $ele.addClass('sequence-diagram transparent-bg')
        $value.children().unwrap().unwrap()
        const svg = $ele.find('> svg')
        svg[0].setAttribute('viewBox', `0 0 ${svg.attr('width')} ${svg.attr('height')}`)
        svg[0].setAttribute('preserveAspectRatio', 'xMidYMid meet')
      } catch (err) {
        $value.unwrap()
        $value.parent().append('<div class="alert alert-warning">' + err + '</div>')
        console.warn(err)
      }
    });

    // flowchart
    const flow = view.find('div.flow-chart.raw').removeClass('raw')
    flow.each((key, value) => {
      try {
        var $value = $(value)
        const $ele = $(value).parent().parent()

        const chart = flowchart.parse($value.text())
        $value.html('')
        chart.drawSVG(value, {
          'line-width': 2,
          'fill': 'none',
          'font-size': '16px',
          'font-family': "'Andale Mono', monospace"
        })

        $ele.addClass('flow-chart transparent-bg')
        $value.children().unwrap().unwrap()
      } catch (err) {
        $value.unwrap()
        $value.parent().append('<div class="alert alert-warning">' + err + '</div>')
        console.warn(err)
      }
    });

    // graphviz
    const graphvizs = view.find('div.graphviz.raw').removeClass('raw')
    graphvizs.each(function (key, value) {
      try {
        var $value = $(value)
        var $ele = $(value).parent().parent()

        var graphviz = Viz($value.text())
        if (!graphviz) throw Error('viz.js output empty graph')
        $value.html(graphviz)

        $ele.addClass('graphviz transparent-bg')
        $value.children().unwrap().unwrap()
      } catch (err) {
        $value.unwrap()
        $value.parent().append('<div class="alert alert-warning">' + err + '</div>')
        console.warn(err)
      }
    });

    // mermaid
    const mermaids = view.find('div.mermaid.raw').removeClass('raw')
    mermaids.each((key, value) => {
      try {
        var $value = $(value)
        const $ele = $(value).closest('pre')

        mermaid.mermaidAPI.parse($value.text())
        $ele.addClass('mermaid transparent-bg')
        $ele.html($value.text())
        mermaid.init(undefined, $ele)
        $ele.find('style').remove();
      } catch (err) {
        var errormessage = err
        if (err.str) {
          errormessage = err.str
        }

        $value.unwrap()
        $value.parent().append('<div class="alert alert-warning">' + errormessage + '</div>')
        console.warn(errormessage)
      }
    });

    // abc.js
    const abcs = view.find('div.abc.raw').removeClass('raw')
    abcs.each((key, value) => {
      try {
        var $value = $(value)
        var $ele = $(value).parent().parent()

        abcjs.renderAbc(value, $value.text())

        abcjs.renderMidi("abc-midi", $value.text(), {}, { generateInline: true }, {});

        $ele.addClass('abc transparent-bg')
        $value.children().unwrap().unwrap()
        const svg = $ele.find('> svg')
        svg[0].setAttribute('viewBox', `0 0 ${svg.attr('width')} ${svg.attr('height')}`)
        svg[0].setAttribute('preserveAspectRatio', 'xMidYMid meet')
      } catch (err) {
        $value.unwrap()
        $value.parent().append('<div class="alert alert-warning">' + err + '</div>')
        console.warn(err)
      }
    });

    // highchart
    const highcharts = view.find('div.highchart.raw').removeClass('raw');
    highcharts.each((key, value) => {
      try {
        const $ele = $(value).parent().parent();
        $(value).parent().removeClass('raw');
        // const textObj = util.str2obj($(value).text());
        const textObj = eval(`(${$(value).text()})`);
        window.Highcharts.chart(value, textObj);

        $ele.addClass('highchart transparent-bg');
      } catch (err) {
        console.warn(err);
      }
    });

    // blockquote
    const blockquote = view.find('blockquote.raw').removeClass('raw');
    const blockquoteP = blockquote.find('p');
    blockquoteP.each((key, value) => {
      let html = $(value).html();
      html = replaceExtraTags(html);
      $(value).html(html);
    });

    // color tag in blockquote will change its left border color
    const blockquoteColor = blockquote.find('.color');
    blockquoteColor.each((key, value) => {
      $(value).closest('blockquote').css('border-left-color', $(value).attr('data-color'));
    });

    // syntax highlighting
    view.find('code.raw').removeClass('raw')
    .each((key, value) => {
      const langDiv = $(value)
      if (langDiv.length > 0) {
        const reallang = langDiv[0].className.replace(/hljs|wrap/g, '').trim()
        const codeDiv = langDiv.find('.code')
        let code = ''
        if (codeDiv.length > 0) code = codeDiv.html()
        else code = langDiv.html()
        var result
        if (!reallang) {
          result = {
            value: code
          }
        } else if (reallang === 'haskell' || reallang === 'go' || reallang === 'typescript' || reallang === 'jsx' || reallang === 'gherkin') {
          code = S(code).unescapeHTML().s
          result = {
            value: Prism.highlight(code, Prism.languages[reallang])
          }
        } else if (reallang === 'tiddlywiki' || reallang === 'mediawiki') {
          code = S(code).unescapeHTML().s
          result = {
            value: Prism.highlight(code, Prism.languages.wiki)
          }
        } else if (reallang === 'cmake') {
          code = S(code).unescapeHTML().s
          result = {
            value: Prism.highlight(code, Prism.languages.makefile)
          }
        } else {
          code = S(code).unescapeHTML().s
          const languages = hljs.listLanguages()
          if (!languages.includes(reallang)) {
            result = hljs.highlightAuto(code)
          } else {
            result = hljs.highlight(reallang, code)
          }
        }
        if (codeDiv.length > 0) codeDiv.html(result.value)
        else langDiv.html(result.value)
      }
    });

    // mathjax
	  const mathjaxs = view.find('span.mathjax.raw').removeClass('raw').toArray()
	  try {
	    if (mathjaxs.length > 1) {
	      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, mathjaxs])
	      window.MathJax.Hub.Queue(window.viewAjaxCallback)
	    } else if (mathjaxs.length > 0) {
	      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, mathjaxs[0]])
	      window.MathJax.Hub.Queue(window.viewAjaxCallback)
	    }
	  } catch (err) {
	    console.warn(err)
	  };
  }

	highlightRender(code, lang) {
    const noHighlightReg = /no(-?)highlight|plain|text/;

    if (!lang || noHighlightReg.test(lang)) {
      return;
    }

    code = S(code).escapeHTML().s;

		if (lang === 'sequence') {
      return `<div class="sequence-diagram raw">${code}</div>`;
    } else if (lang === 'flow') {
      return `<div class="flow-chart raw">${code}</div>`;
    } else if (lang === 'graphviz') {
      return `<div class="graphviz raw">${code}</div>`;
    } else if (lang === 'mermaid') {
      return `<div class="mermaid raw">${code}</div>`;
    } else if (lang === 'abc') {
      return `<div class="abc raw">${code}</div><div id="abc-midi"></div>`;
    } else if (lang === 'chart') {
      return `<div id="highchart-container" class="highchart raw">${code}</div>`;
    }

    const result = {
      value: code
    };

    const showlinenumbers = /=$|=\d+$|=\+$/.test(lang);

    if (showlinenumbers) {
      let startnumber = 1;
      const matches = lang.match(/=(\d+)$/);

      if (matches) {
        startnumber = parseInt(matches[1]);
      }

      const lines = result.value.split('\n');
      const linenumbers = [];

      for (let i = 0; i < lines.length - 1; i++) {
        linenumbers[i] = `<span data-linenumber='${startnumber + i}'></span>`;
      }

      const continuelinenumber = /=\+$/.test(lang);
      const linegutter = `<div class='gutter linenumber${continuelinenumber ? ' continue' : ''}'>${linenumbers.join('\n')}</div>`;
      result.value = `<div class='wrapper'>${linegutter}<div class='code'>${result.value}</div></div>`;
    }

    return result.value;
	}

  render() {
  	const mdhtml = this.md.render(this.props.text);

    return (
      <div
        hidden={this.props.hidden}
        className="smd-preview-area col"
      >
        <div dangerouslySetInnerHTML={ createMarkup(mdhtml) } ></div>
      </div>
    );
  }
}

export default Doc;
