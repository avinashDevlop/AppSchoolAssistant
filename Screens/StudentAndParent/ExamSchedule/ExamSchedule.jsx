import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { Table, Row } from "react-native-table-component";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const ExamSchedule = ({route}) => {
  const { className, section } = route.params;
  const [examOpen, setExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState();
  const [examItems, setExamItems] = useState([]);
  const [testNames, setTestNames] = useState([]);
  const [testDates, setTestDates] = useState([]);
  const [selectedClass,setClassName] = useState(className);
  const [selectedSection,setSection] = useState(section);
  const [exams, setExams] = useState([]);

  const tableHead = ["Date", "Subject", "From Time", "To Time", "Total Marks"];
  const widthArr = [90, 90, 70, 70, 70];

  useEffect(() => {
    const fetchExamDataOnLoad = async () => {
      try {
        const response = await fetch(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}.json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data) {
          const names = Object.keys(data);
          setTestNames(names);
          // Select the first test by default if test names are available
          if (names.length > 0) {
            setSelectedExam(names[0]);
          }
        } else {
          setTestNames([]);
          setSelectedExam("");
        }
      } catch (error) {
        console.error("Error fetching test names:", error);
        setTestNames([]);
        setSelectedExam("");
      }
    };

    fetchExamDataOnLoad();
  }, [selectedClass]);

  useEffect(() => {
    const fetchExamDatesOnLoad = async () => {
      if (selectedExam) {
        try {
          const response = await fetch(
            `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}/${selectedExam}.json`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          if (data) {
            setTestDates(Object.keys(data));
          } else {
            setTestDates([]);
          }
        } catch (error) {
          console.error("Error fetching test dates:", error);
          setTestDates([]);
        }
      } else {
        setTestDates([]);
      }
    };

    fetchExamDatesOnLoad();
  }, [selectedClass, selectedExam]);

  useEffect(() => {
    const fetchExamData = async () => {
      if (testDates.length > 0) {
        const examDataArray = [];

        // Loop through each test date
        for (const date of testDates) {
          try {
            const response = await fetch(
              `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}/${selectedExam}/${date}.json`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch exam schedule");
            }
            const examData = await response.json();
            if (examData) {
              examDataArray.push(examData);
            }
          } catch (error) {
            console.error(`Error fetching exam schedule for ${date}:`, error);
          }
        }

        setExams(examDataArray);
      } else {
        setExams([]);
      }
    };

    fetchExamData();
  }, [selectedClass, selectedExam, testDates]);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownRow}>
        {/* Dropdown for selecting exam name */}
        <DropDownPicker
          open={examOpen}
          setOpen={setExamOpen}
          value={selectedExam}
          setValue={setSelectedExam}
          items={testNames.map((test) => ({ label: test, value: test }))}
          setItems={setExamItems}
          placeholder="Select Exam"
          containerStyle={styles.dropdown}
          style={{ backgroundColor: "#fafafa" }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
        />
      </View>

      {/* Display selected Class, Section, and Exam name */}
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionText}>Class: {selectedClass}</Text>
        <Text style={styles.selectionText}>{selectedSection}</Text>
        <Text style={styles.selectionText}>Exam: {selectedExam}</Text>
      </View>

      <ScrollView horizontal={true}>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderColor: "#C10036" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table>
              {exams && exams.length > 0 ? (
                exams.map((exam, rowIndex) => (
                  <Row
                    key={rowIndex}
                    data={[
                      exam.date,
                      exam.subject,
                      exam.fromTime,
                      exam.toTime,
                      exam.maxMarks,
                    ]}
                    widthArr={widthArr}
                    style={{
                      ...styles.row,
                      backgroundColor: rowIndex % 2 === 1 ? "#eff0f2" : "",
                    }}
                    textStyle={styles.cellText}
                  />
                ))
              ) : (
                <Text style={styles.noDataText}>No data available</Text>
              )}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 88,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  dropdownRow: { flexDirection: "row", paddingTop: 10 },
  dropdown: { flex: 1, height: 50, marginHorizontal: 3 },
  tableContainer: { marginTop: 3 },
  header: { height: 40, backgroundColor: "#b8ebe0", borderBottomWidth: 1 },
  text: { textAlign: "center", fontWeight: "900" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  cellText: { textAlign: "center", fontWeight: "500", paddingVertical: 10 },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  selectionText: { fontWeight: "bold" },
  noDataText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default ExamSchedule;