import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

const RADIAN = Math.PI / 180;

const color = ['#4d81a1','#57e0f5', '#edcd41', '#36d5a0', '#c884f3'];

@observer
export default class PieCharts extends Component {
  @observable colors = [];
  @observable length = 0;

  componentDidUpdate() {
    if(this.props.data.length != this.length) {
      this.colors = this.props.data.map((item)=>{
        return this.getRandomColor()
      })
      this.length = this.props.data.length; 
    }
  }

  // 随机颜色
  getRandomColor(){
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    return `rgb(${r},${g},${b})`
  }

  renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
   const x  = cx + radius * Math.cos(-midAngle * RADIAN);
   const y = cy  + radius * Math.sin(-midAngle * RADIAN);
  
   return (
     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
       {`${(percent * 100).toFixed(0)}%`}
     </text>
   );
 };
  render() {
    const {width, height} = this.props;
    return (
      <PieChart width={width} height={height}>
        <Pie
          isAnimationActive={false}
          data={this.props.data}
          dataKey="value"
          cx={this.props.width/2 - this.props.offsetX}
          cy={this.props.height/2 - this.props.offsetY}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          label={pie => pie.name}
          // labelLine={this.renderCustomizedLabel}
        >
          {this.props.data.map((entry, index) => <Cell key={index} fill={color[index % color.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}

PieCharts.propTypes = {
  width:PropTypes.number,
  height:PropTypes.number,
  data:PropTypes.array,
  offsetX:PropTypes.number,
  offsetY:PropTypes.number,
}

PieCharts.defaultProps = {
  width:400,
  height:400,
  data:[],
  offsetX:15,
  offsetY:30,
}

