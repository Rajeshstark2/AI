import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const HomeScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadUserData();
    setupVoiceRecognition();
    setupNetworkListener();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const setupVoiceRecognition = () => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });
    return () => unsubscribe();
  };

  const onSpeechResults = async (e) => {
    const text = e.value[0];
    if (text.toLowerCase().includes(userData?.wakeWord.toLowerCase())) {
      await startListening();
    } else {
      handleUserInput(text);
    }
  };

  const onSpeechError = (e) => {
    console.error(e);
    setIsListening(false);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop voice recognition');
    }
  };

  const handleUserInput = async (text) => {
    if (!isOnline) {
      Alert.alert(
        'No Internet Connection',
        'Would you like to enable mobile data?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Enable',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    try {
      const response = await axios.post('http://your-api-url/api/chat', {
        message: text,
        user_id: userData?.name,
      });

      const aiResponse = response.data.response;
      setMessages(prev => [...prev, { text, isUser: true }, { text: aiResponse, isUser: false }]);
      Tts.speak(aiResponse);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isListening && styles.buttonActive]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  controls: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 