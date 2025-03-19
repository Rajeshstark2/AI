import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';

const SetupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [wakeWord, setWakeWord] = useState('Jarvis');
  const [isListening, setIsListening] = useState(false);

  const startVoiceRecognition = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop voice recognition');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        wakeWord: wakeWord.trim(),
        preferences: {
          voiceEnabled: true,
          offlineMode: true,
        },
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      navigation.replace('MainApp');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AI Assistant</Text>
      <Text style={styles.subtitle}>Let's set up your personal assistant</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Wake Word</Text>
        <TextInput
          style={styles.input}
          value={wakeWord}
          onChangeText={setWakeWord}
          placeholder="Enter wake word (e.g., Jarvis)"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive]}
        onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Stop Listening' : 'Test Voice Recognition'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetupScreen; 