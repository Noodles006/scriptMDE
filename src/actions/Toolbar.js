export const basic = (editor, type) => {
	const selection = editor.getSelection();
	const doc = editor.getDoc();
	const cursor = doc.getCursor(false);

	let text = '';
	let focusCursorLine = cursor.line;
	let focusCursorCh = cursor.ch;
	switch (type) {
		case 'link':
			text = `[${selection}](https://)`;
			focusCursorCh += 1;
			break;
		case 'bold':
			text = `**${selection}**`;
			focusCursorCh += 2;
			break;
		case 'italic':
			text = `*${selection}*`;
			focusCursorCh += 1;
			break;
		case 'strikethrough':
			text = `~~${selection}~~`;
			focusCursorCh += 2;
			break;
		case 'quote':
			text = `> ${selection}`;
			focusCursorCh += 2;
			break;
		case 'code':
			text = `\`\`\`\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'checkbox':
			text = `- [ ] ${selection}`;
			focusCursorCh += 6;
			break;
		case 'image':
			const imgUrl = selection || 'https://';
			text = `![](${imgUrl})`;
			focusCursorCh += 4;
			break;
		case 'table':
			text = '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |';
			break;
		case 'comment':
			text = `<!--\n${selection}\n-->`;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'sequence':
			text = `\`\`\`sequence\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'flow':
			text = `\`\`\`flow\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'graphviz':
			text = `\`\`\`graphviz\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'mermaid':
			text = `\`\`\`mermaid\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'music':
			text = `\`\`\`abc\n ${selection} \n\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'chart-pie':
			text = `\`\`\`chart
	{
	  chart: {
	    type: 'pie'
	  },
	  title: {
	    text: 'Pie Chart'
	  },
	  series: [{
	    name: 'Population',
	    data: [{
	      name: 'Male',
	      y: 50,
	      sliced: true,
	      selected: true
	    }, {
	      name: 'Female',
	      y: 50
	    }]
	  }]
	}
\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'chart-line':
			text = `\`\`\`chart
	{
		title: {
			text: 'Line Chart'
		},
		yAxis: {
			title: {
				text: 'Fibonacci Numbers'
			}
		},
		series: [{
			name: 'Number',
			data: [1, 1, 3, 5, 8, 13, 21, 34, 55]
		}]
	}
\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		case 'chart-bar':
			text = `\`\`\`chart
	{
		chart: {
			type: 'bar'
		},
		title: {
			text: 'Basic Bar Chart'
		},
		xAxis: {
			categories: ['Male', 'Female']
		},
		yAxis: {
			title: {
				text: 'Population (millions)'
			}
		},
		series: [{
			name: 'Year 2018',
			data: [108, 106]
		}]
	}
\`\`\``;
			focusCursorLine += 1;
			focusCursorCh += 1;
			break;
		default:
			break;
	}

	doc.replaceSelection(text, cursor);

  return {
  	type: 'FOCUS_CURSOR',
  	payload: {
  		editor,
  		cursor: {
  			line: focusCursorLine,
  			ch: focusCursorCh
  		}
  	}
  }
}

export const list = (editor, type) => {
	const doc = editor.getDoc();
  const cursorStart = doc.getCursor(true);
  const cursorEnd = doc.getCursor(false);
  const startLine = Math.min(cursorStart.line, cursorEnd.line);
  const endLine = Math.max(cursorStart.line, cursorEnd.line);
  
  for (let i = startLine; i <= endLine; i ++) {
  	const text = editor.getLine(i);

  	const ulReg = /^\s*([*|-]\s+)/;
  	const olReg = /^\s*(\d\.\s+)/;

  	let result = ulReg.exec(text);

  	if (!result) {
  		result = olReg.exec(text);
  	}

  	const toPos = (result && result[1].length) || 0;

		let insertText = '';
		if (type === 'ol') {
		 	insertText = '1. ';
		} else {
		 	insertText = `* `;
		}

		editor.replaceRange(insertText, { line: i, ch: 0 }, { line: i, ch: toPos });
  }

  return {
  	type: 'NO_FOCUS_CURSOR',
  	payload: {}
  }
}

export const head = (editor) => {
	const doc = editor.getDoc();
  const cursorStart = doc.getCursor(true);
  const cursorEnd = doc.getCursor(false);
  const startLine = Math.min(cursorStart.line, cursorEnd.line);
  const endLine = Math.max(cursorStart.line, cursorEnd.line);
  
  for (let i = startLine; i <= endLine; i ++) {
  	const text = editor.getLine(i);

  	const headsReg = /^\s*((#+)\s+)/;
		const result = headsReg.exec(text);

		const heads = (result && result[2]) || '';
		const toPos = (result && result[1].length) || 0;

		let insertText = '';

		if (heads.length === 6) {
		 	insertText = '# ';
		} else {
		 	insertText = `${heads}# `;
		}

		editor.replaceRange(insertText, { line: i, ch: 0 }, { line: i, ch: toPos });
  }

  return {
  	type: 'FOCUS_CURSOR',
  	payload: {
  		editor,
  		cursor: {
  			line: endLine
  		}
  	}
  }
}

export default { head, basic, list };
