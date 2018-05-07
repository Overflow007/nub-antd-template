import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import './Amap.scss';
import AmapLayer from './AmapLayer';

const PREFIX = 'amap';
const cx = utils.classnames(PREFIX);
const IMAP = window.AMap || window.IMAP;
/* 当前是否外网高德地图 */
const isAMap = window.AMap != null;

@observer
export default class Amap extends Component {
  constructor(props) {
    super(props);
    this._id = `amap_${new Date().getTime()}`;
  }
  componentDidMount() {
    this.initMap();
  }

  @observable map;
  @observable
  mouse = {
    x: null,
    y: null,
  };

  initMap = () => {
    if (IMAP == null) {
      console.error('无法初始化地图！请检查地图服务是否正常。');
      return;
    }
    this.map = new IMAP.Map(this._id, {
      minZoom: 3,
      maxZoom: 20,
      mapStyle: 'amap://styles/5dfd9d76b52e33ec49cd17d3676286a8',
      zoom: this.props.zoom, //设置地图初始化级别
      tileUrl: [
        'http://{s}/v3/tile?z={z}&x={x}&y={y}',
        [`${window.host}:25333`, `${window.host}:25333`],
      ],
      center: new IMAP.LngLat(this.props.center.lng, this.props.center.lat), //设置地图中心点坐标
      animation: true, //设置地图缩放动画效果
    });
  };

  render() {
    return (
      <div
        onMouseMove={e => {
          const rect = e.target.getBoundingClientRect();
          this.mouse.x = e.pageX - rect.left;
          this.mouse.y = e.pageY - rect.top;
        }}
        onMouseLeave={e => {
          this.mouse.x = null;
          this.mouse.y = null;
        }}
        className={`${PREFIX} ${this.props.className || ''}`}
        style={this.props.style}
      >
        <div id={this._id} style={{ width: this.props.width, height: this.props.height }} />
        <AmapLayer
          className={cx('canvas')}
          width={this.props.width}
          height={this.props.height}
          mouse={this.mouse}
          lnglatToPixel={(lng, lat) => {
            if (this.map) {
              /* 如果是公网地图 */
              if (isAMap) return this.map.lnglatTocontainer([lng, lat]);
              /* 内网地图 */
              return this.map.lnglatToPixel(new IMAP.LngLat(lng, lat));
            }
            return { x: 0, y: 0 };
          }}
          data={this.props.data}
        />
      </div>
    );
  }
}

Amap.propTypes = {
  zoom: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  center: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
  }),
};

Amap.defaultProps = {
  zoom: 11,
  width: 1200,
  height: 800,
  data: [],
  center: {
    lng: 121.455536,
    lat: 31.249452,
  },
};
