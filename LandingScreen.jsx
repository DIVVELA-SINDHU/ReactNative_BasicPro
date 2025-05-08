import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../utils/colors'
import AddUser from './AddUser';
import ShowUsers from './ShowUsers';
import DeleteUser from './DeleteUser';

const LandingScreen = () => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [showJoke, setShowJoke] = useState(false);
    const [modalContent, setModalContent] = useState("showUsers");
    const [joke, setJoke] = useState(null);
    const handleExit = () => {
        navigation.navigate("HOME");
    }

    const closeModal = () => {
        setShowModal(!showModal);
        setModalContent("showUsers");
    }

    const getJoke = async () => {
        try {
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            const data = await response.json();
            setJoke(data);
        } catch (error) {
            console.error('Error fetching joke:', error);
            Alert.alert("Failed to fetch joke!");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.loginButton} onPress={handleExit}>
                <Text style={styles.loginText}>Logout
                </Text>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <TouchableOpacity style={styles.usersButton} onPress={() => setShowModal(!showModal)}>
                    <Text style={styles.usersText}>Manage Users</Text>
                </TouchableOpacity>
                <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={false}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity style={modalContent === 'showUsers' && styles.tabButton} onPress={() => setModalContent("showUsers")}>
                                <Text style={styles.tabText}>Show Users</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modalContent === 'addUser' && styles.tabButton} onPress={() => setModalContent("addUser")}>
                                <Text style={styles.tabText}>Add User</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modalContent === 'deleteUser' && styles.tabButton} onPress={() => setModalContent("deleteUser")}>
                                <Text style={styles.tabText}>Delete User</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            {modalContent === "addUser" && <AddUser />}
                            {modalContent === "deleteUser" && <DeleteUser />}
                            {modalContent === "showUsers" && <ShowUsers />}
                        </View>
                        <TouchableOpacity style={styles.loginButton} onPress={closeModal}>
                            <Text style={styles.loginText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TouchableOpacity style={styles.usersButton} onPress={() => { setShowJoke(!showJoke); getJoke(); }}>
                    <Text style={styles.usersText}>
                        {' '}
                        {showJoke ? 'Hide Joke' : 'Give Joke'}
                    </Text>
                </TouchableOpacity>
                {showJoke && joke && (
                    <View style={styles.jokeBox}>
                        <Text style={styles.setupText}>{joke.setup}</Text>
                        <Text style={styles.punchlineText}>{joke.punchline}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.usersButton} onPress={()=>{navigation.navigate("PHOTOS")}}>
                    <Text style={styles.usersText}>Photos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.usersButton} onPress={()=>{navigation.navigate("FaceRecog")}}>
                    <Text style={styles.usersText}>Face Recognition</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
    },
    textContainer: {
        marginVertical: 20,
    },
    loginButton: {
        borderRadius: 100,
        backgroundColor: colors.secondary,
        marginTop: 20,
        alignSelf: 'flex-end',
    },
    loginText: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
    },
    usersButton: {
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '15%',
        borderRadius: 100,
        marginTop: 20,
    },
    usersText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 10
    },
    modalBody: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20
    },
    tabText: {
        fontSize: 15,
        color: colors.primary
    },
    tabButton: {
        borderBottomWidth: 2,
        borderColor: "black",
        paddingVertical: 5
    },
    jokeBox: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginTop: 10,
        width: '90%',
        alignItems: 'center',
    },
    setupText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    punchlineText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#333',
    },
});