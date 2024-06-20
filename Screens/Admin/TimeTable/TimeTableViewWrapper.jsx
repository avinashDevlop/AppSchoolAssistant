import React from 'react';
import { StyleSheet } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';

const TimeTableViewWrapper = ({
  events = [],
  pivotTime = 1,
  pivotEndTime = 10,
  pivotDate = genTimeBlock('mon'),
  nDays = 6,
  onEventPress = () => {},
  headerStyle = styles.headerStyle,
  formatDateHeader = 'dddd',
  locale = 'en-US',
}) => (
  <TimeTableView
    events={events}
    pivotTime={pivotTime}
    pivotEndTime={pivotEndTime}
    pivotDate={pivotDate}
    nDays={nDays}
    onEventPress={onEventPress}
    headerStyle={headerStyle}
    formatDateHeader={formatDateHeader}
    locale={locale}
  />
);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8',
  },
});

export default TimeTableViewWrapper;
