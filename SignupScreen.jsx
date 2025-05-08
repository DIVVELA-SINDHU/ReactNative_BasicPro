import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../utils/colors'
import { insertUser } from '../utils/db'
import google from "../assets/google.png"
const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pwd, setPwd] = useState("");
    const [secureEntry, setSecureEntry] = useState(true);
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.navigate("HOME");
    }

    const handleLogin = () => {
        navigation.navigate("LOGIN")
    }

    const handleSignup = async () => {
        try {
            console.log(email,phone,pwd);
            const result = await insertUser(email, phone, pwd);
            console.log(result);
            console.log("User Signed up");
            Alert.alert("User Signed up Successfully!");
            navigation.navigate("LOGIN");
        } catch (error) {
            console.log("Error inserting data", error);
            Alert.alert("Error signing up, Please try again");
        }
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
                <Text style={styles.titleText}>Let's get </Text>
                <Text style={styles.titleText}>started </Text>
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
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name={"phone-portrait-outline"}
                        color={colors.secondary}
                        size={30} />
                    <TextInput
                        style={styles.inputField}
                        placeholder='Enter your phone number'
                        placeholderTextColor={colors.secondary}
                        keyboardType='phone-pad'
                        value={phone}
                        onChangeText={setPhone}
                    />
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
                        onChangeText={setPwd}
                    />
                    {/* <Ionicons
                        name={"eye-outline"}
                        color={colors.secondary}
                        size={20}
                        onPress={setSecureEntry(!secureEntry)} /> */}
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
                <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
                    <Text style={styles.loginText}>Sign up</Text>
                </TouchableOpacity>
                <Text style={styles.continueText}>or continue with</Text>
                <TouchableOpacity style={styles.googleButton}>
                    <Image source={google} style={styles.googleImage} />
                    <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>
                <Text style={styles.continueText}>Already have an account?
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Login</Text>
                    </TouchableOpacity>
                </Text>


            </View>
        </View>
    )
}

export default SignupScreen

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
        color:colors.primary
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