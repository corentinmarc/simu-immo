import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from 'components/Header';
import Form from 'components/Form';
import MensualityTable from '../MensualityTable';

const App = () => (
  <MuiThemeProvider>
    <div>
      <Header />
      <Form />
      <MensualityTable />
    </div>
  </MuiThemeProvider>
);

export default App;
