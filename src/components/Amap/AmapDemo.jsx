import React, { Component } from 'react';
import { Button, Menu, Dropdown, Select } from 'antd';
import Amap from 'components/Amap';

/* 普通data */
const data = [
  {
    type: 'line', //直线
    data: [
      {
        fromLng: 116.394967,
        fromLat: 39.914867,
        toLng: 101.849068,
        toLat: 36.515012,
        animate: true, //是否显示动画
      },
    ],
  },
  {
    type: 'airline', //曲线
    data: [
      {
        fromLng: 121.484677,
        fromLat: 31.245657,
        toLng: 116.394967,
        toLat: 39.914867,
        color: 0xff0000, //线条颜色
        lineAlpha: 0.7, //线条深浅
        animate: true,
      },
      {
        fromLng: 121.484677,
        fromLat: 31.245657,
        toLng: 121.537366,
        toLat: 25.022196,
        color: 0x00ff00, //线条颜色
        lineAlpha: 0.3, //线条深浅
        lineWidth: 3, //线条粗细
        animate: true,
      },
      {
        fromLng: 121.484677,
        fromLat: 31.245657,
        toLng: 121.613767,
        toLat: 38.961522,
        animate: true,
      },
      {
        fromLng: 121.484677,
        fromLat: 31.245657,
        toLng: 113.220715,
        toLat: 23.145816,
        animate: true,
      },
    ],
  },
  {
    type: 'point', //点
    data: [
      {
        lng: 106.463326,
        lat: 29.579274,
        size: 5, //点大小
        animate: true,
        text: '测试文字1',
        textStyle: { fill: '#FFFFFF' },
        // textBackgroundColor: 0x229944,
      },
      {
        lng: 106.66108,
        lat: 26.692705,
        animate: true,
        text: '测试文字2',
        textPosition: 'bottom',
        textBackgroundColor: 0xcc2255,
      },
      {
        lng: 112.94526,
        lat: 28.1554,
        animate: true,
      },
    ],
  },
];

/* 随机数data */
const data1 = [
  {
    type: 'airline',
    data: (() => {
      const res = [];
      for (let i = 0; i < 1000; i += 1) {
        res.push({
          // animate: true,
          fromLng: 121.484677,
          fromLat: 31.245657,
          lineAlpha: 0.2,
          toLng: Math.random() * 35 + 86.394967,
          toLat: Math.random() * 25 + 19.914867,
        });
      }
      return res;
    })(),
  },
];

const data2 = [
  {
    type: 'airline',
    data: (() => {
      const nodes = [
        {
          lng: 121.484677,
          lat: 31.245657,
        },
      ];
      for (let i = 0; i < 300; i += 1) {
        nodes.push({
          lng: Math.random() * 100 + 80,
          lat: Math.random() * 30 + 20,
        });
      }
      const res = [];
      for (let i = 0; i < 60000; i += 1) {
        const fromIndex = parseInt(Math.random() * nodes.length, 10);
        let toIndex = 0;
        do {
          toIndex = parseInt(Math.random() * nodes.length, 10);
        } while (toIndex === fromIndex);

        res.push({
          // animate: true,
          fromLng: nodes[fromIndex].lng,
          fromLat: nodes[fromIndex].lat,
          lineAlpha: 0.05,
          lineWidth: 0.5,
          bezierAlpha: Math.random() * 3 + 2,
          toLng: nodes[toIndex].lng,
          toLat: nodes[toIndex].lat,
        });
      }
      return res;
    })(),
  },
];

/* 随机数data */
const data3 = [
  {
    type: 'point',
    data: (() => {
      const res = [];
      for (let i = 0; i < 1000; i += 1) {
        res.push({
          // animate: true,
          lng: Math.random() * 35 + 86.394967,
          lat: Math.random() * 25 + 19.914867,
          text: '测试文字' + i,
          textBackgroundColor: 0xcc2255,
        });
      }
      return res;
    })(),
  },
];

class AmapDemo extends Component {
  render() {
    return (
      <div>
        <Amap width={1200} height={900} data={data3} />
      </div>
    );
  }
}

export default AmapDemo;
