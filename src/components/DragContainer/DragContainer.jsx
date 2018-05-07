import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import './DragContainer.scss';

const PREFIX = 'drag-container';
const cx = utils.classnames(PREFIX);

const distance = (p1, p2) =>
  Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

@observer
class DragContainer extends Component {
  constructor(props) {
    super(props);
    this.copyChildren(this.props.children || []);
  }

  componentWillUpdate(nextProps) {
    if (!_.eq(nextProps.children, this.props.children)) {
      this.copyChildren(nextProps.children || []);
    }
  }

  onDragStart = (e, item, index) => {
    this.initChildPosition();
    this.dragIndex = index;
    this.dragging = true;
    this.proxyOffset.x = e.pageX - this.childrenPosition[index].left;
    this.proxyOffset.y = e.pageY - this.childrenPosition[index].top;
    this.proxyOffset.left = -99999;
    this.proxyOffset.top = 0;

    this.proxyElement = React.cloneElement(this.children[index]);
  };

  onDrag = (e, item, index) => {
    const targetPos = this.getLatestPos(e.pageX, e.pageY);

    this.proxyOffset.left = e.pageX - this.proxyOffset.x;
    this.proxyOffset.top = e.pageY - this.proxyOffset.y;

    if (targetPos >= 0) {
      for (let i = 0; i < React.Children.count(this.props.children); i += 1) {
        if (i < Math.min(targetPos, index) || i > Math.max(targetPos, index)) {
          this.childrenPositionMap[i] = i;
        } else if (index < targetPos) {
          /* 从前到后 */
          if (i !== index) this.childrenPositionMap[i] = i - 1;
        } else if (i !== index) {
          /* 从后到前 */
          this.childrenPositionMap[i] = i + 1;
        }
      }
      this.childrenPositionMap[index] = targetPos;
    }
  };

  onDragEnd = (e, item, index) => {
    const targetPos = this.getLatestPos(e.pageX, e.pageY);
    this.proxyElement = null;
    this.dragIndex = -1;
    this.dragging = false;
    const proxy = this.children.splice(index, 1);
    this.children.splice(targetPos, 0, proxy[0]);
    this.props.onSort(index, targetPos);
  };

  getLatestPos = (x, y) => {
    let targetPos = -1;
    let minDistance = 999999;
    this.childrenPosition.forEach((pos, i) => {
      const d = distance(pos, { x, y });
      if (d < minDistance) {
        targetPos = i;
        minDistance = d;
      }
    });
    return targetPos;
  };

  copyChildren = children => {
    this.children.clear();
    children.forEach(item => {
      this.children.push(React.cloneElement(item));
    });
    window.dragChildren = toJS(this.children);
  };

  @observable children = [];
  @observable dragging = false;
  childrenDom = [];
  proxyElement = null;
  @observable
  proxyOffset = {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
  };
  @observable childrenPositionMap = [];
  childrenPosition = [];
  dragIndex = -1;
  initChildPosition = () => {
    this.childrenDom.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      if (this.childrenPosition.length < index + 1) {
        this.childrenPosition.push({
          x: 0,
          y: 0,
          left: 0,
          top: 0,
        });
      }
      if (this.childrenPositionMap.length < index + 1) {
        this.childrenPositionMap.push(0);
      }
      this.childrenPosition[index].x = (rect.left + rect.right) / 2 + window.scrollX;
      this.childrenPosition[index].y = (rect.top + rect.bottom) / 2 + window.scrollY;
      this.childrenPosition[index].left = rect.left + window.scrollX;
      this.childrenPosition[index].top = rect.top + window.scrollY;
      this.childrenPositionMap[index] = index;
    });
  };

  render() {
    return (
      <div
        className={`${PREFIX} ${this.props.className || ''} ${cx({ dragging: this.dragging })}`}
        style={this.props.style}
      >
        {this.children.map((child, index) => (
          <div
            key={child.key}
            ref={dom => {
              this.childrenDom[index] = dom;
            }}
            draggable="true"
            onDragStart={e => {
              this.onDragStart(e, child, index);
            }}
            onDrag={e => {
              this.onDrag(e, child, index);
            }}
            onDragEnd={e => {
              this.onDragEnd(e, child, index);
            }}
            style={
              this.dragging
                ? {
                    left:
                      this.childrenPosition[this.childrenPositionMap[index]].left -
                      this.childrenPosition[index].left,
                    top:
                      this.childrenPosition[this.childrenPositionMap[index]].top -
                      this.childrenPosition[index].top,
                  }
                : {}
            }
            className={cx('item', { 'dragged-item': this.dragIndex === index })}
          >
            {child}
          </div>
        ))}
        <div
          className={cx('proxy')}
          style={{
            left: this.proxyOffset.left,
            top: this.proxyOffset.top,
          }}
        >
          {this.proxyElement}
        </div>
      </div>
    );
  }
}

DragContainer.propTypes = {
  onSort: PropTypes.func,
};

DragContainer.defaultProps = {
  onSort: () => {},
};

export default DragContainer;
