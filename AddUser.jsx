import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { insertUser } from '../utils/db';
import { colors } from '../utils/colors';


const AddUser = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAddUser = async () => {
    if (!email || !phone || !password || !confirmPassword) {
      Alert.alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    try {
      const result = await insertUser(email, phone, password);
      if (result.insertId) {
        Alert.alert("User added successfully!");
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert("Failed to add user.");
      }
    } catch (error) {
      console.error("Error inserting user:", error);
      Alert.alert("An error occurred while adding the user.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New User</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.primary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor={colors.primary}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.primary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.primary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    color:"black"
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: "flex-end",
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
