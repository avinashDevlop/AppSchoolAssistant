import React, { Component } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChats: [],
      searchTerm: "",
      loadingSections: false,
    };
  }

  componentDidMount() {
    const allChatClasses = [
      { id: 0, name: "All Classes", isOnline: true },
      { id: 1, name: "All Teachers", isOnline: true },
      { id: 2, name: "10th Class", isOnline: true },
      { id: 3, name: "9th Class", isOnline: true },
      { id: 4, name: "8th Class", isOnline: false },
      { id: 5, name: "7th Class", isOnline: true },
      { id: 6, name: "6th Class", isOnline: false },
      { id: 7, name: "5th Class", isOnline: true },
      { id: 8, name: "4th Class", isOnline: true },
      { id: 9, name: "3rd Class", isOnline: false },
      { id: 10, name: "2nd Class", isOnline: true },
      { id: 11, name: "1st Class", isOnline: false },
      { id: 12, name: "UKG", isOnline: true },
      { id: 13, name: "LKG", isOnline: false },
      { id: 14, name: "Pre-K", isOnline: true },
    ];
    this.setState({ allChats: allChatClasses });
    this.fetchSections(allChatClasses);
  }

  fetchSections = async (allChatClasses) => {
    try {
      this.setState({ loadingSections: true });
      const updatedChats = [];

      for (const chatClass of allChatClasses) {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/admissionForms/${chatClass.name}.json`
        );
        const data = response.data || {};
        const sections = Object.keys(data);

        for (const section of sections) {
          const timestamp = new Date().toISOString();
          updatedChats.push({
            id: `${chatClass.id}-${section}`,
            name: `${chatClass.name} / ${section}`,
            isOnline: chatClass.isOnline,
            timestamp,
            timeAgo: this.calculateTimeAgo(timestamp),
          });
        }

        if (chatClass.id === 0 || chatClass.id === 1) {
          const timestamp = new Date().toISOString();
          updatedChats.push({
            id: `${chatClass.id}`,
            name: `${chatClass.name}`,
            isOnline: chatClass.isOnline,
            timestamp,
            timeAgo: this.calculateTimeAgo(timestamp),
          });
        }
      }

      this.setState({
        allChats: updatedChats,
        loadingSections: false,
      });
    } catch (error) {
      console.error("Error fetching sections:", error);
      this.setState({ loadingSections: false });
    }
  };

  calculateTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);

    if (isNaN(messageTime.getTime())) {
      console.error("Invalid timestamp:", timestamp);
      return "Invalid date";
    }

    const differenceInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (differenceInMinutes < 1) {
      return "Just now";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;
    } else {
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
      } else {
        const differenceInDays = Math.floor(differenceInHours / 24);
        return `${differenceInDays} days ago`;
      }
    }
  };

  handleSearch = (event) => {
    this.setState({ searchTerm: event.nativeEvent.text });
  };

  handleChatSelect = (chat) => {
    const updatedChats = this.state.allChats.map((item) =>
      item.id === chat.id ? { ...item, active: true } : { ...item, active: false }
    );
    this.setState({ allChats: updatedChats });
    if (this.props.navigation) {
      this.props.navigation.navigate("chatRoom", { selectedChat: chat });
    }
  };

  getFilteredChats = () => {
    const { allChats, searchTerm } = this.state;
    const searchTermLower = searchTerm.toLowerCase();

    const filteredChats = allChats.filter((chat) =>
      chat.name.toLowerCase().includes(searchTermLower)
    );

    const includesAllClasses = filteredChats.some((chat) => chat.name.toLowerCase() === "all classes");
    const includesAllTeachers = filteredChats.some((chat) => chat.name.toLowerCase() === "all teachers");

    if (!includesAllClasses) {
      const allClasses = allChats.find((chat) => chat.name.toLowerCase() === "all classes");
      if (allClasses) {
        filteredChats.unshift(allClasses);
      }
    }

    if (!includesAllTeachers) {
      const allTeachers = allChats.find((chat) => chat.name.toLowerCase() === "all teachers");
      if (allTeachers) {
        filteredChats.unshift(allTeachers);
      }
    }

    return filteredChats;
  };

  render() {
    const { loadingSections } = this.state;
    const filteredChats = this.getFilteredChats();

    return (
      <View style={styles.mainChatList}>
        <View style={styles.chatListSearch}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Here"
            value={this.state.searchTerm}
            onChange={this.handleSearch}
            required
          />
        </View>
        <View style={styles.chatListItems}>
          {loadingSections ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={filteredChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.chatItem, item.active && styles.activeChatItem]}
                  onPress={() => this.handleChatSelect(item)}
                >
                  <View style={styles.iconContainer}>
                    <Icon name="person" size={25} color="#fff" style={styles.icon} />
                  </View>
                  <View style={styles.chatDetails}>
                    <Text style={styles.chatItemText}>{item.name}</Text>
                    <Text style={styles.timestamp}>{item.timeAgo}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainChatList: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  chatListSearch: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  chatListItems: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  activeChatItem: {
    backgroundColor: "#e9f7fe",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    color: "#fff",
  },
  chatDetails: {
    flex: 1,
  },
  chatItemText: {
    fontSize: 16,
    color: "#212529",
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 5,
  },
});

export default ChatList;
