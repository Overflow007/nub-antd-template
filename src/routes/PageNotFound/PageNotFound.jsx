import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import './PageNotFound.scss';
import imgNotFound from './working.png';

const PREFIX = 'page-not-found';
const cx = utils.classnames(PREFIX);

class PageNotFound extends Component {
  render() {
    return (
      <div className={PREFIX}>
        <img src={imgNotFound} alt="working" />页面施工中......
      </div>
    );
  }
}

PageNotFound.propTypes = {};

PageNotFound.defaultProps = {};

export default PageNotFound;
