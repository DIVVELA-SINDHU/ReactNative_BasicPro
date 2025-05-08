import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { fetchUsers } from '../utils/db';

const ShowUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                if (data === null) {
                    setUsers([]);
                    Alert.alert("No users found");
                } else {
                    console.log(data);
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
                Alert.alert("An error occurred while fetching users.");
            }
        };

        getUsers();
    }, []);

    return (
        // <ScrollView style={styles.container}>
        <>
    <Text style={styles.header}>User List</Text>
    <View style={styles.tableHeader}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Phone</Text>
    </View>

    {users.length === 0 ? (
        <Text style={styles.noDataText}>No users to display.</Text>
    ) : users.length > 5 ? (
        <ScrollView>
            {users.map((user) => (
                <View key={user.id} style={styles.tableRow}>
                    <Text style={styles.rowText}>{user.id}</Text>
                    <Text style={styles.rowText}>{user.email}</Text>
                    <Text style={styles.rowText}>{user.phone}</Text>
                </View>
            ))}
        </ScrollView>
    ) : (
        users.map((user) => (
            <View key={user.id} style={styles.tableRow}>
                <Text style={styles.rowText}>{user.id}</Text>
                <Text style={styles.rowText}>{user.email}</Text>
                <Text style={styles.rowText}>{user.phone}</Text>
            </View>
        ))
    )}
</>

        // </ScrollView>
    );
};

export default ShowUsers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        width: "100%",
        height:120
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#4F8EF7',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    headerText: {
        flex: 1,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    rowText: {
        flex: 1,
        textAlign: 'center',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        color: 'gray',
    },
});
