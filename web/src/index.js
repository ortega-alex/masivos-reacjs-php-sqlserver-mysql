import React from 'react';
import ReactDOM from 'react-dom';

import App from './_components/App';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rodal/lib/rodal.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-virtualized/styles.css';
import 'toastr/build/toastr.css';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);