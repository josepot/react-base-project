import {not} from 'ramda';
import {withRedux} from 'hocs';
import createSelector from 'redux-views';
import {isListLoadingSelector as isLoading} from 'modules/items';
import {Loader} from 'components';

export default withRedux(
  createSelector({
    hidden: createSelector(
      [isLoading],
      not
    ),
  })
)(Loader);
