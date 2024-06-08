import React,{useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const StudentAndTeacherHome = ({ navigation, route }) => {
  const { name, selectedClass, selectedSection, gender,surname } = route.params;
  const studentDetails = {...route.params};
   const [fullName, setFullName] = useState(`${surname} ${name}`);
   const [name1, setname1] = useState(`${name}`);
   const [section,setSection] = useState("");
 
//  console.log(fullName)
  const handleLogout = () => {
    navigation.navigate("School Assistant"); 
  };
  const features = [
    {
      destination: "StudentAttendance",
      name: "Attendance",
      iconName: "event-note",
    },
    { destination: "StudentHomeWork", name: "Home Work", iconName: "assignment" },
    { destination: "StudentExamSchedule", name: "Exam Schedule", iconName: "event" },
    { destination: "Student Exam Result", name: "Exam Result", iconName: "school" },
    { destination: "StudentTimeTable", name: "Time Table", iconName: "schedule" },
    {
      destination: "Student Profile",
      name: "Student Profile",
      iconName: "people",
    },
    {
      destination: "StudentChat",
      name: "Chat",
      iconName: "chat",
    },
    { destination: "AdminGallery", name: "Gallery", iconName: "photo-library" },
    {
      destination: "TrackStudBus",
      name: "Bus Tracking",
      iconName: "directions-bus",
    },
    {
      destination: "Notice",
      name: "Notice",
      iconName: "announcement",
    },
  ];

  const FeatureItem = ({ destination, name, iconName }) => {
    const handleFeaturePress = () => {
      if (destination === "StudentAttendance" ) {
        if(selectedSection === 'Section A'){
          setSection('A')
        }else if(selectedSection === 'Section B'){
          setSection('B')
        }else{
          setSection('C')
        }
        const studentData = {
          className: selectedClass,
          section: section,
          name: fullName,
          gender: gender,
        };
        navigation.navigate(destination, studentData);
      }else if(destination === 'StudentHomeWork' || destination === 'StudentExamSchedule' || destination==='StudentTimeTable' || destination === 'StudentChat'){
        const studentData = {
          className: selectedClass,
          section: selectedSection,
        };
        navigation.navigate(destination, studentData);
      }else if (destination === "Student Exam Result" ) {
        const studentData = {
          selectedClass,
          selectedSection:selectedSection,
          studentName: name1,
          gender: gender,
        };
        navigation.navigate(destination, studentData);
      }else if(destination === 'Student Profile'){
        let index =1;
        navigation.navigate(destination, studentDetails,index);
      }else if(destination === 'TrackStudBus'){
        const studentData = {
          className:selectedClass,
          sectionName:selectedSection,
          studentName: fullName,
        };
        navigation.navigate(destination, studentData);
      }
      else{
        // Navigate to other screens without additional data
        navigation.navigate(destination);
      }
    };
  
    return (
      <TouchableOpacity
        style={styles.featureItem}
        onPress={handleFeaturePress}
      >
        <Icon name={iconName} size={60} color="#007bff" />
        <Text style={styles.featureName}>{name}</Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.adminName}>
          <Icon name="people-outline" size={35} color="#007bff" style={styles.icon} />
          <Text style={styles.title}>{name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButtonTitle}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.featuresContainer}>
          {features.map((feature,_key) => (
            <FeatureItem
              key={feature.destination}
              destination={feature.destination}
              name={feature.name}
              iconName={feature.iconName}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 16,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 10,
  },
  adminName: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Adjust this to control spacing between features
    width: "100%",
  },
  featureItem: {
    alignItems: "center",
    marginBottom: 20,
    width: "48%",
  },
  featureName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    margin: "9%",
  },
});

export default StudentAndTeacherHome;
