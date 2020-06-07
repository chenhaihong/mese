/*global test expect:true*/
import React from "react"; // eslint-disable-line
import { mount } from 'enzyme';
import home from '../../pages/home';

test('should ', () => {
  const pageHome = mount(home);
  pageHome.find('.btn').simulate('click');
  expect(1).toBe(1);
});
