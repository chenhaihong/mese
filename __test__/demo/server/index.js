import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Index from '../app/index';

export default (res, req, next) => {
  return ReactDOMServer.renderToStaticMarkup(<Index />);
};
