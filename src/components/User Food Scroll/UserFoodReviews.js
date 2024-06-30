import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TextInput, Button, RefreshControl, TouchableOpacity } from 'react-native';
import { db, auth } from "../../../utils/firebase";
import { collection, getDocs, addDoc, query, orderBy, updateDoc, doc, increment } from 'firebase/firestore';
import CustomButton from '../CustomButtons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import UserFoodRatings from './UserFoodRatings';

function UserFoodReviews({storeName}) {
    const navigation = useNavigation();
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [nestedComment, setNestedComment] = useState({});
    const [expandedReviews, setExpandedReviews] = useState({});
    const [replyingToReview, setReplyingToReview] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [upvotedComments, setUpvotedComments] = useState({});

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const reviewsCollection = collection(db, 'foodPlaces', storeName, 'reviews');
        const q = query(reviewsCollection, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
            reviewsData.push({ id: doc.id, ...doc.data(), nestedComments: [] });
        });

        // Fetch nested comments for each review
        const reviewsWithNestedComments = await Promise.all(reviewsData.map(async (review) => {
            review.nestedComments = await fetchNestedComments(review.id);
            return review;
        }));

        setReviews(reviewsWithNestedComments);
    };

    const fetchNestedComments = async (reviewId) => {
        const nestedCommentsCollection = collection(db, 'foodPlaces', storeName, 'reviews', reviewId, 'nestedComments');
        const q = query(nestedCommentsCollection, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const nestedCommentsData = [];
        querySnapshot.forEach((doc) => {
            nestedCommentsData.push({ id: doc.id, ...doc.data() });
        });
    
        // Ensure that each nested comment object contains the ID of its parent review
        nestedCommentsData.forEach(comment => {
            comment.reviewId = reviewId; // Assign the parent review ID to the nested comment
        });
    
        return nestedCommentsData;
    };
    

    const handlePostComment = async () => {
        const reviewsCollection = collection(db, 'foodPlaces', storeName, 'reviews');
        await addDoc(reviewsCollection, {
            userId: auth.currentUser.displayName,
            comment: newComment,
            timestamp: new Date(),
            upvotes: 0
        });
        setNewComment('');
        fetchReviews();
    };

    const handlePostNestedComment = async (reviewId) => {
        const nestedCommentsCollection = collection(db, 'foodPlaces', storeName, 'reviews', reviewId, 'nestedComments');
        await addDoc(nestedCommentsCollection, {
            userId: auth.currentUser.displayName,
            comment: nestedComment[reviewId] || '',
            timestamp: new Date(),
            upvotes: 0
        });
        setNestedComment({ ...nestedComment, [reviewId]: '' });
        setReplyingToReview({ ...replyingToReview, [reviewId]: false });
        const updatedNestedComments = await fetchNestedComments(reviewId);
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === reviewId ? { ...review, nestedComments: updatedNestedComments } : review
            )
        );
    };

    const handleUpvote = async (reviewId, isNested, nestedCommentId) => {
        try {
            //Construct the reference to the comment (main comment or nested comment)
            const commentRef = isNested
                ? doc(db, 'foodPlaces', storeName, 'reviews', reviewId, 'nestedComments', nestedCommentId)
                : doc(db, 'foodPlaces', storeName, 'reviews', reviewId);

            //Check if the comment has already been upvoted by the user
            const alreadyUpvoted = upvotedComments[isNested ? nestedCommentId : reviewId];

            // If already upvoted, remove the upvote
            if (alreadyUpvoted) {
                //Remove the comment ID from upvotedComments
                setUpvotedComments(prevUpvotedComments => {
                    const updatedUpvotedComments = { ...prevUpvotedComments };
                    delete updatedUpvotedComments[isNested ? nestedCommentId : reviewId];
                    return updatedUpvotedComments;
                });

                //Decrease the upvotes count in the database
                await updateDoc(commentRef, {
                    upvotes: increment(-1)
                });

                //Fetch the updated list of nested comments if it's a nested comment
                if (isNested) {
                    const updatedNestedComments = await fetchNestedComments(reviewId);
                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            review.id === reviewId ? { ...review, nestedComments: updatedNestedComments } : review
                        )
                    );
                } else {

                    fetchReviews();
                }
            } else {
                //If not upvoted, add the upvote
                setUpvotedComments(prevUpvotedComments => ({
                    ...prevUpvotedComments,
                    [isNested ? nestedCommentId : reviewId]: true
                }));

                //Increase the upvotes count in the database
                await updateDoc(commentRef, {
                    upvotes: increment(1)
                });

                //Fetch the updated list of nested comments if it's a nested comment
                if (isNested) {
                    const updatedNestedComments = await fetchNestedComments(reviewId);
                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            review.id === reviewId ? { ...review, nestedComments: updatedNestedComments } : review
                        )
                    );
                } else {
                    //if it's a main comment, fetch all comments
                    fetchReviews();
                }
            }
        } catch (error) {
            console.error('Error handling upvote:', error);
        }
    }



    const toggleExpandReview = (reviewId) => {
        setExpandedReviews((prevExpanded) => ({
            ...prevExpanded,
            [reviewId]: !prevExpanded[reviewId]
        }));
    };

    const toggleReplyInput = (reviewId) => {
        setReplyingToReview((prevReplying) => ({
            ...prevReplying,
            [reviewId]: !prevReplying[reviewId]
        }));
    };

    const renderReview = ({ item }) => (
        <View style={styles.review}>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.user}>by {item.userId}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handleUpvote(item.id, false)}
                    style={{marginHorizontal: 5}}>
                    <Text style={styles.upvoteButton}>
                        Upvote ({item.upvotes})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleExpandReview(item.id)}
                    style={{marginHorizontal: 5}}>
                    <Text style={styles.expandButton}>
                        {expandedReviews[item.id] ? 'Hide Comments' : 'Show Comments'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleReplyInput(item.id)}
                    style={{marginHorizontal: 5}}>
                    <Text style={styles.replyButton}>
                        Reply
                    </Text>
                </TouchableOpacity>
            </View>
            {expandedReviews[item.id] && (
                <FlatList
                    data={item.nestedComments}
                    renderItem={renderNestedComment}
                    keyExtractor={(nestedItem) => nestedItem.id}
                />
            )}
            {replyingToReview[item.id] && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Write a nested comment..."
                        value={nestedComment[item.id] || ''}
                        onChangeText={(text) => setNestedComment({ ...nestedComment, [item.id]: text })}
                    />
                    <CustomButton onPress={() => handlePostNestedComment(item.id)} text='Post' type='Primary' />
                </>
            )}
        </View>
    );

    const renderNestedComment = ({ item }) => { 

        return (
        
        <View style={styles.nestedComment}>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.user}>by {item.userId}</Text>
            <TouchableOpacity onPress={() => handleUpvote(item.reviewId, true, item.id)}>
                <Text style={styles.upvoteButton}>
                    Upvote ({item.upvotes})
                </Text>
            </TouchableOpacity>
        </View>
    );};

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReviews();
        setRefreshing(false);
    };

    return (
        <View style={styles.root}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Food Reviews</Text>
            </View>
            <FlatList
                data={reviews}
                renderItem={renderReview}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
            />

            <CustomButton onPress={handlePostComment} text='Post' type='Primary' />
            <UserFoodRatings storeName={storeName}/>
            <CustomButton onPress={() => {}} text='Leave a rating' type='Tertiary' />
        </View>
    );
}

export default UserFoodReviews;

const styles = StyleSheet.create({
    root: {
        alignItems: 'stretch',
        padding: 20,
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    titleContainer: {
        alignItems: 'center'
    },
    review: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#d9fafd',
        borderWidth: 2,
        borderRadius: 20,
        margin: 3,
        backgroundColor: '#d9fafd',
        width: Dimensions.get('window').width * 0.9,

    },
    nestedComment: {
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    comment: {
        fontSize: 16
    },
    user: {
        fontSize: 12,
        color: '#888'
    },
    input: {
        height: 40,
        borderColor: '#d9fafd',
        borderWidth: 5,
        borderRadius: 20,
        marginBottom: 10,
        width: '100%',
        padding: 10,
        backgroundColor: '#d9fafd',
        marginTop: 10
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 5,
    },
    expandButton: {
        color: 'blue',
    },
    replyButton: {
        color: 'blue',
    },
    upvoteButton: {
        color: 'green',
        marginRight: 10
    }
});
