import {connect} from 'react-redux';
import {getOnScrollBottom} from 'utils';
import {createStructuredSelector} from 'redux-views';
import {idsListSelector, requestItems} from 'modules/items';
import ListComponent from './List.Component';

const selector = createStructuredSelector({
  itemIds: idsListSelector,
});

const actions = {requestItems};

function listMapper(stateProps, actionProps) {
  return {
    ...stateProps,
    onScroll: getOnScrollBottom(actionProps.requestItems),
  };
}

export default connect(
  selector,
  actions,
  listMapper
)(ListComponent);
