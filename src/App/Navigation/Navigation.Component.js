import React from 'react';
import {NavLink as UnstyledNavLink} from 'react-router-dom';
import {Header, Nav, Link, activeStyle} from './Navigation.Styles';

const NavLink = Link.withComponent(UnstyledNavLink);

export default function Navigation() {
  return (
    <Header>
      <Nav>
        <NavLink activeStyle={activeStyle} to="/list">
          List
        </NavLink>
        <NavLink activeStyle={activeStyle} to="/new">
          New
        </NavLink>
      </Nav>
    </Header>
  );
}
