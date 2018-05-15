import CONSTANTS from '../constants';

const $ = window.$;

const scrollingState = {
  top: 0,
  pos: 0,
};

let clearEditorScrollingTimer = 0;
let clearViewScrollingTimer = 0;

const preventScrolling = (direction, posTo) => {
  return (direction === CONSTANTS.DIRECTION_DOWN && scrollingState.pos > posTo)
        || (direction === CONSTANTS.DIRECTION_UP && scrollingState.pos < posTo);
};

const findPartsByLineNo = (parts, lineNo) => {
  for (let i = 0, len = parts.length; i < len; i++) {
    const part = parts[i];
    const startLine = +part.getAttribute('data-startline');
    const endLine = +part.getAttribute('data-endline');

    if (lineNo >= startLine && lineNo <= endLine) {
      return [{ node: part, startLine, endLine }];
    }

    const nextPart = parts[i + 1];
    const nextStartLine = +nextPart.getAttribute('data-startline');
    const nextEndLine = +nextPart.getAttribute('data-endline');

    if (lineNo > endLine && lineNo < nextStartLine) {
      return [
        { node: part, startLine, endLine },
        { node: nextPart, startLine: nextStartLine, endLine: nextEndLine },
      ];
    }
  }

  // scroll to end
  return [];
};

const syncScrollToView = (editor, view) => {
  if (scrollingState.viewScrolling) {
    return;
  }

  const scrollInfo = editor.getScrollInfo();
  const textHeight = editor.defaultTextHeight();
  const lineNumber = editor.lineAtHeight(scrollInfo.top, 'local') + 1;
  const lineOffsetTop = editor.heightAtLine(lineNumber - 1, 'local');
  const nextLineOffsetTop = editor.heightAtLine(lineNumber, 'local');
  const innerLines = Math.round((nextLineOffsetTop - lineOffsetTop) / textHeight);
  const innerLineOffset = Math.floor((scrollInfo.top - lineOffsetTop) / textHeight);

  const scrollingDirection = scrollInfo.top - scrollingState.top >= 0 ? CONSTANTS.DIRECTION_DOWN : CONSTANTS.DIRECTION_UP;
  scrollingState.top = scrollInfo.top;

  const parts = view.find('.part').toArray();

  if (parts.length < 1) {
    return;
  }

  const targetParts = findPartsByLineNo(parts, lineNumber);

  let posTo = 0;
  if (targetParts.length === 0) {
    const node = parts[parts.length - 1];
    const lastEndLine = +node.getAttribute('data-endline');
    const totalLines = Math.floor(scrollInfo.height / textHeight);
    const percentage = (lineNumber + innerLineOffset - lastEndLine) / (totalLines - lastEndLine + innerLines);
    const rangeOffsetTop = node.offsetTop + $(node).height();
    const rangeHeight = view.height() - rangeOffsetTop;
    posTo = Math.floor(rangeOffsetTop + percentage * rangeHeight);
  } else if (targetParts.length === 1) {
    const { startLine, endLine, node } = targetParts[0];
    const percentage = (lineNumber + innerLineOffset - startLine) / (endLine - startLine + innerLines);
    posTo = Math.floor(node.offsetTop + percentage * $(node).height());
  } else if (targetParts.length > 1) {
    const { endLine, node } = targetParts[0];
    const { startLine: nextStartLine, node: nextNode } = targetParts[1];
    const percentage = (lineNumber + innerLineOffset - endLine) / (nextStartLine - endLine + innerLines);
    const rangeOffsetTop = node.offsetTop + $(node).height();
    const rangeHeight = nextNode.offsetTop - rangeOffsetTop;
    posTo = Math.floor(rangeOffsetTop + percentage * rangeHeight);
  }

  if (preventScrolling(scrollingDirection, posTo)) {
    return;
  }

  let duration = Math.abs(scrollInfo.top - posTo) / 50;
  duration = duration >= 100 ? duration : 100;

  view.stop(true, true).animate({ scrollTop: posTo }, duration, 'linear');

  scrollingState.pos = posTo;

  scrollingState.editorScrolling = true;
  clearTimeout(clearEditorScrollingTimer);
  clearEditorScrollingTimer = setTimeout(() => {
    scrollingState.editorScrolling = false;
  }, duration * 1.5);
};

const syncScrollToEditor = (editor, view) => {
  if (scrollingState.editorScrolling) {
    return;
  }

  const scrollTop = view.scrollTop();

  const parts = view.find('.part').toArray();

  for (let i = 0, len = parts.length; i < len; i++) {
    const node = parts[i];
    const startLine = +node.getAttribute('data-startline');
    const endLine = +node.getAttribute('data-endline');
    const rangeBegin = node.offsetTop;
    const rangeEnd = node.offsetTop + $(node).height();

    if (scrollTop >= rangeBegin && scrollTop <= rangeEnd) {
      const percentage = (scrollTop - rangeBegin) / (rangeEnd - rangeBegin);
      const lineNo = startLine + Math.floor(percentage * (endLine - startLine));
      const posTo = editor.heightAtLine(lineNo, 'local');
      $('.smd-edit-area .CodeMirror-scroll').stop(true, true).animate({ scrollTop: posTo }, 100, 'linear');
    }
  }

  scrollingState.viewScrolling = true;
  clearTimeout(clearViewScrollingTimer);
  clearViewScrollingTimer = setTimeout(() => {
    scrollingState.viewScrolling = false;
  }, 150);
};

export default { syncScrollToView, syncScrollToEditor };
