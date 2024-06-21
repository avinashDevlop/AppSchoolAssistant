import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Modal, Pressable, Button, Animated, FlatList, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import api from '../../../api';

const TimeTable = () => {
  const [classOpen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Class');
  const [classItems, setClassItems] = useState([]);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [sectionItems, setSectionItems] = useState([]);
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCellDetails, setSelectedCellDetails] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));

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
      setError('');
      setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching section options:', error);
        setError('Failed to load sections. Please try again.');
        setLoading(false);
      }
    };

    fetchSectionOptions();
  }, [selectedClass]);

  useEffect(() => {
    const fetchTimetableData = async () => {
      setError('');
      setLoading(true);
      try {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const periods = 9;
        const data = Array(periods).fill(null).map(() => Array(days.length).fill(''));

        // Get Monday times
        const mondayUrl = `SchoolTimeTable/${selectedClass}/${selectedSection}/Monday.json`;
        const mondayResponse = await api.get(mondayUrl);
        const mondayData = mondayResponse.data;

        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          const url = `SchoolTimeTable/${selectedClass}/${selectedSection}/${day}.json`;
          const response = await api.get(url);
          if (response.data !== null) {
            const dayData = response.data;
            for (let j = 0; j < periods; j++) {
              const period = `Period-${j + 1}`;
              data[j][i] = {
                subjectName: dayData[period]?.subjectName || '',
                startTime: mondayData[period]?.startTime || '', // Take from Monday
                endTime: mondayData[period]?.endTime || ''    // Take from Monday
              };
            }
          }
        }

        setTimetableData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetable data:', error);
        setError('Failed to load timetable data. Please try again.');
        setLoading(false);
      }
    };

    if (selectedClass && selectedSection) {
      fetchTimetableData();
    }
  }, [selectedClass, selectedSection]);

  const handleCellPress = (subject, period, dayIndex) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const cellData = timetableData[period][dayIndex];

    setSelectedCellDetails({
      period: `Period-${period + 1}`,
      subject: cellData.subjectName,
      day: days[dayIndex],
      startingTime: convertTo12HourFormat(cellData.startTime),
      endingTime: convertTo12HourFormat(cellData.endTime)
    });
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getColor = (subject) => {
    if (!subject) return '#FFFFFF'; // Default color for undefined subjects

    switch (subject.trim().toLowerCase()) {
      case 'telugu':
        return '#F3D9DF';
      case 'english':
        return '#EDE7F6';
      case 'hindi':
        return '#FFF9C4';
      case 'physics':
        return '#B3E5FC';
      case 'biology':
        return '#DCEDC8';
      case 'social':
        return '#FFE0B2';
      case 'computer':
        return '#D1C4E9';
      case 'break':
        return '#FFCCBC';
      case 'science':
        return '#FaC6D2';
      case 'drawing':
        return '#FFCDF4';
      case 'maths':
        return '#FFCDD2';
      default:
        return '#F1F1F1';
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Mon</Text>
      <Text style={styles.headerCell}>Tue</Text>
      <Text style={styles.headerCell}>Wed</Text>
      <Text style={styles.headerCell}>Thu</Text>
      <Text style={styles.headerCell}>Fri</Text>
      <Text style={styles.headerCell}>Sat</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
      <View key={index} style={styles.row}>
        <Text style={styles.periodCell}>{index + 1}</Text>
        {item.map((cellData, columnIndex) => (
          <TouchableOpacity
            key={columnIndex}
            style={[styles.cell, { backgroundColor: getColor(cellData.subjectName) }]}
            onPress={() => handleCellPress(cellData.subjectName, index, columnIndex)}
          >
            <Text style={styles.cellText}>{cellData.subjectName || ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => { setError(''); setLoading(true); fetchSectionOptions(); }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <DropDownPicker
          open={classOpen}
          value={selectedClass}
          items={classItems}
          setOpen={setClassOpen}
          setValue={setSelectedClass}
          setItems={setClassItems}
          containerStyle={styles.dropdown}
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />
        <DropDownPicker
          open={sectionOpen}
          value={selectedSection}
          items={sectionItems}
          setOpen={setSectionOpen}
          setValue={setSelectedSection}
          setItems={setSectionItems}
          containerStyle={styles.dropdown}
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />
      </View>
      <ScrollView horizontal>
        <FlatList
          data={timetableData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Period Details</Text>
            <Text style={styles.modalText}>Period: {selectedCellDetails.period}</Text>
            <Text style={styles.modalText}>Subject: {selectedCellDetails.subject}</Text>
            <Text style={styles.modalText}>Day: {selectedCellDetails.day}</Text>
            <Text style={styles.modalText}>Starting Time: {selectedCellDetails.startingTime}</Text>
            <Text style={styles.modalText}>Ending Time: {selectedCellDetails.endingTime}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  dropdownStyle: {
    backgroundColor: '#EFEFEF',
  },
  dropdownContainerStyle: {
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 30,
    width: 520
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    width: 550
  },
  periodCell: {
    flex: 0.5,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginRight: 5,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cellText: {
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimeTable;