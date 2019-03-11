import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Home from '../app/Home';

export default (req, res) => {
  return ReactDOMServer.renderToStaticMarkup(<Home />);
};
