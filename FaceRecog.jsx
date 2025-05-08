import React, { useState, useEffect } from 'react';
import {
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TFLite from 'tflite-react-native-alternative'; // Updated import
import { Buffer } from 'buffer';

const FaceRecog = () => {
    const [image, setImage] = useState(null);
    const [model, setModel] = useState(null);

    const loadModel = () => {
        const tflite = new TFLite();
        tflite.loadModel({
            model: require('../model/model_unquant.tflite'),
            labels: require('../model/labels.txt'),
        }, (error) => {
            if (error) {
                console.error('Model loading error:', error);
            } else {
                console.log('Model loaded successfully');
                setModel(tflite);
            }
        });
    };

    useEffect(() => {
        loadModel();
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs Camera Permission',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log(err);
                return false;
            }
        } else {
            return true;
        }
    };

    const camera = async () => {
        const options = { mediaType: 'photo', maxWidth: 300, maxHeight: 550 };
        const isCameraPermitted = await requestCameraPermission();
        if (isCameraPermitted || Platform.Version > 13) {
            launchCamera(options, response => {
                if (response.errorCode) {
                    alert(response.errorMessage);
                } else {
                    setImage(response.assets[0]);
                }
            });
        }
    };

    const selectFromGallery = () => {
        const options = { mediaType: 'photo', maxWidth: 300, maxHeight: 550 };
        launchImageLibrary(options, response => {
            if (response.errorCode) {
                alert(response.errorMessage);
            } else {
                setImage(response.assets[0]);
            }
        });
    };

    const validateImage = () => {
        if (image && model) {
            model.runModelOnImage({
                path: image.uri,
                imageMean: 127.5,
                imageStd: 127.5,
                numResults: 3,
                threshold: 0.1,
            }, (error, results) => {
                if (error) {
                    console.error('Model inference error:', error);
                    Alert.alert('Error', 'Failed to process image.');
                } else {
                    console.log(results);
                    Alert.alert('Results', JSON.stringify(results));
                }
            });
        } else {
            Alert.alert('Error', 'No image or model to validate!');
        }
    };

    return (
        <View style={styles.container}>
            {image && (
                <>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <TouchableOpacity style={styles.uploadButton} onPress={validateImage}>
                        <Text style={styles.buttonText}>Validate</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.cameraButton} onPress={camera}>
                <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={selectFromGallery}>
                <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        width: 250,
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    cameraButton: {
        width: 250,
        height: 50,
        backgroundColor: '#2196F3',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    galleryButton: {
        width: 250,
        height: 50,
        backgroundColor: '#FF9800',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
    },
});

export default FaceRecog;



// import React, { useState, useEffect } from 'react';
// import {
//     PermissionsAndroid,
//     Platform,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     Alert,
//     Image,
// } from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import { fetch as tfFetch, decodeJpeg } from '@tensorflow/tfjs-react-native';

// const FaceRecog = () => {
//     const [image, setImage] = useState(null);
//     const [model, setModel] = useState(null);

//     const loadModel = async () => {
//         await tf.ready();
//         const modelUrl = 'https://teachablemachine.withgoogle.com/models/ddhvFIUdK/model.json';
//         const loadedModel = await tf.loadGraphModel(modelUrl);
//         setModel(loadedModel);
//     };

//     useEffect(() => {
//         loadModel();
//     }, []);

//     const requestCameraPermission = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.CAMERA,
//                     {
//                         title: 'Camera Permission',
//                         message: 'App needs Camera Permission',
//                     }
//                 );
//                 return granted === PermissionsAndroid.RESULTS.GRANTED;
//             } catch (err) {
//                 console.log(err);
//                 return false;
//             }
//         } else {
//             return true;
//         }
//     };

//     const camera = async () => {
//         const options = { mediaType: 'photo', maxWidth: 300, maxHeight: 550 };
//         const isCameraPermitted = await requestCameraPermission();
//         if (isCameraPermitted || Platform.Version > 13) {
//             launchCamera(options, response => {
//                 if (response.errorCode) {
//                     alert(response.errorMessage);
//                 } else {
//                     setImage(response.assets[0]);
//                 }
//             });
//         }
//     };

//     const selectFromGallery = () => {
//         const options = { mediaType: 'photo', maxWidth: 300, maxHeight: 550 };
//         launchImageLibrary(options, response => {
//             if (response.errorCode) {
//                 alert(response.errorMessage);
//             } else {
//                 setImage(response.assets[0]);
//             }
//         });
//     };

//     const validateImage = async () => {
//         console.log(image);
//         console.log(model);
//         if (image && model) {
//             try {
//                 const uri = image.uri;
//                 const response = await fetch(uri);
//                 const blob = await response.blob();
//                 const arrayBuffer = await blob.arrayBuffer();
//                 const imageTensor = decodeJpeg(new Uint8Array(arrayBuffer));

//                 const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
//                 const normalizedImage = resizedImage.div(255.0).expandDims(0);

//                 const prediction = await model.predict(normalizedImage);
//                 const result = prediction.dataSync();

//                 Alert.alert('Result', `Prediction: ${result}`);
//             } catch (error) {
//                 console.log('Error:', error);
//             }
//         } else {
//             Alert.alert('Error', 'No image or model to validate!');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {image && (
//                 <>
//                     <Image source={{ uri: image.uri }} style={styles.image} />
//                     <TouchableOpacity style={styles.uploadButton} onPress={validateImage}>
//                         <Text style={styles.buttonText}>Validate</Text>
//                     </TouchableOpacity>
//                 </>
//             )}

//             <TouchableOpacity style={styles.cameraButton} onPress={camera}>
//                 <Text style={styles.buttonText}>Open Camera</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.galleryButton} onPress={selectFromGallery}>
//                 <Text style={styles.buttonText}>Open Gallery</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     uploadButton: {
//         width: 250,
//         height: 50,
//         backgroundColor: '#4CAF50',
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     cameraButton: {
//         width: 250,
//         height: 50,
//         backgroundColor: '#2196F3',
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     galleryButton: {
//         width: 250,
//         height: 50,
//         backgroundColor: '#FF9800',
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     image: {
//         width: 300,
//         height: 300,
//         borderRadius: 10,
//         marginVertical: 10,
//     },
// });

// export default FaceRecog;
