import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers/Index';

import './styles/index.css';

const store = createStore(reducer);
window.store = store;

ReactDOM.render(
	<Provider store={store}>
    <App />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
