import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { auth, db } from "../../../utils/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import StarRating from "../Star Rating/StarRating";

function UserFoodRatings({ storeName }) {
    const [rating, setRating] = useState(0);
    const userDisplayName = auth.currentUser.displayName;

    useEffect(() => {
        fetchUserRating();
    }, []);

    const fetchUserRating = async () => {
        try {
            const merchantDocRef = doc(db, 'merchant', storeName);
            const docSnapshot = await getDoc(merchantDocRef);
            if (docSnapshot.exists()) {
                const ratings = docSnapshot.data().rating || [];
                const userRating = ratings.find(r => r.userDisplayName === userDisplayName);
                if (userRating) {
                    setRating(userRating.rating);
                } else {
                    setRating(0);
                }
            }
        } catch (error) {
            console.error("Error fetching user rating:", error);
        }
    };


    //update or add rating to the docs
    const handleRating = async (newRating) => {
        try {
            setRating(newRating);
            const merchantDocRef = doc(db, 'merchant', storeName);

            // Get the current ratings array
            const docSnapshot = await getDoc(merchantDocRef);
            const ratings = docSnapshot.data().rating || [];

            // Check if the user has already rated
            const userRating = ratings.find(r => r.userDisplayName === userDisplayName);

            // Update or add the rating
            if (userRating) {
                // Remove the old rating
                await updateDoc(merchantDocRef, {
                    rating: arrayRemove(userRating)
                });
            }

            // Add the new rating
            await updateDoc(merchantDocRef, {
                rating: arrayUnion({ userDisplayName, rating: newRating })
            });
        } catch (error) {
            console.error("Error updating user rating:", error);
        }
    };

    return (
        <StarRating rating={rating} onRate={handleRating} />
    );
}

export default UserFoodRatings;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        borderWidth: 1
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

});
