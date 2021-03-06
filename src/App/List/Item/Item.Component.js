import PropTypes from 'prop-types';
import React from 'react';
import {Loader} from 'components';
import {NavLink as ONavLink} from 'react-router-dom';
import {Link, Header} from './Item.Styles';

const NavLink = Link.withComponent(ONavLink);

const Item = ({id, title, author, price, isLoading, isSelected}) => (
  <article>
    <Header isSelected={isSelected}>
      <NavLink to={`/list/${isSelected ? '' : id}`}>{title}</NavLink>
    </Header>
    {isLoading ? (
      <Loader color="grey" size={20} />
    ) : isSelected ? (
      <div>
        <b>Author:</b> {author}
        <br />
        <b>Price:</b> {price}
      </div>
    ) : null}
  </article>
);

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  price: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

Item.displayName = 'Item';
export default Item;

/*
export default x => {
  console.log('Item', x.id);
  return Item(x);
};
*/
