import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import SplashScreen from './Screens/SplashScreen';
import HomeScreen from "./Screens/HomeScreen";
import AdminLogin from "./Screens/Admin/AdminLogin";
import TeacherLogin from "./Screens/Teacher/TeacherLogin";
import StudentAndParentLogin from "./Screens/StudentAndParent/StudentAndParentLogin";
import DriverLogin from "./Screens/Driver/DriverLogin";
import DriverHome from "./Screens/Driver/DriverHome";
import AdminHome from "./Screens/Admin/AdminHome";
import TeacherHome from "./Screens/Teacher/TeacherHome";
import StudentAndParentHome from "./Screens/StudentAndParent/StudentAndParentHome";
import AdminAttendence from "./Screens/Admin/Attendence/AdminAttendence";
import ClassWiseAttendence from "./Screens/Admin/Attendence/ClassWiseAttendence";
import StudentAttendance from "./Screens/Admin/Attendence/StudentAttendance";
import AdminHomeWork from "./Screens/Admin/HomeWork/Homework";
import AdminExamResult from "./Screens/Admin/ExamResult/ExamResult";
import StudentExamResult from "./Screens/Admin/ExamResult/StudentExamResult";
import AdminTimeTable from "./Screens/Admin/TimeTable/AdminTimetable";
import AdminAllStudentDetails from "./Screens/Admin/StudentDetails/AllStudentDetails";
import AdminStudentProfile from "./Screens/Admin/StudentDetails/StudentProfile";
import TeacherAttendance from './Screens/Teacher/Attendance/TeacherAttendance';
import ExamSchedule from "./Screens/Admin/ExamSchedule/ExamSchedule";
import TeacherHomework from "./Screens/Teacher/HomeWork/Homework";
import TeacherAddMarks from './Screens/Teacher/ExamResults/AddMarks';
import TeacherStudentDetails from "./Screens/StudentAndParent/studentDeatails/studentDeatails";
import StudentHomeWork from "./Screens/StudentAndParent/HomeWork/HomeWork";
import StudentExamSchedule from "./Screens/StudentAndParent/ExamSchedule/ExamSchedule";
import StudentTimeTable from "./Screens/StudentAndParent/TimeTable/studTimeTable";
import AdminGallery from './Screens/Admin/gallery/Gallery';
import AdminNotice from "./Screens/Admin/Notice/Notice";
import Notice from "./Screens/Teacher/Notice/Notice";
import chatList from './Screens/Admin/Messages/chatList/chatList';
import chatRoom from './Screens/Admin/Messages/chatRoom';
import TeacherChat from './Screens/Teacher/Message/TeacherChat';
import StudentChat from './Screens/StudentAndParent/Message/StudentChat';
import Transport from './Screens/Admin/Transport/Transport';
import MapScreen from './Screens/Driver/mapScreen';
import TrackStudBus from "./Screens/StudentAndParent/Transport/TrackStudBus";
import adminTransport from "./Screens/Admin/Transport/adminTransport";
import * as Updates from 'expo-updates';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error(e);
      }
    }
  
    checkForUpdates();
  }, []);
  
  return (
    <>
     <StatusBar
        barStyle="light-content"
        backgroundColor="#455756"
      />
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="School Assistant" component={HomeScreen} />
        <Stack.Screen name="Admin Login" component={AdminLogin} />
        <Stack.Screen name="Teacher Login" component={TeacherLogin} />
        <Stack.Screen
          name="Student & Parent Login"
          component={StudentAndParentLogin}
        />
        <Stack.Screen name="Driver Login" component={DriverLogin} />
        <Stack.Screen
          name="Admin Home"
          component={AdminHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Teacher Home"
          component={TeacherHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Student & Parent Home"
          component={StudentAndParentHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Driver Home"
          component={DriverHome}
          options={{ headerShown: false }}
        />
        {/* admin property */}
        <Stack.Screen
          name="Attendence"
          component={AdminAttendence}
        />
        <Stack.Screen
          name="Class Wise Attendance"
          component={ClassWiseAttendence}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendance}
          options={{ title: "Student Attendance" }}
        />
        <Stack.Screen
          name="Home Work"
          component={AdminHomeWork}
        />
        <Stack.Screen
          name="AdminExamSchedule"
          component={ExamSchedule}
          options={{ title: "Exam Schedule" }}
        />
        <Stack.Screen
          name="Exam Result"
          component={AdminExamResult}
        />
        <Stack.Screen
          name="Student Exam Result"
          component={StudentExamResult}
        />
        <Stack.Screen
          name="Student Time Table"
          component={AdminTimeTable}
        />
        <Stack.Screen
          name="Student Details"
          component={AdminAllStudentDetails}
        />
        <Stack.Screen
          name="Student Profile"
          component={AdminStudentProfile}
        />
        <Stack.Screen
          name="AdminGallery"
          component={AdminGallery}
          options={{ title: "Gallery" }}
        />
        <Stack.Screen
          name="adminNotice"
          component={AdminNotice}
          options={{ title: "Notice" }}
        />
        {/* teacher propertys */}
        <Stack.Screen
          name="TeacherAttendance"
          component={TeacherAttendance}
          options={{ title: "Attendance" }}
        />
        <Stack.Screen
          name="TeacherHomework"
          component={TeacherHomework}
          options={{ title: "HomeWork" }}
        />
        <Stack.Screen
          name="TeacherAddMarks"
          component={TeacherAddMarks}
          options={{ title: "Add Marks" }}
        />
        <Stack.Screen
          name="TeacherStudentDetails"
          component={TeacherStudentDetails}
          options={{ title: "Student Details" }}
        />
        <Stack.Screen
          name="StudentHomeWork"
          component={StudentHomeWork}
          options={{ title: "Home Work" }}
        />
        <Stack.Screen
          name="StudentExamSchedule"
          component={StudentExamSchedule}
          options={{ title: "Exam Schedule" }}
        />
        <Stack.Screen
          name="StudentTimeTable"
          component={StudentTimeTable}
          options={{ title: "Student TimeTable" }}
        />
        <Stack.Screen
          name="chatList"
          component={chatList}
          options={{ title: "All Chats" }}
        />
        <Stack.Screen
          name="chatRoom"
          component={chatRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeacherChat"
          component={TeacherChat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentChat"
          component={StudentChat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notice"
          component={Notice}
          options={{ title: "Notice" }}
        />
        <Stack.Screen
          name="Transport"
          component={Transport}
          options={{ title: "Transport" }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Bus Tracking" }}
        />
        <Stack.Screen
          name="TrackStudBus"
          component={TrackStudBus}
          options={{ title: "Bus Tracking" }}
        />
        <Stack.Screen
          name="adminTransport"
          component={adminTransport}
          options={{ title: "Driver Bus Tracking" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}