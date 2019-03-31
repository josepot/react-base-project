import React from 'react';
import PropTypes from 'prop-types';
import {hot} from 'react-hot-loader/root';
import {setConfig} from 'react-hot-loader';
import {Router} from 'react-router';
import {ThemeProvider} from 'emotion-theming';
import {Provider} from 'react-redux';
import theme from 'lib/theme';
import actions from './actions.json';

const Profiler = React.unstable_Profiler;

let count = 0;
let total = 0;

function Providers({children, store, history}) {
  const onRender = (x, y, t) => {
    total += t;
    if (count < 100) {
      setTimeout(() => store.dispatch(actions[count++]), 0);
    } else {
      window.alert(total);
    }
  };
  return (
    <Provider store={store}>
      <Profiler id="root" onRender={onRender}>
        <Router history={history}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </Router>
      </Profiler>
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
