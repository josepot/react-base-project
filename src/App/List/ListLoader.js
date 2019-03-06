import {not} from 'ramda';
import {withRedux} from 'hocs';
import {createStructuredSelector, createSelector} from 'redux-views';
import {isListLoadingSelector as isLoading} from 'modules/items';
import {Loader} from 'components';

export default withRedux(
  createStructuredSelector({
    hidden: createSelector(
      [isLoading],
      not
    ),
  })
)(Loader);
