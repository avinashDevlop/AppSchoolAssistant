import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Table, Row } from 'react-native-table-component';

const ClassWiseAttendance = ({ route, navigation }) => {
  const [studentData, setStudentData] = useState([]);
  const { className, section, present, absent, presentData = [], absentData = [] } = route.params;
  const presentCount = parseInt(present);
  const absentCount = parseInt(absent);
  const totalStudents = presentCount + absentCount;

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.toLocaleString('default', { weekday: 'long' });
    const currentDate = date.toLocaleDateString();
    return `${day}, ${currentDate}`;
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${className}/Section ${section}.json`
        );
        if (response.data) {
          const data = Object.entries(response.data).map(([key, value]) => ({
            ...value,
            fullName: `${value.surname} ${value.name}`.trim()
          }));
          setStudentData(data);
        } else {
          setStudentData([]);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [className, section]);
  
  const getStudentInfo = (name) => {
    const student = studentData.find((student) => student.fullName === name);
    return student || { fullName: name, gender: 'N/A' };
  };

  const tableHead = ['Roll No', 'Student Name', 'Gender', 'Attend'];
  const widthArr = [58, 150, 66, 69];

  const tableData = [
    ...presentData.map((student, index) => {
      const studentInfo = getStudentInfo(student);
      return {
        rollNo: index + 1,
        fullName: studentInfo.fullName,
        gender: studentInfo.gender,
        status: 'Present'
      };
    }),
    ...absentData.map((student, index) => {
      const studentInfo = getStudentInfo(student);
      return {
        rollNo: presentData.length + index + 1,
        fullName: studentInfo.fullName,
        gender: studentInfo.gender,
        status: 'Absent'
      };
    })
  ];

  const handleRowPress = (rowData, index) => {
    navigation.navigate('StudentAttendance', {
      className,
      section,
      rollNo: rowData.rollNo,
      name: rowData.fullName,
      gender: rowData.gender,
      status: rowData.status,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>Class: {className}</Text>
        <Text style={styles.headerText}>Section: {section}</Text>
      </View>
      <Text style={styles.dateText}>{getCurrentDate()}</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Students: {totalStudents}</Text>
        <Text style={styles.summaryText}>Present: {presentCount}</Text>
        <Text style={styles.summaryText}>Absent: {absentCount}</Text>
      </View>
      <ScrollView style={styles.tableScrollView} horizontal={true}>
        <View>
          <Table borderStyle={styles.tableBorder}>
            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
            <ScrollView style={styles.dataWrapper}>
              {tableData.map((rowData, index) => (
                <TouchableOpacity key={index} onPress={() => handleRowPress(rowData, index)}>
                  <Row
                    data={[rowData.rollNo, rowData.fullName, rowData.gender, rowData.status]}
                    widthArr={widthArr}
                    style={[styles.row, index % 2 && { backgroundColor: '#eff0f2' }]}
                    textStyle={styles.text}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Table>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 9,
    backgroundColor: "#FAF8FF",
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableScrollView: {
    flex: 1,
    width: '100%',
  },
  tableBorder: {
    borderColor: '#ccc',
  },
  header: {
    height: 40,
    backgroundColor: '#b8ebe0',
    borderBottomWidth: 1,
  },
  text: {
    textAlign: 'center',
    fontWeight: '700',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: 'white'
  },
});

export default ClassWiseAttendance;