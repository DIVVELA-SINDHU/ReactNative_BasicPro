import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const openDatabase = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'images.db', location: 'default' });
    console.log('Database opened successfully');
    return db;
  } catch (error) {
    console.log('Error opening database:', error);
  }
};

const PhotoScreen = () => {
  const [image, setImage] = useState(null);
  const [storedImages, setStoredImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    openDatabase().then(database => {
      db = database;
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS Images', []);
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image BLOB,
            hash TEXT
          )`,
          [],
          () => console.log('Table created successfully'),
          error => console.log('Error creating table:', error)
        );
      });

      fetchImages();
    });

    return () => {
      if (db) {
        db.close().then(() => console.log('Database closed.'));
      }
    };
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
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
    };
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted || Platform.Version > 13) {
      launchCamera(options, response => {
        if (response.errorCode) {
          alert(response.errorMessage);
        } else {
          setImage(response?.assets[0]);
        }
      });
    }
  };

  const selectFromGallery = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        alert(response.errorMessage);
      } else {
        setImage(response?.assets[0]);
      }
    });
  };

  const uploadImage = async () => {
    if (image) {
      try {
        const base64Image = await RNFS.readFile(image.uri, 'base64');

        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO Images (image, hash) VALUES (?, ?)',
            [image.uri, base64Image],
            () => {
              Alert.alert('Success', 'Image saved to SQLite!');
              fetchImages();
            },
            error => {
              console.log('Insert Error:', error);
              Alert.alert('Error', 'Failed to save image');
            }
          );
        });
      } catch (error) {
        console.log('Error converting image to Base64:', error);
      }
    } else {
      Alert.alert('Error', 'No image to upload!');
    }
  };

  const validateImage = async () => {
    if (image) {
      try {
        const newBase64 = await RNFS.readFile(image.uri, 'base64');

        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Images',
            [],
            (tx, results) => {
              const rows = results.rows;
              let matched = false;
              for (let i = 0; i < rows.length; i++) {
                const storedImage = rows.item(i);
                if (storedImage.hash === newBase64) {
                  matched = true;
                  break;
                }
              }
              if (matched) {
                Alert.alert('Match Found!', 'This image matches a stored image.');
              } else {
                Alert.alert('No Match', 'No matching image found.');
              }
            },
            error => console.log('Error fetching images:', error)
          );
        });
      } catch (error) {
        console.log('Error reading image:', error);
      }
    } else {
      Alert.alert('Error', 'No image to validate!');
    }
  };

  const fetchImages = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Images',
        [],
        (tx, results) => {
          const rows = results.rows;
          let images = [];
          for (let i = 0; i < rows.length; i++) {
            images.push(rows.item(i));
          }
          setStoredImages(images);
        },
        error => console.log('Error fetching images:', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
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

      <TouchableOpacity style={styles.showModalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Show Photos</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Stored Images</Text>
          <FlatList
            data={storedImages}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.modalImage} />
            )}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  showModalButton: {
    width: 250,
    height: 50,
    backgroundColor: '#FF5722',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  closeModalButton: {
    width: 200,
    height: 50,
    backgroundColor: '#9C27B0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: "center",
  },
});

export default PhotoScreen;
