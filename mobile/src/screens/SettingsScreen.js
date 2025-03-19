import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    offlineMode: true,
    notifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const data = JSON.parse(userData);
        setSettings(data.preferences || settings);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
    }
  };

  const saveSettings = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const data = JSON.parse(userData);
        data.preferences = settings;
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        Alert.alert('Success', 'Settings saved successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Voice Recognition</Text>
          <Switch
            value={settings.voiceEnabled}
            onValueChange={() => toggleSetting('voiceEnabled')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Offline Mode</Text>
          <Switch
            value={settings.offlineMode}
            onValueChange={() => toggleSetting('offlineMode')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 