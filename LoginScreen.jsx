import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../utils/colors'
import { findUser } from '../utils/db'
import google from "../assets/google.png"
const LoginScreen = () => {
    const [secureEntry, setSecureEntry] = useState(true);
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const handleBack = () => {
        navigation.navigate("HOME");
    }

    const handleLogin = async () => {
        try {
            const user = await findUser(email);
            if (user) {
                if (user.password === pwd) {
                    console.log('Login successful');
                    navigation.navigate('LANDING');
                } else {
                    Alert.alert('Incorrect password');
                }
            } else {
                Alert.alert('User not found');
            }
        } catch (error) {
            console.error("Error fetching details", error);
            Alert.alert("Error occured");
        }
    }

    const handleSignup = () => {
        navigation.navigate("SIGNUP")
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.arrowContainer} >
                <Ionicons
                    name={"arrow-back-outline"}
                    color={colors.primary}
                    size={25} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>Hey, </Text>
                <Text style={styles.titleText}>Welcome </Text>
                <Text style={styles.titleText}>Back! </Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name={"mail-outline"}
                        color={colors.secondary}
                        size={30} />
                    <TextInput
                        style={styles.inputField}
                        placeholder='Enter your email'
                        placeholderTextColor={colors.secondary}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail} />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name={"key-outline"}
                        color={colors.secondary}
                        size={30} />
                    <TextInput
                        secureTextEntry={secureEntry}
                        style={styles.inputField}
                        placeholder='Enter your password'
                        placeholderTextColor={colors.secondary}
                        value={pwd}
                        onChangeText={setPwd} />
                    <TouchableOpacity onPress={() => {
                        setSecureEntry((prev) => !prev)
                    }}>
                        {secureEntry ?
                            <Ionicons
                                name={"eye-outline"}
                                color={colors.secondary}
                                size={20}
                            />
                            :
                            <Ionicons
                                name={"eye-off-outline"}
                                color={colors.secondary}
                                size={20}
                            />}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgetText}>Forget Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.continueText}>or continue with</Text>
                <TouchableOpacity style={styles.googleButton}>
                    <Image source={google} style={styles.googleImage} />
                    <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>
                <Text style={styles.continueText}>Don't have an account?
                    <TouchableOpacity onPress={handleSignup}>
                        <Text style={{ fontWeight: 'bold', marginLeft: 10 }}
                        >Sign up</Text>
                    </TouchableOpacity>
                </Text>


            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20
    },
    arrowContainer: {
        // to make circle pass the half value of height to borderradius
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: colors.gray
    },
    textContainer: {
        marginVertical: 20
    },
    titleText: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primary,
    },
    formContainer: {
        marginTop: 20
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 100,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        padding: 2,
        marginVertical: 15
    },
    inputField: {
        flex: 1,
        paddingHorizontal: 10,
        color:"black"
    },
    forgetText: {
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "right",
        color: colors.primary,
        marginVertical: 10
    },
    loginButton: {
        borderRadius: 100,
        backgroundColor: colors.primary,
        marginTop: 20,
    },
    loginText: {
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
        textAlign: "center"
    },
    continueText: {
        marginVertical: 20,
        textAlign: "center",
        fontSize: 15,
        color: colors.primary
    },
    googleButton: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.primary,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 10,
        gap: 10
    },
    googleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primary,
    },
    googleImage: {
        width: 20,
        height: 20
    }
})