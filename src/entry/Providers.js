import React from 'react';
import PropTypes from 'prop-types';
import {hot} from 'react-hot-loader/root';
import {setConfig} from 'react-hot-loader';
import {Router} from 'react-router';
import {ThemeProvider} from 'emotion-theming';
import {Provider} from 'react-redux-lean';

import theme from 'lib/theme';

function Providers({children, store, history}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Router>
    </Provider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  store: Provider.propTypes.store,
  history: PropTypes.object.isRequired,
};

setConfig({
  ignoreSFC: true,
  pureRender: true,
});

export default hot(Providers);
