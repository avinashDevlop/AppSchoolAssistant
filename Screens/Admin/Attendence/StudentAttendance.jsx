import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const StudentAttendance = ({ route }) => {
  const { className, gender, name, section } = route.params;
  const [attendanceData, setAttendanceData] = useState({});
  const [presentYear, setPresentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [noOfPresents, setNoOfPresents] = useState(0);
  const [noOfAbsents, setNoOfAbsents] = useState(0);
  const [computedWorkingDays, setComputedWorkingDays] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${className}/Section ${section}.json`);
        const data = response.data;

        const monthMap = {
          "january": "01",
          "february": "02",
          "march": "03",
          "april": "04",
          "may": "05",
          "june": "06",
          "july": "07",
          "august": "08",
          "september": "09",
          "october": "10",
          "november": "11",
          "december": "12"
        };

        const formattedData = {};
        let presentCount = 0;
        let absentCount = 0;
        let workingDaysCount = 0;

        for (const month in data) {
          for (const date in data[month]) {
            const attendanceRecord = data[month][date];
            const formattedDate = `${presentYear}-${monthMap[month.toLowerCase()]}-${date.split('_')[1]}`;

            if (attendanceRecord.isHoliday) {
              formattedData[formattedDate] = { selected: true, marked: false, selectedColor: '#B38A3C' }; // Yellow for Holiday
            } else {
              workingDaysCount++;
              if (attendanceRecord.present && attendanceRecord.present.includes(name)) {
                formattedData[formattedDate] = { selected: true, marked: false, selectedColor: 'green' }; // Green for Present
                presentCount++;
              } else if (attendanceRecord.absent && attendanceRecord.absent.includes(name)) {
                formattedData[formattedDate] = { selected: true, marked: false, selectedColor: '#c23a3a' }; // Red for Absent
                absentCount++;
              }
            }
          }
        }

        setAttendanceData(formattedData);
        setNoOfPresents(presentCount);
        setNoOfAbsents(absentCount);
        setComputedWorkingDays(workingDaysCount);
        setLoading(false); // Move setLoading(false) here to ensure it's set after data is fetched.
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false); // Also handle loading state in case of error.
      }
    };

    fetchAttendanceData();
  }, [className, section, name, presentYear]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Student Attendance Details</Text> */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: <Text style={styles.blueText}>{name}</Text></Text>
        <Text style={styles.infoText}>Gender: <Text style={styles.blueText}>{gender}</Text></Text>
        <Text style={styles.infoText}>Class: <Text style={styles.blueText}>{className}</Text></Text>
        <Text style={styles.infoText}>Section: <Text style={styles.blueText}>{section}</Text></Text>
        <Text style={styles.infoText}>
          Total Working Days: <Text style={styles.blueText}>{computedWorkingDays}</Text>
        </Text>
        <View style={styles.presentAbsentContainer}>
          <Text style={[styles.infoText, { paddingRight: 56 }]}>
            Present: <Text style={styles.greenText}>{noOfPresents}</Text>
          </Text>
          <Text style={styles.infoText}>
            Absent: <Text style={styles.redText}>{noOfAbsents}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>Attendance Calendar</Text>
        <Calendar
          markedDates={attendanceData}
          markingType="custom"
          theme={{
            todayTextColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            selectedDayBackgroundColor: '#00adf5',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8FF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  blueText: {
    color: '#2c2cab',
    fontWeight: '500',
  },
  greenText: {
    color: 'green',
    fontWeight: 'bold',
  },
  redText: {
    color: '#c23a3a',
    fontWeight: 'bold',
  },
  calendarContainer: {
    width: '100%',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  presentAbsentContainer: {
    flexDirection: 'row',
  },
});

export default StudentAttendance;