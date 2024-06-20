import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import TimeTableViewWrapper from './TimeTableViewWrapper'; 
import DropDownPicker from 'react-native-dropdown-picker';
import { genTimeBlock } from 'react-native-timetable';
import api from '../../../api';

const TimeTable = () => {
  const [classOpen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Class');
  const [classItems, setClassItems] = useState([]);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [sectionItems, setSectionItems] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchClassOptions = async () => {
      const options = [
        { value: '10th Class', label: '10th Class' },
        { value: '9th Class', label: '9th Class' },
        { value: '8th Class', label: '8th Class' },
        { value: '7th Class', label: '7th Class' },
        { value: '6th Class', label: '6th Class' },
        { value: '5th Class', label: '5th Class' },
        { value: '4th Class', label: '4th Class' },
        { value: '3rd Class', label: '3rd Class' },
        { value: '2nd Class', label: '2nd Class' },
        { value: '1st Class', label: '1st Class' },
        { value: 'UKG', label: 'UKG' },
        { value: 'LKG', label: 'LKG' },
        { value: 'Pre-K', label: 'Pre-K' },
      ];
      setClassItems(options);
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        const url = `admissionForms/${selectedClass}.json`;
        const response = await api.get(url);
        const data = response.data;

        if (data) {
          const sections = Object.keys(data).map((section) => ({
            label: section,
            value: section,
          }));
          setSectionItems(sections);
          setSelectedSection(sections[0]?.value || 'Section A');
        }
      } catch (error) {
        console.error('Error fetching section options:', error);
      }
    };

    fetchSectionOptions();
  }, [selectedClass]);

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const data = {};

        for (const day of days) {
          const url = `SchoolTimeTable/${selectedClass}/${selectedSection}/${day}.json`;
          const response = await api.get(url);
          if (response.data !== null) {
            data[day] = response.data;
          }
        }

        setTimetableData(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching timetable data:', error);
        setLoading(false); // Ensure loading state is handled even in case of errors
      }
    };

    if (selectedClass && selectedSection) {
      fetchTimetableData();
    }
  }, [selectedClass, selectedSection]);

  const onEventPress = (evt) => {
    const { title, firstTime, lastTime, day, period } = evt;
    Alert.alert(
      'Event Details',
      `Day: ${day}\nPeriod: ${period}\nSubject: ${title}\nStart Time: ${firstTime}\nEnd Time: ${lastTime}`
    );
  };

  const renderTimetable = () => {
    const periods = {
      'Period-1': { startTime: 1, endTime: 2 },
      'Period-2': { startTime: 2, endTime: 3 },
      'Period-3': { startTime: 3, endTime: 4 },
      'Period-4': { startTime: 4, endTime: 5 },
      'Period-5': { startTime: 5, endTime: 6 },
      'Period-6': { startTime: 6, endTime: 7 },
      'Period-7': { startTime: 7, endTime: 8 },
      'Period-8': { startTime: 8, endTime: 9 },
      'Period-9': { startTime: 9, endTime: 10 },
    };

    const timetable = [];

    for (const day in timetableData) {
      for (const period in timetableData[day]) {
        const subject = timetableData[day][period]?.subjectName;
        if (subject) {
          const startPosition = periods[period].startTime;
          const endPosition = periods[period].endTime;
          const startTime = timetableData['Monday'][period].startTime;
          const endTime = timetableData['Monday'][period].endTime;
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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.dropdownsContainer}>
          <DropDownPicker
            open={classOpen}
            value={selectedClass}
            items={classItems}
            setOpen={setClassOpen}
            setValue={setSelectedClass}
            setItems={setClassItems}
            containerStyle={styles.dropdown}
          />
          <DropDownPicker
            open={sectionOpen}
            value={selectedSection}
            items={sectionItems}
            setOpen={setSectionOpen}
            setValue={setSelectedSection}
            setItems={setSectionItems}
            containerStyle={styles.dropdown}
          />
        </View>
        <TimeTableViewWrapper
          events={renderTimetable()}
          onEventPress={onEventPress}
          headerStyle={styles.headerStyle}
          formatDateHeader={'dddd'}
          locale={'en-US'}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8',
  },
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: '#fff',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TimeTable;