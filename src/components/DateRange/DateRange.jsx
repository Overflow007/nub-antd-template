import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { DatePicker } from 'antd';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import styles from './DateRange.scss';

const PREFIX = 'date-range';
const cx = utils.classnames(PREFIX, styles);

class DateRangeModel {
  @observable startValue = null;
  @observable endValue = null;
  @observable endOpen = false;
}

@observer
class DateRange extends Component {
  constructor(props) {
    super(props);
    this.model = new DateRangeModel();
    this.updateDateValue(this.props);
  }

  componentWillUpdate(props) {
    this.updateDateValue(props);
  }

  updateDateValue = props => {
    if (typeof props.startDate !== 'undefined') this.model.startValue = props.startDate;
    if (typeof props.endDate !== 'undefined') this.model.endValue = props.endDate;
  };

  onStartChange = value => {
    this.model.startValue = value;
    this.props.onStartChange(value);
  };

  onEndChange = value => {
    this.model.endValue = value;
    this.props.onEndChange(value);
  };

  disabledStartDate = startValue => {
    const { endValue } = this.model;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.model;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.model.endOpen = true;
    }
  };

  handleEndOpenChange = open => {
    this.model.endOpen = open;
  };
  render() {
    return (
      <div className={PREFIX} style={this.props.style}>
        {this.props.showStartDate
          ? [
            <span key={this.props.startLabel} className={cx('label')}>
              {this.props.startLabel}
            </span>,
            <DatePicker
              key="null"
              disabledDate={this.disabledStartDate}
              format="YYYY-MM-DD"
              value={this.model.startValue}
              placeholder="Start"
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
              style={{ width: 150 }}
              size="small"
            />,
            ]
          : null}
        {this.props.showEndDate
          ? [
            <span key={this.props.endLabel} className={cx('label')}>
              {this.props.endLabel}
            </span>,
            <DatePicker
              key="null"
              disabledDate={this.disabledEndDate}
              format="YYYY-MM-DD"
              value={this.model.endValue}
              placeholder="End"
              onChange={this.onEndChange}
              open={this.model.endOpen}
              onOpenChange={this.handleEndOpenChange}
              style={{ width: 150 }}
              size="small"
            />,
            ]
          : null}
      </div>
    );
  }
}

DateRange.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  showStartDate: PropTypes.bool,
  showEndDate: PropTypes.bool,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
};

DateRange.defaultProps = {
  showStartDate: true,
  showEndDate: true,
  startLabel: '起始时间',
  endLabel: '截止时间',
  onStartChange: () => {},
  onEndChange: () => {},
};

export default DateRange;
