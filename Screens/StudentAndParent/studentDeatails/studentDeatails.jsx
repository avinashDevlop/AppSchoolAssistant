import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Dimensions } from 'react-native';
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

  const tableHead = ['SI no.', 'Student Name', 'Gender', 'Father Name', 'PHno.'];
  const screenWidth = Dimensions.get('window').width;
  const widthArr = [screenWidth * 0.2, screenWidth * 0.4, screenWidth * 0.15, screenWidth * 0.4, screenWidth * 0.2];

  const handleRowPress = (studentDetails, index) => {
    navigation.navigate('Student Profile', { studentDetails, index });
  };

  useEffect(() => {
    setLoading(true);
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
    setLoading(false);
  }, []);
  

  useEffect(() => {
    const fetchSectionOptions = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`);
        const data = response.data || {};

        if (data) {
          const sections = Object.keys(data).map(section => ({
            label: `${section}`,
            value: section
          }));
          setSectionItems(sections);
          setSelectedSection(sections[0]?.value || 'A');
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

        const response = await axios.get(`https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}/${selectedSection}.json`);
        const data = response.data || {};
        const formattedData = data ? Object.values(data).map((student, index) => [
          index + 1,
          `${student.surname} ${student.name}`,
          student.gender,
          student.fathersName,
          student.fathersMobileNumber,
          student,
        ]) : [];
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
                      <Row
                        key={rowIndex}
                        data={rowData.slice(0, 5)}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          { backgroundColor: rowIndex % 2 === 1 ? '#eff0f2' : '#fff' },
                        ]}
                        textStyle={styles.cellText}
                      />
                  ))
                ) : (
                  <Text>No data available</Text>
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
  header: {
    height: 40,
    backgroundColor: '#b8ebe0',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
  },
  cellText: {
    textAlign: 'center',
    paddingHorizontal: 5,
    fontSize: 12,
  },
});

export default AllStudentDetails;