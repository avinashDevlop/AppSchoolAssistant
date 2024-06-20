import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const DriverHome = ({ route }) => {
  const navigation = useNavigation();
  const { name } = route.params || {};

  const updateBusStatus = async (status) => {
    const url = `https://studentassistant-18fdd-default-rtdb.firebaseio.com/accounts/Driver/${name}/Vehicle.json`;
    try {
      await axios.patch(url, { status });
    } catch (error) {
      console.error("Failed to update bus status:", error);
    }
  };

  const handleLogout = () => {
    navigation.navigate("School Assistant");
  };

  const handleStartBus = () => {
    const destination = {
      latitude: 14.16104,
      longitude: 79.37695,
    };
    updateBusStatus("active");
    navigation.navigate("MapScreen", { destination, stopTracking: false, name });
  };

  const handleStopBus = () => {
    updateBusStatus("inactive");
    navigation.navigate("MapScreen", { stopTracking: true, name });
  };

  const features = [
    {
      name: "Start the Bus",
      iconName: "directions-bus",
      color: "green",
      action: handleStartBus,
    },
    {
      name: "End the Bus",
      iconName: "directions-bus",
      color: "red",
      action: handleStopBus,
    },
  ];

  const animationValues = useRef(features.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = features.map((_, index) => {
      return Animated.spring(animationValues[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      });
    });
    Animated.stagger(100, animations).start();
  }, []);

  const FeatureItem = ({ name, iconName, color, action, animationValue }) => (
    <Animated.View style={{ opacity: animationValue, transform: [{ scale: animationValue }] }}>
      <TouchableOpacity
        style={styles.featureItem}
        onPress={action}
      >
        <View style={[styles.button, { backgroundColor: color }]}>
          <Icon name={iconName} size={50} color="#fff" style={styles.icon} />
          <Text style={styles.label}>{name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.adminName}>
          <Icon name="school" size={35} color="#007bff" style={styles.headerIcon} />
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
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              name={feature.name}
              iconName={feature.iconName}
              color={feature.color}
              action={feature.action}
              animationValue={animationValues[index]}
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
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 10,
  },
  headerIcon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  featuresContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  featureItem: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 125,
    width: 250,
    height: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 10,
  },
  label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DriverHome;