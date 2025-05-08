import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { useNavigation } from '@react-navigation/native'
import Logo from '../assets/Logo.jpeg';

const HomeScreen = () => {
    const navigation = useNavigation();
    const handleLogin = () => {
        navigation.navigate("LOGIN");
    }
    const handleSignup = () => {
        navigation.navigate("SIGNUP");
    }
    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <Image source={require("../assets/Image1.jpg")} style={styles.image1} />
            <Text style={styles.title}>Welcome!!!</Text>
            <Text style={styles.title1}>Nice to hear you back</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.loginButton,
                {
                    backgroundColor: colors.primary,
                }
                ]}
                onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.loginButton]} onPress={handleSignup}>
                    <Text style={styles.signupButtonText}>Sign-up</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title2}>Vivo Professional Services</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center"
    },
    logo: {
        height: 50,
        width: 140,
        marginVertical: 30
    },
    image1: {
        height: 250,
        width: 231,
        marginVertical: 20,
    },
    title: {
        fontSize: 40,
        textAlign: "center",
        color: colors.primary,
        marginTop: 40,
        // fontFamily:"sans serif"
    },
    title1: {
        fontSize: 20,
        textAlign: "center",
        color: colors.secondary,
        marginTop: 10,
    },
    title2: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.secondary,
        marginVertical: 10,
    },
    buttonContainer: {
        height: 60,
        width: "80%",
        flexDirection: "row",
        marginTop: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 100
    },
    loginButton: {
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        borderRadius: 100
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.white
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
})