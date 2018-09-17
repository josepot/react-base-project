import React from 'react';
import PropTypes from 'prop-types';
import {hot} from 'react-hot-loader';
import {Provider as ReduxProvider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {ThemeProvider} from 'emotion-theming';

import theme from 'lib/theme';

function Providers({children, store}) {
  return (
    <ReduxProvider store={store}>
      <ConnectedRouter history={store.history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ConnectedRouter>
    </ReduxProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  store: ReduxProvider.propTypes.store,
};

export default hot(module)(Providers);
