import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Gallery = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Add more images as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  // riya kodali  
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default Gallery;