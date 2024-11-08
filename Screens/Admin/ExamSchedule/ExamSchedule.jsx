import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from "react-native";
import { Table, Row } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const ExamSchedule = () => {
  const navigation = useNavigation();

  const [classOpen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("10th Class");
  const [classItems, setClassItems] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  const [sectionOpen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState();
  const [sectionItems, setSectionItems] = useState([]);

  const [examOpen, setExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState("Term-1");
  const [testNames, setTestNames] = useState([]);
  const [testDates, setTestDates] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const tableHead = ["Date", "Subject", "From Time", "To Time", "Total Marks"];
  const widthArr = [90, 90, 70, 70, 70];

  // Fetching Class Options
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms.json"
        );
        const data = response.data;
        const options = data
          ? Object.keys(data).map((key) => ({ value: key, label: key }))
          : [];
        setClassItems(options);
      } catch (error) {
        console.error("Error fetching class options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassOptions();
  }, []);

  // Fetching Section Options based on Selected Class
  useEffect(() => {
    const fetchSectionOptions = async () => {
      if (!selectedClass) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${selectedClass}.json`
        );
        const data = response.data;
        const sections = data
          ? Object.keys(data).map((section) => ({ label: section, value: section }))
          : [];
        setSectionItems(sections);
        setSelectedSection(sections[0]?.value || "");
      } catch (error) {
        console.error("Error fetching section options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSectionOptions();
  }, [selectedClass]);

  // Fetching Exam Names based on Selected Class
  useEffect(() => {
    const fetchExamNames = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}.json`
        );
        const data = response.data;
        const allowedTestNames = [
          "Class Test",
          "FORMATIVE ASSESSMENT - I",
          "FORMATIVE ASSESSMENT - II",
          "SUMMATIVE ASSESSMENT - I",
          "FORMATIVE ASSESSMENT - III",
          "FORMATIVE ASSESSMENT - IV",
          "SUMMATIVE ASSESSMENT - II",
          "SUMMATIVE ASSESSMENT - III",
        ];
        const names = data
          ? Object.keys(data).filter((name) => allowedTestNames.includes(name))
          : [];
        setTestNames(names);
        setSelectedExam(names[0] || "");
      } catch (error) {
        console.error("Error fetching test names:", error);
      }
    };
    fetchExamNames();
  }, [selectedClass]);

  // Fetching Exam Dates based on Selected Exam
  useEffect(() => {
    const fetchExamDates = async () => {
      if (!selectedExam) return;
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}/${selectedExam}.json`
        );
        const data = response.data;
        setTestDates(data ? Object.keys(data) : []);
      } catch (error) {
        console.error("Error fetching exam dates:", error);
      }
    };
    fetchExamDates();
  }, [selectedExam]);

  // Fetching Exam Schedule for Each Date
  useEffect(() => {
    const fetchExamSchedule = async () => {
      if (testDates.length === 0) return;
      const examDataArray = [];
      try {
        for (const date of testDates) {
          const response = await axios.get(
            `https://studentassistant-18fdd-default-rtdb.firebaseio.com/ExamSchedule/${selectedClass}/${selectedExam}/${date}.json`
          );
          examDataArray.push(response.data);
        }
        setExams(examDataArray);
      } catch (error) {
        console.error("Error fetching exam schedule:", error);
      }
    };
    fetchExamSchedule();
  }, [testDates]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#C10036" />
      ) : (
        <>
          <View style={styles.dropdownRow}>
            <DropDownPicker
              open={classOpen}
              setOpen={setClassOpen}
              value={selectedClass}
              setValue={setSelectedClass}
              items={classItems}
              placeholder="Select Class"
              containerStyle={styles.dropdown}
              style={{ backgroundColor: "#fafafa" }}
            />
            <DropDownPicker
              open={sectionOpen}
              setOpen={setSectionOpen}
              value={selectedSection}
              setValue={setSelectedSection}
              items={sectionItems}
              placeholder="Select Section"
              containerStyle={styles.dropdown}
              style={{ backgroundColor: "#fafafa" }}
            />
            <DropDownPicker
              open={examOpen}
              setOpen={setExamOpen}
              value={selectedExam}
              setValue={setSelectedExam}
              items={testNames.map((test) => ({ label: test, value: test }))}
              placeholder="Select Exam"
              containerStyle={styles.dropdown}
              style={{ backgroundColor: "#fafafa" }}
            />
          </View>

          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <Table borderStyle={{ borderColor: "#C10036" }}>
                <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table>
                  {exams.length > 0 ? (
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
                        style={{ ...styles.row, backgroundColor: rowIndex % 2 ? "#eff0f2" : "" }}
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  dropdownRow: { flexDirection: "row", paddingVertical: 10 },
  dropdown: { flex: 1, height: 50, marginHorizontal: 3 },
  tableContainer: { marginTop: 3 },
  header: { height: 40, backgroundColor: "#b8ebe0", borderBottomWidth: 1 },
  text: { textAlign: "center", fontWeight: "900" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50 },
  cellText: { textAlign: "center", fontWeight: "500", paddingVertical: 10 },
  noDataText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default ExamSchedule;
