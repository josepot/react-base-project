import {withRedux} from 'hocs';
import {useOnScrollBottom} from 'hooks';
import {idsListSelector, requestItems} from 'modules/items';
import ListComponent from './List.Component';

export default withRedux(
  {itemIds: idsListSelector},
  {requestItems},
  (state, actions) => ({
    ...state,
    onScroll: useOnScrollBottom(actions.requestItems),
  })
)(ListComponent);
