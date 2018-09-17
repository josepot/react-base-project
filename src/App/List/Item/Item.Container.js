import {connect} from 'react-redux';
import {itemSelector} from 'modules/items';
import Item from './Item.Component';

export default connect(
  itemSelector,
  {}
)(Item);
