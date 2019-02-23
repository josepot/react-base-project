import PropTypes from 'prop-types';
import React, {Component, createContext} from 'react';

export const context = createContext({});

const {Provider} = context;

export default class ReduxProvider extends Component {
  constructor(props) {
    super(props);
    const {store, isSSR} = props;

    if (!isSSR) {
      this.subscription = store.subscribe(this.forceUpdate.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription();
  }

  render() {
    const {children, store} = this.props;

    return (
      <Provider value={{state: store.getState(), dispatch: store.dispatch}}>
        {children}
      </Provider>
    );
  }
}

ReduxProvider.propTypes = {
  children: PropTypes.element.isRequired,
  isSSR: PropTypes.bool,
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
};

ReduxProvider.defaultProps = {
  isSSR: false,
};
