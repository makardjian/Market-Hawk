import React from 'react';
import ReactDOM from 'react-dom';
import dummyData from './../../db/exampleData.js';
import App from './components/App.jsx';

const root = document.getElementById('app');
ReactDOM.render(<App dummyData={dummyData}/>, root);