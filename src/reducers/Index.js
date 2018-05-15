import { combineReducers } from 'redux';
import CONSTANTS from '../constants';

const markdown = (state = '', action) => {
	switch (action.type) {
		case 'UPDATE_MARKDOWN':
			return action.payload;
		default:
			return state;
	}
};

const editor = (state = {}, action) => {
	switch (action.type) {
		case 'INIT_EDITOR':
			return action.payload;
		case 'FOCUS_CURSOR':
			const { editor, cursor } = action.payload;
			editor.setCursor(cursor);
			editor.focus();

			return editor;
		default:
			return state;
	}
};

const mode = (state = CONSTANTS.SPLIT_MODE, action) => {
	switch (action.type) {
		case 'PAGE_MODE':
			return action.payload;
		default:
			return state;
	}
};

const scriptmd = combineReducers({
	markdown,
	editor,
	mode,
});

export default scriptmd;
