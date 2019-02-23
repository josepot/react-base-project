import {complement} from 'ramda';
import {withRedux} from 'hocs';
import {isListLoadingSelector as isLoading} from 'modules/items';
import {Loader} from 'components';

export default withRedux({
  hidden: complement(isLoading),
})(Loader);
