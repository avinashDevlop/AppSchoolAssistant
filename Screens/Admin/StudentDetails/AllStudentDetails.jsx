import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AllStudentDetails = () => {
  const navigation = useNavigation();
  const [Classopen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10th Class');
  const [classItems, setClassItems] = useState([]);
  const [Sectionopen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState();
  const [sectionItems, setSectionItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const tableHead = ['SI no.', 'Student Name', 'Gender', 'Grade', 'Attend'];
  const screenWidth = Dimensions.get('window').width;
  const widthArr = [
    screenWidth * 0.1,  // SI no.
    screenWidth * 0.4,  // Student Name
    screenWidth * 0.15, // Gender
    screenWidth * 0.15, // Grade
    screenWidth * 0.2   // Attend
  ];

  const handleRowPress = (studentDetails, index) => {
    navigation.navigate('Student Profile', { studentDetails, index });
  };

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents.json"
        );
        const data = response.data || {};

        if (data) {
          const dataArray = Object.entries(data).map(([value, label]) => ({
            value,
            label,
          }));
          setDataArray(dataArray);

          const fetchedOptions = Object.keys(data).map((className) => ({
            value: className,
            label: className,
          }));
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
            ...fetchedOptions,
          ];
          setClassItems(options);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching class options:", error);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        setLoading(true);
        let url = "";

        if (dataArray.some((item) => item.value === selectedClass)) {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents/${selectedClass}.json`;
        } else {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`;
        }

        const response = await axios.get(url);
        const data = response.data;

        if (data) {
          const sections = Object.keys(data).map(section => ({
            label: `${section}`,
            value: section
          }));
          setSectionItems(sections);
          setSelectedSection(sections[0]?.value || 'A');
        } else {
          setSectionItems([]);
          setSelectedSection(null);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching section options:", error);
      }
    };

    if (selectedClass) {
      fetchSectionOptions();
    }
  }, [selectedClass, dataArray]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        let url = "";

        if (dataArray.some((item) => item.value === selectedClass)) {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/previousYearStudents/${selectedClass}/${selectedSection}.json`;
        } else {
          url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`;
        }

        const response = await axios.get(url);
        const data = response.data || {};

        const gradeResponse = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}.json`
        );
        const allExamData = gradeResponse.data || {};
        const firstExamKey = Object.keys(allExamData)[0];
        const marksData = allExamData[firstExamKey]?.studentResults || {};

        const formattedData = Object.values(data).map((student, index) => {
          const studentFullName = `${student?.surname || ''} ${student?.name || ''}`;
          const studentGrade = marksData[studentFullName]?.grade || "N/A";

          return [
            index + 1,
            studentFullName, 
            student?.gender || 'N/A',
            studentGrade,
            student?.attendance || 'N/A',
            student,
          ];
        });

        setStudentData(formattedData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching student data:", error);
      }
    };

    if (selectedClass && selectedSection) {
      fetchStudentData();
    }
  }, [selectedClass, selectedSection, dataArray]);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <DropDownPicker
          open={Classopen}
          value={selectedClass}
          items={classItems}
          setOpen={setClassOpen}
          setValue={setSelectedClass}
          setItems={setClassItems}
          containerStyle={styles.dropdown}
        />
        <DropDownPicker
          open={Sectionopen}
          value={selectedSection}
          items={sectionItems}
          setOpen={setSectionOpen}
          setValue={setSelectedSection}
          setItems={setSectionItems}
          containerStyle={styles.dropdown}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal>
          <View>
            <Table borderStyle={{ borderColor: '#C10036' }}>
              <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table>
                {studentData && studentData.length > 0 ? (
                  studentData.map((rowData, rowIndex) => (
                    <TouchableOpacity key={rowIndex} onPress={() => handleRowPress(rowData[5], rowIndex)}>
                      <Row
                        data={rowData.slice(0, 5)}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          { backgroundColor: rowIndex % 2 === 1 ? '#eff0f2' : '#fff' },
                        ]}
                        textStyle={styles.cellText}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No data available</Text>
                )}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingBottom: 'auto',
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
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  header: { height: 40, backgroundColor: '#b8ebe0', textAlign: 'center' },
  text: { textAlign: 'center', fontWeight: '400' },
  dataWrapper: { marginTop: -1 },
  row: { height: 45 },
  cellText: {
    fontSize: 13,
    padding: 5,
    textAlign: 'center',
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    color: '#888',
  },
});

export default AllStudentDetails;
