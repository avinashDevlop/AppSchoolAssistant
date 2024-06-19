import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, SafeAreaView } from "react-native";
import TimeTableView, { genTimeBlock } from "react-native-timetable";
import axios from "axios";

// Wrapper to handle default props
const TimeTableViewWrapper = ({
  events,
  pivotTime,
  pivotEndTime,
  pivotDate,
  nDays,
  onEventPress,
  headerStyle,
  formatDateHeader,
  locale,
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

const App = ({ route }) => {
  const { className, section } = route.params;
  const [selectedClass] = useState(className);
  const [selectedSection] = useState(section);
  const [timetableData, setTimetableData] = useState({});

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const data = {};

        for (const day of days) {
          const url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/SchoolTimeTable/${selectedClass}/${selectedSection}/${day}.json`;
          const response = await axios.get(url);
          if (response.data !== null) {
            data[day] = response.data;
          }
        }

        setTimetableData(data);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData();
  }, [selectedClass, selectedSection]);

  const onEventPress = (evt) => {
    const { title, firstTime, lastTime, day, period } = evt;
    Alert.alert(
      "Event Details",
      `Day: ${day}\nPeriod: ${period}\nSubject: ${title}\nStart Time: ${firstTime}\nEnd Time: ${lastTime}`
    );
  };

  const renderTimetable = () => {
    const periods = {
      "Period-1": { startTime: 1, endTime: 2 },
      "Period-2": { startTime: 2, endTime: 3 },
      "Period-3": { startTime: 3, endTime: 4 },
      "Period-4": { startTime: 4, endTime: 5 },
      "Period-5": { startTime: 5, endTime: 6 },
      "Period-6": { startTime: 6, endTime: 7 },
      "Period-7": { startTime: 7, endTime: 8 },
      "Period-8": { startTime: 8, endTime: 9 },
      "Period-9": { startTime: 9, endTime: 10 },
    };

    const timetable = [];

    for (const day in timetableData) {
      for (const period in timetableData[day]) {
        const subject = timetableData[day][period]?.subjectName;
        if (subject) {
          const startPosition = periods[period].startTime;
          const endPosition = periods[period].endTime;
          const startTime = timetableData[day][period].startTime;
          const endTime = timetableData[day][period].endTime;
          timetable.push({
            title: subject,
            day: day,
            period: period,
            firstTime: startTime,
            lastTime: endTime,
            startTime: genTimeBlock(day.substring(0, 3).toUpperCase(), startPosition),
            endTime: genTimeBlock(day.substring(0, 3).toUpperCase(), endPosition),
          });
        }
      }
    }

    return timetable;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TimeTableViewWrapper
          events={renderTimetable()}
          onEventPress={onEventPress}
          pivotTime={1}
          pivotEndTime={10}
          pivotDate={genTimeBlock("mon")}
          nDays={6}
          headerStyle={styles.headerStyle}
          formatDateHeader="dddd"
          locale="en-US"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#81E1B8",
  },
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: "#fff",
  },
});

export default App;