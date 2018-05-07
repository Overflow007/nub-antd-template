/* global  _ */
/* eslint no-use-before-define: 0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import * as d3 from 'd3';
import utils from 'common/utils';
import StatusLayer from 'components/StatusLayer';
import styles from './ForceGraph.scss';
import noData from './nodata.png';
import myForce from './myForce';

const PREFIX = 'force-graph';
const cx = utils.classnames(PREFIX, styles);

const AVATAR_SIZE = 48;
const AVATAR_BG_COLOR = '#FFF';
const CENTER_AVATAR_SIZE = 58;
const HALF_ARROW_WIDTH = 4;
const ARROW_HEIGHT = 10;
const ARROW_COLOR = '#CCC';
const LINK_DISTANCE = 80;

@observer
class ForceGraph extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        x: PropTypes.number,
        y: PropTypes.number,
        vx: PropTypes.number,
        vy: PropTypes.number,
        fx: PropTypes.number,
        fy: PropTypes.number,
        avatar: PropTypes.string,
        type: PropTypes.oneOf(['CENTER', 'FEATURE']),
      }),
    ).isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string,
        target: PropTypes.string,
        showArrow: PropTypes.bool,
      }),
    ).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    relationData: PropTypes.shape({
      points: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          tooltips: PropTypes.shape({
            name: PropTypes.string,
            weiboAmount: PropTypes.number,
          }),
          avatar: PropTypes.string,
          netizenType: PropTypes.oneOf(['NETIZEN', 'MOBILE', 'EMAIL']),
          type: PropTypes.oneOf(['CENTER', 'FEATURE']),
        }),
      ),
      pointRelations: PropTypes.arrayOf(
        PropTypes.shape({
          pointSourceId: PropTypes.string,
          pointTargetId: PropTypes.string,
          relationTime: PropTypes.string,
          relations: PropTypes.arrayOf(PropTypes.oneOf(['COMMENTED', 'FOLLOWED'])),
        }),
      ),
    }),
    nodeOverlay: PropTypes.func,
    linkOverlay: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
  };

  // componentDidMount() {
  //   this.draw();
  // }
  constructor(props) {
    super(props);
    this._id = `canvas${new Date().getTime()}`;
  }

  componentDidMount() {
    this.reload(this.props);
  }

  componentWillUpdate(nextProps) {
    if (
      !_.isEqual(this.props.nodes, nextProps.nodes) ||
      !_.isEqual(this.props.links, nextProps.links)
    ) {
      this.reload(nextProps);
    } else if (!_.isEqual(this.props, nextProps)) {
      setTimeout(this.ticked, 0);
    }
  }

  onWheel = e => {
    if (e.deltaY < 0) {
      /* 上移 */
      this.lineForce += 0.01;
    } else {
      /* 下移 */
      this.lineForce -= 0.01;
    }
  };
  lineForce = 1;

  reload = props => {
    if (props.nodes && props.nodes.length > 0) {
      this.ticked = this.draw(_.cloneDeep(props));
      this.loadingStatus = 'normal';
    } else {
      this.loadingStatus = 'empty';
    }
  };

  @observable loadingStatus = 'loading';

  draw(props = this.props) {
    const canvas = document.querySelector(`#${this._id}`);
    const noDataId = `forceGraphNoData${this._id}`;

    const forceGraph = this;

    let hover = null;
    /* 标记是否正在仿真 */
    let ticking = true;

    if (!canvas) {
      return;
    }

    let { width, height } = canvas;
    const context = canvas.getContext('2d');

    const { nodes, links, relationData, nodeOverlay } = props;
    const centerNode = _.find(nodes, { type: 'CENTER' });
    const centerNodeId = centerNode.id;

    const simulation = d3
      .forceSimulation(nodes)
      .nodes(nodes)
      .force(
        'charge',
        myForce(nodes, links),
        /* d3
          .forceManyBody()
          .distanceMin(AVATAR_SIZE)
          .distanceMax(LINK_DISTANCE * 6)
          .strength(-400), */
      )
      .force(
        'link',
        d3
          .forceLink(links)
          .distance(LINK_DISTANCE)
          .strength(forceGraph.lineForce)
          .id(d => d.id),
      )
      // .force('center', d3.forceCenter())
      // .force('x', d3.forceX())
      // .force('y', d3.forceY())
      .on('tick', () => {
        ticking = true;
        ticked();
      })
      .on('end', () => {
        ticking = false;
      });
    forceGraph.simulation = simulation;
    d3
      .select(canvas)
      .call(
        d3
          .drag()
          .container(canvas)
          .subject(dragsubject)
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended),
      )
      .on('mousemove', mousemove);

    function ticked() {
      width = canvas.width;
      height = canvas.height;

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      context.save();

      /* 未hover的线 */
      context.beginPath();
      links.forEach(link => {
        drawLink(link, false);
      });
      context.stroke();
      context.restore();

      context.save();
      context.beginPath();
      nodes.forEach(node => {
        drawNode(node, false);
      });
      context.restore();

      /* hover的线 */
      if (hover) {
        /* hover线 */
        context.save();
        context.lineWidth = 3;
        context.beginPath();
        const hoverNodes = [];
        links.forEach(link => {
          const node = drawLink(link, true);
          if (node) {
            hoverNodes.push(node);
          }
        });
        context.stroke();
        context.restore();

        /* hover节点 */
        context.save();
        context.beginPath();

        nodes.forEach(node => {
          if (node.hover || _.find(hoverNodes, { id: `${node.id}` })) {
            drawNode(node, true);
          }
        });
        context.restore();
      }
      context.restore();
    }

    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2, AVATAR_SIZE * 2);
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      const { subject } = d3.event;
      subject.fx = subject.x;
      subject.fy = subject.y;
      subject.startX = subject.x;
      subject.startY = subject.y;
      subject.hold = null;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      const { subject } = d3.event;
      subject.fx = null;
      subject.fy = null;

      if (subject && (subject.x !== subject.startX || subject.y !== subject.startY)) {
        if (Math.abs(subject.x) < width / 2 && Math.abs(subject.y) < height / 2) {
          subject.hold = {
            x: subject.x,
            y: subject.y,
          };
        }
      }
    }

    function drawLink(d, drawHover) {
      const sourceX = d.source.hold ? d.source.hold.x : d.source.x;
      const sourceY = d.source.hold ? d.source.hold.y : d.source.y;
      const targetX = d.target.hold ? d.target.hold.x : d.target.x;
      const targetY = d.target.hold ? d.target.hold.y : d.target.y;
      // context.save();

      if (hover) {
        if (`${d.source.id}` === hover || `${d.target.id}` === hover) {
          if (drawHover) {
            context.moveTo(sourceX, sourceY);
            context.lineTo(targetX, targetY);
            context.strokeStyle = 'rgba(100,200,255,0.8)';
            if (`${d.source.id}` === hover) return d.target;
            return d.source;
          }
        } else if (!drawHover) {
          context.moveTo(sourceX, sourceY);
          context.lineTo(targetX, targetY);
          context.strokeStyle = 'rgba(150,150,150,0.2)';
        }
      } else {
        context.moveTo(sourceX, sourceY);
        context.lineTo(targetX, targetY);
        context.strokeStyle = 'rgba(150,150,150,1)';
      }
      // context.restore();
      // if (d.showArrow) {
      //   drawArrow(d.source, d.target);
      // }
      return null;
    }

    function drawArrow(source, target) {
      const sourceId = source.id;
      const sourceX = source.x;
      const sourceY = source.y;
      const targetId = target.id;
      const targetX = target.x;
      const targetY = target.y;
      const diffX = targetX - sourceX;
      const diffY = targetY - sourceY;
      const angle = Math.atan(diffY / diffX);
      const sourceRadius = sourceId === centerNodeId ? CENTER_AVATAR_SIZE / 2 : AVATAR_SIZE / 2;
      const targetRadius = targetId === centerNodeId ? CENTER_AVATAR_SIZE / 2 : AVATAR_SIZE / 2;

      // const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

      context.save();
      context.beginPath();
      context.translate(sourceX, sourceY);
      context.rotate(angle);
      const moveToXSource = targetX > sourceX ? sourceRadius : -sourceRadius;
      context.moveTo(moveToXSource, 0);
      const lineToXSource =
        targetX > sourceX ? sourceRadius + ARROW_HEIGHT : -sourceRadius - ARROW_HEIGHT;
      context.lineTo(lineToXSource, HALF_ARROW_WIDTH);
      context.lineTo(lineToXSource, -HALF_ARROW_WIDTH);
      context.closePath();
      context.fillStyle = ARROW_COLOR;
      context.fill();
      context.restore();

      context.save();
      context.beginPath();
      context.translate(targetX, targetY);
      context.rotate(angle);
      const moveToXTarget = targetX > sourceX ? -targetRadius : targetRadius;
      context.moveTo(moveToXTarget, 0);
      const lineToXTarget =
        targetX > sourceX ? -targetRadius - ARROW_HEIGHT : targetRadius + ARROW_HEIGHT;
      context.lineTo(lineToXTarget, HALF_ARROW_WIDTH);
      context.lineTo(lineToXTarget, -HALF_ARROW_WIDTH);
      context.closePath();
      context.fillStyle = ARROW_COLOR;
      context.fill();
      context.restore();
    }

    function drawNode(d, drawHover) {
      if (d.hold) {
        d.x = d.hold.x;
        d.y = d.hold.y;
      }
      const avatarSize = (() => {
        if (d.size) return d.size;
        return d.type === 'CENTER' ? CENTER_AVATAR_SIZE : AVATAR_SIZE;
      })();
      let avatar = document.getElementById(cx(forceGraph._id + d.id));
      if (avatar == null) avatar = document.getElementById(noDataId);
      context.save();

      if (!drawHover && hover) {
        context.globalAlpha = 0.1;
      }

      context.beginPath();
      context.arc(d.x, d.y, avatarSize / 2, 0, 2 * Math.PI);
      context.closePath();

      /* 阴影 */
      context.save();
      if (drawHover) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowColor = '#64c8ff';
        context.shadowBlur = 10;
      } else {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowColor = '#999';
        context.shadowBlur = 5;
      }

      context.fillStyle = AVATAR_BG_COLOR;
      context.fill();
      context.restore();

      /* 文字 */
      if (d.text) {
        context.textAlign = 'center';
        let i = 0;
        d.text.split('\n').forEach(text => {
          if (_.trim(text)) {
            context.fillText(_.trim(text), d.x, 14 + d.y + 16 * i + avatarSize / 2);
            i += 1;
          }
        });
      }

      /* 图片 */
      context.save();
      context.clip();
      try {
        const avatarWidth = avatar.width / avatar.height * avatarSize;
        if (!d.background) {
          context.drawImage(
            document.getElementById(noDataId),
            d.x - avatarWidth / 2,
            d.y - avatarSize / 2,
            avatarWidth,
            avatarSize,
          );
        }
        context.drawImage(
          avatar,
          d.x - avatarWidth / 2,
          d.y - avatarSize / 2,
          avatarWidth,
          avatarSize,
        );
      } catch (e) {}

      context.strokeStyle = ARROW_COLOR;
      context.stroke();
      if (d.background) {
        context.fillStyle = d.background;
        context.fill();
      }
      context.restore();

      /* hold钉住效果 */
      if (d.hold) {
        const x = d.x + avatarSize / 3;
        const y = d.y - avatarSize / 3;
        const r = avatarSize / 10;
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.closePath();
        const rgrd = context.createRadialGradient(x - 2, y - 2, 0, x - 2, y - 2, r);
        rgrd.addColorStop(0, '#E00');
        rgrd.addColorStop(0.9, '#A00');
        rgrd.addColorStop(1, '#900');
        context.fillStyle = rgrd;
        context.fill();
        if (hover === d.id) {
          context.beginPath();
          context.fillStyle = '#CCC';
          context.fillText('单击取消固定', d.x, d.y - avatarSize / 2 - 3);
        }
      }

      context.restore();
    }

    let nodeOverlayElement;

    function mousemove() {
      const mouse = d3.mouse(this);
      const node = simulation.find(mouse[0] - width / 2, mouse[1] - height / 2, AVATAR_SIZE / 2);
      if (node) {
        hover = node.id;
        node.hover = true;
      } else {
        if (hover) {
          _.filter(nodes, { hover: true }).forEach(n => {
            const nn = n;
            nn.hover = false;
          });
        }
        hover = null;
      }
      if (node && !nodeOverlayElement && relationData) {
        const data = _.find(relationData.points, { id: node.id });
        if (nodeOverlay != null && !nodeOverlayElement) {
          nodeOverlayElement = React.createElement(nodeOverlay, {
            tooltips: toJS(data.tooltips),
            left: mouse[0],
            top: mouse[1],
          });
        }
        ReactDOM.render(nodeOverlayElement, document.getElementById(cx('node-overlay')));
      } else if (!node && nodeOverlayElement) {
        nodeOverlayElement = undefined;
        ReactDOM.render(<div />, document.getElementById(cx('node-overlay')));
      }
      if (!ticking) ticked();
    }

    return ticked;
  }

  renderAvatar = props =>
    props.nodes.map(item => (
      <img
        key={this._id + item.id + item.avatar}
        id={cx(this._id + item.id)}
        src={item.avatar}
        onError={e => {
          e.target.src = noData;
        }}
        alt={item.avatar}
        // width={AVATAR_SIZE}
        width="auto"
        height="auto"
      />
    ));

  render() {
    return (
      <StatusLayer
        status={this.props.loading ? 'loading' : this.loadingStatus}
        style={this.props.style}
      >
        <div className={cx('container')} onWheel={this.onWheel}>
          <canvas id={this._id} width={this.props.width} height={this.props.height} />
          <div style={{ display: 'none' }}>
            {this.renderAvatar(this.props)}
            <img id={`forceGraphNoData${this._id}`} key="nodata" src={noData} alt="暂无图片" />
          </div>
          <div id={cx('node-overlay')} />
        </div>
      </StatusLayer>
    );
  }
}

export default ForceGraph;
