import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { deleteUser, findUser } from '../utils/db';
import { colors } from '../utils/colors';


const DeleteUser = () => {
  const [email, setEmail] = useState('');

  const handleDelete = async () => {
    if (!email) {
      Alert.alert("Please enter an email address.");
      return;
    }

    try {
      const user = await findUser(email);
      if (!user) {
        Alert.alert("User not found!");
        return;
      }

      const isDeleted = await deleteUser(email);
      if (isDeleted) {
        Alert.alert("User deleted successfully!");
        setEmail('');
      } else {
        Alert.alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("An error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Delete User</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User Email"
        placeholderTextColor={colors.primary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteUser;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
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
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignSelf:"flex-end"
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
