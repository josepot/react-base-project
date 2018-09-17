import {connect} from 'react-redux';
import {compose} from 'recompose';
import {createStructuredSelector} from 'reselect';

import {withOnScrollBottom} from 'hocs';
import {idsListSelector as itemIds, requestItems} from 'modules/items';
import Component from './List.Component';

export default compose(
  connect(
    createStructuredSelector({itemIds}),
    {onScrollBottom: requestItems}
  ),
  withOnScrollBottom
)(Component);
