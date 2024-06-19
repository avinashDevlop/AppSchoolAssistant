import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

// Importing all images
import img1 from './blog/2018paplet.jpg';
import img2 from './blog/1000100104.jpg';
import img3 from './blog/1000100105.jpg';
import img4 from './blog/1000100107.jpg';
import img5 from './blog/1000100108.jpg';
import img6 from './blog/1000100109.jpg';
import img7 from './blog/1000100110.jpg';
import img8 from './blog/1000100112.jpg';
import img9 from './blog/1000100113.jpg';
import img10 from './blog/1000100114.jpg';
import img11 from './blog/1000100115.jpg';
import img12 from './blog/1000100117.jpg';
import img13 from './blog/awardTaking.jpg';
import img14 from './blog/planting.jpg';
import img15 from './blog/schoolbig.jpg';

const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15
];

const Gallery = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 210,
    margin: 5,
  },
});

export default Gallery;