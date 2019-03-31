import {itemSelector} from 'modules/items';
import {connect} from 'react-redux';
import Item from './Item.Component';

export default connect(
  itemSelector,
  null
)(Item);
