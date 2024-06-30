import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import React, { useRef, useState } from 'react';
import UserFoodMenu from "../User Food Scroll/UserFoodMenu";
import UserFoodDirection from "../User Food Scroll/UserFoodDirection";
import UserFoodReviews from "../User Food Scroll/UserFoodReviews";
import UserFoodRatings from "../User Food Scroll/UserFoodRatings";

const Carousell = ({ storeName }) => {
    const containerWidthRef = useRef(Dimensions.get('window').width);
    const [containerWidth, setContainerWidth] = useState(containerWidthRef.current);
    const [activeIndex, setActiveIndex] = useState(0);

    const foodScreens = [
        {
            id: '01',
            screen: <UserFoodMenu storeName={storeName}/>,
            storeName: storeName // Pass the storeName here
        },
        {
            id: '02',
            screen: <UserFoodDirection storeName={storeName} />, // Pass the storeName as a prop to UserFoodDirection component
            storeName: storeName // Also pass the storeName here
        },
        {
            id: '03',
            screen: <UserFoodReviews />,
            storeName: storeName // Pass the storeName here
        },
    ];

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.itemContainer, { width: containerWidth }]}>
                {React.cloneElement(item.screen, { storeName: item.storeName })} 
            </View>
        );
    };

    const onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        containerWidthRef.current = width;
        setContainerWidth(width);
    };

    const renderDotIndicators = () => {
        return foodScreens.map((dot, index) => {
            return (
                <View
                    key={index}
                    style={index === activeIndex ? styles.dotActive : styles.dot}
                />
            );
        });
    };

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / containerWidthRef.current);
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.flatListContainer} onLayout={onLayout}>
                <FlatList
                    data={foodScreens}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    onScroll={handleScroll}
                    scrollEventThrottle={16} // To control how often the scroll event is fired
                />
            </View>
            <View style={styles.dotContainer}>
                {renderDotIndicators()}
            </View>
        </View>
    );
}

export default Carousell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContainer: {
        flex: 12,
    },
    dotContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#B0C4DE', // Light steel blue
        height: 10,
        width: 10,
        borderRadius: 5,
        margin: 5,
    },
    dotActive: {
        backgroundColor: '#FF6347', // Tomato
        height: 10,
        width: 10,
        borderRadius: 5,
        margin: 5,
    }
});
