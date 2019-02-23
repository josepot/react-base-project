import {withRedux} from 'hocs';
import {itemSelector} from 'modules/items';
import Item from './Item.Component';

export default withRedux(itemSelector)(Item);
