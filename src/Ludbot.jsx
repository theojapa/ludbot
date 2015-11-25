import React from 'react';
import ReactDOM from 'react-dom';

import Peaks from './peaks/Peaks.jsx';

var config = {
	width: 10,
	depth: 10
};

ReactDOM.render(
	<Peaks width={config.width} depth={config.depth}/>,
	document.getElementById('ludbot-app')
);
