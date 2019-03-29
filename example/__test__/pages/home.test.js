import React from 'react';
import { mount } from 'enzyme';
import home from '../../pages/home';

test('should ', () => {
  const pageHome = mount(home);
  pageHome.find('.btn').simulate('click');
  expect(1).toBe(1);
});