import {not} from 'ramda';
import {connect} from 'react-redux';
import {createStructuredSelector, createSelector} from 'reselect';
import {isListLoadingSelector as isLoading} from 'modules/items';
import {Loader} from 'components';

export default connect(
  createStructuredSelector({
    hidden: createSelector(
      [isLoading],
      not
    ),
  }),
  null
)(Loader);
