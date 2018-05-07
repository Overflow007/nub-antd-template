import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import './SideNavigator.scss';

const PREFIX = 'side-navigator';
const cx = utils.classnames(PREFIX);

@observer
class SideNavigator extends Component {
  componentDidMount() {
    this.itemClick(this.props.checked);
  }
  componentWillUpdate(nextPorp) {
    if (nextPorp.checked && !_.isEqual(this.props.checked, nextPorp.checked)) {
      this.itemClick(nextPorp.checked);
    }
  }

  childrenCache = {};
  @observable arrowTop = 0;
  @observable checkId = null;

  scrollArrow = () => {
    if (this.childrenCache[this.checkId]) {
      const { dom } = this.childrenCache[this.checkId];
      this.arrowTop = dom.offsetTop + dom.offsetHeight / 2 - 6;
    }
  };

  itemClick = id => {
    if (this.childrenCache[id]) {
      const { data } = this.childrenCache[id];
      this.checkId = id;
      this.scrollArrow();
      return data;
    }
    return null;
  };

  renderChild = (data, parentCode, parentIndex, level = 1) => (
    <div className={cx('children')}>
      {data.map((item, index) => {
        const id = this.props.idField ? item[this.props.idField] : `${parentCode}_${index}`;
        return (
          <div key={id} className={cx('child-item', `child-item${level}`)}>
            <div
              role="button"
              ref={dom => {
                this.childrenCache[id] = {
                  dom,
                  data: item,
                };
              }}
              onClick={() => {
                const d = this.itemClick(id);
                this.props.onItemClick(d);
              }}
              className={cx('text', { checked: this.checkId === id })}
            >
              {`${this.props.showIndex ? `${parentIndex}.${index}` : ''} ${item.text}`}
            </div>
            {this.renderChild(item.children || [], id, `${parentIndex}.${index}`, level + 1)}
          </div>
        );
      })}
    </div>
  );

  render() {
    return (
      <div className={`${PREFIX} ${this.props.className || ''}`}>
        <div className={cx('left-bar')} />
        <div className={cx('item-content')}>
          {this.props.data.map((item, index) => {
            const id = this.props.idField ? item[this.props.idField] : index;
            return (
              <div key={id} className={cx('item')}>
                <div
                  role="button"
                  ref={dom => {
                    this.childrenCache[id] = {
                      dom,
                      data: item,
                    };
                    if (this.arrowTop === 0 && this.props.checked == null) this.itemClick(id);
                  }}
                  onClick={() => {
                    const d = this.itemClick(id);
                    this.props.onItemClick(d);
                  }}
                  className={cx('text', { checked: this.checkId === id })}
                >
                  {`${this.props.showIndex ? index + 1 : ''} ${item.text}`}
                </div>
                {this.renderChild(item.children || [], id, index + 1)}
              </div>
            );
          })}
        </div>
        <div className={cx('arrow')} style={{ top: this.arrowTop }} />
      </div>
    );
  }
}

SideNavigator.propTypes = {
  checked: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    }),
  ),
  idField: PropTypes.string,
  onItemClick: PropTypes.func,
  showIndex: PropTypes.bool,
};

SideNavigator.defaultProps = {
  checked: null,
  idField: null,
  data: [],
  onItemClick: () => {},
  showIndex: false,
};

export default SideNavigator;
