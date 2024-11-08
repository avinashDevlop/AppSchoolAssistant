import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from 'axios';

const ChatContent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { selectedChat } = route.params;
  const chatName = selectedChat ? selectedChat.name : '';

  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://studentassistant-18fdd-default-rtdb.firebaseio.com/chats/${chatName}.json`
        );
        const fetchedMessages = response.data ? Object.values(response.data) : [];
        
        // Sort messages by timestamp
        fetchedMessages.sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
        
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMessages();
  }, [chatName]);
  
  const calculateTimeAgo = (timestamp) => {
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

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    setIsSending(true);
    const isoTimestamp = new Date().toISOString(); // ISO string timestamp
    const date = new Date(isoTimestamp);
    
    // Format the date and time
    const firebaseKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')},${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`; 
    const newMessage = {
      msg: inputText,
      timestamp: isoTimestamp,
      sender: 'me', // Assuming the sender is the user
    };

    try {
      await axios.put(
        `https://studentassistant-18fdd-default-rtdb.firebaseio.com/chats/${selectedChat.name}/${firebaseKey}.json`,
        newMessage
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{chatName}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageList}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageItem,
                //   message.sender === 'me' ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <View style={styles.messageIconContainer}>
                  <Ionicons name="person-circle-outline" size={25} color="#fff" style={styles.messageIcon} />
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>{message.msg}</Text>
                  <Text style={styles.messageTimestamp}>{calculateTimeAgo(message.timestamp)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.sendingButton]}
              onPress={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // paddingTop: 40, // Adjust for header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end', // Align all messages to the right side
    backgroundColor: '#e1ffc7', // Color for user's messages
    maxWidth: '80%', 
  },  
//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#e1ffc7',
//   },
//   otherMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#f1f1f1',
//   },
  messageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageIcon: {
    color: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#212529',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderColor: '#ced4da',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',  
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendingButton: {
    backgroundColor: '#6c757d', 
  },
});

export default ChatContent;