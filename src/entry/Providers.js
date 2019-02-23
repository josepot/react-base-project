import React from 'react';
import PropTypes from 'prop-types';
// import {hot} from 'react-hot-loader';
import {Router} from 'react-router';
import {ThemeProvider} from 'emotion-theming';
import ReduxProvider from 'ReduxProvider';

import theme from 'lib/theme';

function Providers({children, store, history}) {
  return (
    <ReduxProvider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Router>
    </ReduxProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  store: ReduxProvider.propTypes.store,
  history: PropTypes.object.isRequired,
};

export default Providers;
