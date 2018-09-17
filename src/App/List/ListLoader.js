import {complement} from 'ramda';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {isListLoadingSelector as isLoading} from 'modules/items';
import {Loader} from 'components';

export default compose(
  connect(
    createStructuredSelector({hidden: complement(isLoading)}),
    {}
  )
)(Loader);
