import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, View, ScrollView, Text, Dimensions} from "react-native";
import { Table, Row } from "react-native-table-component";

const StudentResultCard = ({ route }) => {
  const { studentName, gender, selectedClass, selectedSection, TestName } = route.params || {};
  const [testData, setTestData] = useState({});
  const screenWidth = Dimensions.get("window").width;
  const widthArr = [
    screenWidth * 0.1,   // SI no.
    screenWidth * 0.4,   // Subject
    screenWidth * 0.25,  // Obtain marks
    screenWidth * 0.25,  // Total marks
  ];
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamMarks/${selectedClass}/${selectedSection}.json`
        );
        const data = response.data || {};
        setTestData(data);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    if (selectedSection) {
      fetchTestData();
    }
  }, [selectedClass, selectedSection]);

  const renderTables = () => {
    const predefinedSubjectOrder = [
      "Telugu", 
      "Hindi", 
      "English", 
      "Mathematics", 
      "Science", 
      "Social", 
      "Computer", 
      "General Knowledge", 
      "Drawing"
    ];
  
    return Object.keys(testData).map((testName, idx) => {
      const { conductedOn = {}, studentResults = {} } = testData[testName] || {}; 
      const { firstDate, lastDate } = conductedOn;
      
      const studentData = studentResults[studentName] || {};
      const { subjects = {}, subjectMaxMarks={}, totalMarks = 0, obtainMarks = 0, percentage = 0 } = studentData;
  
      // Convert subjects into an ordered array based on predefinedSubjectOrder
      const studentResultsArray = predefinedSubjectOrder
        .filter(subject => subjects.hasOwnProperty(subject)) // Only include subjects that exist in the data
        .map((subject, index) => ({
          SINo: index + 1,
          Subject: subject,
          "Obtain marks": subjects[subject],
          "Total marks": subjectMaxMarks[subject],
        }));
    
      return (
        <View key={idx} style={styles.tableContainer}>
          <View style={styles.textContainer1}>
            <Text style={styles.text}>Exam Name: {testName}</Text>
            <Text style={styles.text}>Conducted on:: {firstDate} : {lastDate}</Text>
          </View>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderColor: "#C10036" }}>
                <Row 
                  data={["SI no.", "Subject", "Obtain marks", "Total marks"]} 
                  widthArr={widthArr} 
                  style={styles.header} 
                  textStyle={styles.headerText} 
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table>
                  {studentResultsArray.length > 0 ? (
                    studentResultsArray.map((rowData, rowIndex) => (
                      <Row
                        key={rowIndex}
                        data={Object.values(rowData)}
                        widthArr={widthArr}
                        style={{
                          ...styles.row,
                          backgroundColor: rowIndex % 2 === 1 ? "#eff0f2" : ""
                        }}
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
          <View style={styles.textContainer}>
            <Text style={styles.text}>Total Marks: {obtainMarks}/{totalMarks}</Text>
            <Text style={styles.text}>Percentage: {percentage}%</Text>
          </View>
        </View>
      );
    });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{studentName || "N/A"}</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{gender || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Class:</Text>
          <Text style={styles.value}>{selectedClass || "N/A"}</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Section:</Text>
          <Text style={styles.value}>{selectedSection || "N/A"}</Text>
        </View>
      </View>

      <ScrollView>
        {renderTables()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    width: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  textContainer1: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: "#fff",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "right",
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  tableContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  header: {
    height: 40,
    backgroundColor: "#b8ebe0",
    borderBottomWidth: 1,
  },
  headerText: { 
    textAlign: "center",
    fontWeight: "900",
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
  },
  cellText: {
    textAlign: "center",
    fontWeight: "500",
    paddingVertical: 10,
  },
});

export default StudentResultCard;