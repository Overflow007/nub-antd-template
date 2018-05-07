import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';

import './AmapLayer.scss';

const PREFIX = 'amap-layer';
const cx = utils.classnames(PREFIX);

const config = {
  color: 0x3150bd,
  lineWidth: 1,
  lineAlpha: 0.9,
};

const calcDistance = (p1, p2) =>
  Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

const getCPoints = (x1, y1, x2, y2, alpha) => {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  alpha = distance / alpha;
  y1 = Math.atan((y2 - y1) / (x2 - x1));
  y2 = 0.5;
  x2 - x1 < 0 && (y2 = 1.5);
  return {
    radii: alpha,
    distance,
    center: {
      x: centerX,
      y: centerY,
    },
    cp: {
      x: centerX + alpha * Math.cos(Math.PI * y2 + y1),
      y: centerY + alpha * Math.sin(Math.PI * y2 + y1),
    },
  };
};

const calcQuadBezierCurve = (a, c, b, d) => {
  const e = 1 - d;
  return e * e * a + 2 * e * d * c + d * d * b;
};

const calcQuadBezierCurvePoint = (p1, p2, p3, alpha) => ({
  x: calcQuadBezierCurve(p1.x, p2.x, p3.x, alpha),
  y: calcQuadBezierCurve(p1.y, p2.y, p3.y, alpha),
});

class AmapLayer extends Component {
  constructor(props) {
    super(props);
    this._id = `amap_layer_${new Date().getTime()}`;
  }

  componentDidMount() {
    this.initLayer();
    this.transferData();
  }

