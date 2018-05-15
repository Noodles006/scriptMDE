export const updateMarkdown = (markdown) => {
	return {
		type: 'UPDATE_MARKDOWN',
		payload: markdown
	}
}

export const initEditor = (editor) => {
	return {
		type: 'INIT_EDITOR',
		payload: editor
	}
}
