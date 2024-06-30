import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const StarRating = ({ rating, onRate, starStyle }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <View style={styles.container}>
            {stars.map((star) => (
                <TouchableOpacity key={star} onPress={() => onRate(star)}>
                    <MaterialIcons
                        name={star <= rating ? 'star' : 'star-border'}
                        size={32}
                        style={[styles.star, starStyle]} 
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default StarRating;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    star: {
        margin: 2,
        color: 'yellow'
    },
});