  componentWillUpdate(nextProp) {
    if (!_.isEqual(nextProp.data, this.props.data)) {
      this.transferData(nextProp);
    }

    // if (this.props.width !== nextProp.width || this.props.height !== nextProp.height) {
    //   // this.app.destroy();
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      this.app.ticker.stop();
      this.initLayer();
    }
  }

  bigdataDrawStep = 2000;
  staticDrawLength = this.bigdataDrawStep;
  staticData = [];
  animateData = [];

  /* 点转换 */
  transferPointPos = pos => {
    const { lnglatToPixel } = this.props;
    try {
      return lnglatToPixel(pos.lng, pos.lat);
    } catch (e) {
      return { x: -9999, y: -9999 };
    }
  };

  /* 普通线转换 */
  transferLinePos = pos => {
    const res = {
      sp: this.transferPointPos({ lng: pos.fromLng, lat: pos.fromLat }),
      ep: this.transferPointPos({ lng: pos.toLng, lat: pos.toLat }),
    };
    res.distance = calcDistance(res.sp, res.ep);
    return res;
  };

  /* 飞行图转换，曲线，需要有3个点sp/cp/ep */
  transferAirlinePos = pos => {
    const { sp, ep, distance } = this.transferLinePos(pos);
    const { cp } = getCPoints(
      sp.x,
      sp.y,
      ep.x,
      ep.y,
      pos.bezierAlpha != null ? pos.bezierAlpha : (ep.x > sp.x ? -1 : 1) * 3,
    );
    return {
      sp,
      cp,
      ep,
      distance,
    };
  };

  transferPos = (type, pos) => {
    let res;
    switch (type) {
      case 'airline':
        res = this.transferAirlinePos(pos);
        break;
      case 'line':
        res = this.transferLinePos(pos);
        break;
      case 'point':
        res = this.transferPointPos(pos);
        break;
      default:
        break;
    }
    return res;
  };

  transferData = (props = this.props) => {
    const staticData = [];
    const animateData = [];

    props.data.forEach(d => {
      const { type } = d;
      d.data.forEach(pos => {
        const { animate } = pos;
        const res = {};
        if (animate) animateData.push(res);
        else staticData.push(res);

        res.src = pos;
        res.type = type;
      });
    });

    this.staticData = staticData;
    this.animateData = animateData;
  };

  initLayer = () => {
    this.app = new window.PIXI.Application(this.props.width, this.props.height, {
      transparent: true,
      view: document.getElementById(this._id),
    });
    this.staticGraphics = new window.PIXI.Graphics();
    this.animateGraphics = new window.PIXI.Graphics();
    this.textContainer = new window.PIXI.Graphics();

    this.staticGraphics.blendMode = window.PIXI.BLEND_MODES.SCREEN;
    this.animateGraphics.blendMode = window.PIXI.BLEND_MODES.SCREEN;
    this.app.stage.addChild(this.staticGraphics);
    this.app.stage.addChild(this.animateGraphics);
    this.app.stage.addChild(this.textContainer);
    this.initText();
    this.app.ticker.add(this.drawAnimate);
    this.app.ticker.add(this.drawText);
  };

  /* 文字控件缓存 */
  textCache = new Map();
  /* 初始化文字 */
  initText = (props = this.props) => {
    this.textCache = new Map();
    props.data.forEach(d => {
      const { type } = d;
      /* 暂时支持点类型的文字 */
      if (type === 'point') {
        d.data.forEach(pos => {
          const { text, textStyle } = pos;
          if (text) {
            const textPIXI = new window.PIXI.Text(
              text,
              _.assign(
                {
                  // fontFamily: 'Snippet',
                  fontSize: 12,
                  fill: 'white',
                  align: 'center',
                },
                textStyle,
              ),
            );
            this.textContainer.addChild(textPIXI);
            // window.textPIXI = textPIXI;
            this.textCache.set(pos, textPIXI);
          }
        });
      }
    });
  };

  resizeLayer = () => {
    this.app = new window.PIXI.Application(this.props.width, this.props.height, {
      transparent: true,
      view: document.getElementById(this._id),
    });
  };

  drawLayer = (reCalcPixel, from = 0) => {
    const { staticGraphics, animateGraphics } = this;
    if (from === 0) {
      staticGraphics.clear();
    }

    // graphics.beginFill(0xff3300);

    const allData = this.staticData.concat(this.animateData);
    for (let i = from; i < Math.min(allData.length, this.staticDrawLength); i += 1) {
      const obj = allData[i];
      const { type, src } = obj;
      const color = src.color || config.color;
      const lineWidth = src.lineWidth || config.lineWidth;
      const lineAlpha = src.lineAlpha || config.lineAlpha;
      if (reCalcPixel || obj.data == null) {
        obj.data = this.transferPos(type, src);
      }
      /* 绘画 */

      const shape = obj.data;
      const size = src.size || 2;
      switch (type) {
        case 'airline':
          staticGraphics.lineStyle(lineWidth, color, lineAlpha);
          staticGraphics.moveTo(shape.sp.x, shape.sp.y);
          staticGraphics.quadraticCurveTo(shape.cp.x, shape.cp.y, shape.ep.x, shape.ep.y);
          //该操作消耗性能严重
          // staticGraphics.beginFill(color, 0.1);
          // staticGraphics.drawCircle(shape.sp.x, shape.sp.y, 1);
          // staticGraphics.endFill();
          break;
        case 'line':
          staticGraphics.lineStyle(lineWidth, color, lineAlpha);
          staticGraphics.moveTo(shape.sp.x, shape.sp.y);
          staticGraphics.lineTo(shape.ep.x, shape.ep.y);
          break;
        case 'point':
          if (this.isPointVisible(shape)) {
            staticGraphics.lineStyle(0, color, 1);
            staticGraphics.beginFill(color, 1);
            staticGraphics.drawCircle(shape.x, shape.y, size);
            staticGraphics.endFill();
          }

          break;
        default:
          break;
      }
    }
  };

  drawText = () => {
    const { staticGraphics, animateGraphics, textContainer } = this;
    textContainer.clear();
    const allData = _.filter(this.staticData.concat(this.animateData), { type: 'point' });
    for (let i = 0; i < allData.length; i += 1) {
      const obj = allData[i];
      const { type, src } = obj;
      const shape = obj.data;
      const size = src.size || 2;

      /* 点上的文字效果 */
      if (src.text && this.textCache.has(src)) {
        const textPIXI = this.textCache.get(src);
        if (!this.isPointVisible(shape)) {
          textPIXI.visible = false;
        } else {
          textPIXI.visible = true;
          /* 计算该点距离鼠标的位置（渐隐效果） */
          let alpha = 0.2;
          if (this.props.mouse.x != null) {
            const d = calcDistance(shape, this.props.mouse);
            alpha = Math.max(0.2, 1 - d / 550);
          }

          textPIXI.x = shape.x - 0.5 * textPIXI.width;

          if (src.textPosition === 'bottom') textPIXI.y = shape.y + size + 8;
          else textPIXI.y = shape.y - size - textPIXI.height - 8;
          textPIXI.alpha = alpha;

          if (src.textBackgroundColor) {
            textContainer.beginFill(src.textBackgroundColor, alpha - 0.2);
            textContainer.drawRoundedRect(
              textPIXI.x - 4,
              textPIXI.y - 2,
              textPIXI.width + 8,
              textPIXI.height + 4,
              4,
            );
            textContainer.endFill();
          }
        }
      }
    }
  };

  /* 判断点是否可见（坐标在屏幕内） */
  isPointVisible = p => {
    if (p.x < -10 || p.y < -10 || p.x > this.props.width + 10 || p.y > this.props.height + 10) {
      return false;
    }
    return true;
  };

  zeroPixel = { x: null, y: null };
  animateStep = 0;
  drawAnimate = () => {
    if (this.staticData.length + this.animateData.length === 0) return;
    const { staticGraphics, animateGraphics } = this;
    animateGraphics.clear();
    animateGraphics.lineStyle(0);

    const zeroPoint = this.props.lnglatToPixel(0, 0);
    const needReCalc = !_.isEqual(zeroPoint, this.zeroPixel);
    this.zeroPixel = zeroPoint;

    if (needReCalc) {
      this.staticDrawLength = this.bigdataDrawStep;
      this.drawLayer(true);
    } else if (this.staticDrawLength < this.staticData.length) {
      this.staticDrawLength += this.bigdataDrawStep;
      this.drawLayer(true, this.staticDrawLength - this.bigdataDrawStep);
    } else {
    }

    for (let i = 0; i < this.animateData.length; i += 1) {
      const obj = this.animateData[i];
      const { type, src } = obj;
      const color = src.color || config.color;
      const lineWidth = src.lineWidth || config.lineWidth;
      const lineAlpha = src.lineAlpha || config.lineAlpha;
      if (needReCalc) {
        obj.data = this.transferPos(type, src);
      }

      /* 动画进度 */
      obj.progress = obj.progress || [];
      if (this.animateStep === 0) {
        obj.progress.push(0);
      }

      /* 绘画 */

      const shape = obj.data;
      for (let j = 0; j < obj.progress.length; j += 1) {
        /* 补充前面的动画点 */
        if (j === 0 && _.includes(['airline', 'line'], type)) {
          while (obj.progress[j] < obj.data.distance - 100) {
            obj.progress.unshift(obj.progress[j] + 100);
          }
        }

        switch (type) {
          case 'airline':
            /* 飞行图动画 */
            if (obj.progress[j] < obj.data.distance) {
              const p = calcQuadBezierCurvePoint(
                shape.sp,
                shape.cp,
                shape.ep,
                obj.progress[j] / obj.data.distance,
              );
              if (!this.isPointVisible(p)) {
                break;
              }

              animateGraphics.lineStyle(0, color);
              animateGraphics.beginFill(color, 1);
              animateGraphics.drawCircle(p.x, p.y, Math.max(2, lineWidth));
              animateGraphics.endFill();
            } else if (obj.progress[j] < obj.data.distance + 100) {
              const alpha = obj.progress[j] - obj.data.distance;
              animateGraphics.lineStyle(
                Math.max(2, lineWidth) + 3 * alpha / 100,
                color,
                1 - alpha / 100,
              );
              animateGraphics.drawCircle(
                shape.ep.x,
                shape.ep.y,
                Math.max(2, lineWidth) + 10 * alpha / 100,
              );
              animateGraphics.beginFill(color, 1);
              animateGraphics.drawCircle(shape.ep.x, shape.ep.y, Math.max(2, lineWidth));
              animateGraphics.endFill();
            } else {
              obj.progress.shift();
            }
            break;
          case 'line':
            /* 直线动画 */
            if (obj.progress[j] < obj.data.distance) {
              const alpha = obj.progress[j] / obj.data.distance;
              const p = {
                x: shape.sp.x + (shape.ep.x - shape.sp.x) * alpha,
                y: shape.sp.y + (shape.ep.y - shape.sp.y) * alpha,
              };
              if (!this.isPointVisible(p)) {
                break;
              }

              animateGraphics.lineStyle(0, color);
              animateGraphics.beginFill(color, 1);
              animateGraphics.drawCircle(p.x, p.y, Math.max(2, lineWidth));
              animateGraphics.endFill();
            } else if (obj.progress[j] < obj.data.distance + 100) {
              const alpha = obj.progress[j] - obj.data.distance;
              animateGraphics.lineStyle(
                Math.max(2, lineWidth) + 3 * alpha / 100,
                color,
                1 - alpha / 100,
              );
              animateGraphics.drawCircle(
                shape.ep.x,
                shape.ep.y,
                Math.max(2, lineWidth) + 10 * alpha / 100,
              );
              animateGraphics.beginFill(color, 1);
              animateGraphics.drawCircle(shape.ep.x, shape.ep.y, Math.max(2, lineWidth));
              animateGraphics.endFill();
            } else {
              obj.progress.shift();
            }
            break;
          case 'point':
            if (!this.isPointVisible(shape)) {
              break;
            }

            /* 点动画 */
            if (obj.progress[j] < 100) {
              const alpha = obj.progress[j];
              const size = src.size || 2;
              animateGraphics.lineStyle(size + size * 2 * alpha / 100, color, 1 - alpha / 100);
              animateGraphics.drawCircle(shape.x, shape.y, size + size * 5 * alpha / 100);
            } else {
              obj.progress.shift();
            }

            break;
          default:
            break;
        }

        obj.progress[j] += 1;
      }
    }
    this.animateStep += 1;
    this.animateStep %= 100;
  };

  render() {
    return (
      <div
        className={`${PREFIX} ${this.props.className || ''}`}
        style={{
          width: this.props.width,
          height: this.props.height,
        }}
      >
        <canvas id={`${this._id}`} width={this.props.width} height={this.props.height} />
      </div>
    );
  }
}

AmapLayer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  lnglatToPixel: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  mouse: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

AmapLayer.defaultProps = {
  width: 800,
  height: 500,
  data: [],
};

export default AmapLayer;
