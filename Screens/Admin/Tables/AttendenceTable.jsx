import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ExampleThree = () => {
  const navigation = useNavigation();
  const [tableData, setTableData] = useState([]);
  const tableHead = ['Class', 'Section', 'Total', 'Present', 'Absent'];
  const widthArr = [68, 67, 68, 68, 68];

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = today.toLocaleString('default', { month: 'long' }).toLowerCase();

      const classes = ['10th Class', '9th Class', '8th Class', '7th Class', '6th Class', '5th Class', '4th Class', '3rd Class'];
      const sections = ['A', 'B', 'C'];

      try {
        const requests = classes.flatMap(className =>
          sections.map(async section => {
            const presentResponse = await axios.get(
              `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${className}/Section ${section}/${month}/${month}_${day}/present.json`
            );
            const absentResponse = await axios.get(
              `https://studentassistant-18fdd-default-rtdb.firebaseio.com/Attendance/StudAttendance/${className}/Section ${section}/${month}/${month}_${day}/absent.json`
            );

            const presentData = presentResponse.data ? Object.values(presentResponse.data) : [];
            const absentData = absentResponse.data ? Object.values(absentResponse.data) : [];

            const present = presentData.length;
            const absent = absentData.length;
            return {
              className,
              section,
              total: present + absent,
              present,
              absent,
              presentData,
              absentData,
            };
          })
        );

        const results = await Promise.all(requests);
        setTableData(results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleRowPress = (rowData) => {
    const { className, section } = rowData;
    navigation.navigate('Class Wise Attendance', { className, section, ...rowData });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderColor: '#C10036' }}>
            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table>
              {tableData.length > 0 ? (
                tableData.map((rowData, rowIndex) => (
                  <TouchableOpacity key={rowIndex} onPress={() => handleRowPress(rowData)}>
                    <Row
                      data={[rowData.className, rowData.section, rowData.total, rowData.present, rowData.absent]}
                      widthArr={widthArr}
                      style={StyleSheet.flatten([
                        styles.row,
                        { backgroundColor: rowIndex % 2 === 1 ? '#eff0f2' : '#fff' },
                      ])}
                      textStyle={styles.text}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.loadingText}>Loading....</Text>
              )}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 88, backgroundColor: '#fff' },
  header: { height: 40, backgroundColor: '#b8ebe0', borderBottomWidth: 1 },
  text: { textAlign: 'center', fontWeight: '700' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  loadingText: { textAlign: 'center', marginTop: 20 },
});

export default ExampleThree;