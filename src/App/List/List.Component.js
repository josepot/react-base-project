import React from 'react';
import PropTypes from 'prop-types';

import {Ul, Li} from './List.Styles';
import ListLoader from './ListLoader';
import Item from './Item';

const getListItem = id => (
  <Li key={id}>
    <Item key={id} id={id} />
  </Li>
);

const ItemsList = ({itemIds, onScroll}) => {
  console.log('inside list render');
  return (
    <Ul onScroll={onScroll}>
      {itemIds.map(getListItem)}
      <Li key="LOADERRRR" center>
        <ListLoader size={30} color="grey" />
      </Li>
    </Ul>
  );
};

ItemsList.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.number),
  onScroll: PropTypes.func,
};

export default ItemsList;
