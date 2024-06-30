import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions, View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Canvas,
    useImage,
    Image,
    Group,
    Text,
    matchFont,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    withTiming,
    Easing,
    withSequence,
    useFrameCallback,
    useDerivedValue,
    interpolate,
    Extrapolation,
    useAnimatedReaction,
    runOnJS,
    cancelAnimation,
} from 'react-native-reanimated';
import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const GRAVITY = 1000;
const JUMP_FORCE = -500;

const pipeWidth = 104;
const pipeHeight = 640;

function FlappyBurgerGame({route}) {
    const { width, height } = useWindowDimensions();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const navigation = useNavigation();

    const bg = useImage(require('../../../assets/sprites/background-day.png'));
    const bird = useImage(route.params?.character);
    const pipeBottom = useImage(require('../../../assets/sprites/pipe-green.png'));
    const pipeTop = useImage(require('../../../assets/sprites/pipe-green-top.png'));
    const base = useImage(require('../../../assets/sprites/base.png'));

    const gameOver = useSharedValue(false);
    const pipeX = useSharedValue(width);

    const birdY = useSharedValue(height / 3);
    const birdX = width / 4;
    const birdYVelocity = useSharedValue(0);

    const pipeOffset = useSharedValue(0);
    const topPipeY = useDerivedValue(() => pipeOffset.value - 320);
    const bottomPipeY = useDerivedValue(() => height - 320 + pipeOffset.value);

    const pipesSpeed = useDerivedValue(() => {
        return interpolate(score, [0, 20], [1, 2]);
    });

    const obstacles = useDerivedValue(() => [
        // bottom pipe
        {
            x: pipeX.value,
            y: bottomPipeY.value,
            h: pipeHeight,
            w: pipeWidth,
        },
        // top pipe
        {
            x: pipeX.value,
            y: topPipeY.value,
            h: pipeHeight,
            w: pipeWidth,
        },
    ]);

    useEffect(() => {
        moveTheMap();
        loadHighScore();
    }, []);

    //moving the 'camera' rather than moving the bird itself
    const moveTheMap = () => {
        pipeX.value = withSequence(
            withTiming(width, { duration: 0 }),
            withTiming(-150, {
                duration: 3000 / pipesSpeed.value,
                easing: Easing.linear,
            }),
            withTiming(width, { duration: 0 })
        );
    };

    const loadHighScore = async () => {
        try {
            const storedHighScore = await AsyncStorage.getItem('HIGH_SCORE');
            if (storedHighScore !== null) {
                setHighScore(Number(storedHighScore));
            }
        } catch (error) {
            console.log('Failed to load high score:', error);
        }
    };

    const saveHighScore = async (newHighScore) => {
        try {
            await AsyncStorage.setItem('HIGH_SCORE', newHighScore.toString());
            setHighScore(newHighScore);
        } catch (error) {
            console.log('Failed to save high score:', error);
        }
    };

    // Scoring system
    useAnimatedReaction(
        () => pipeX.value,
        (currentValue, previousValue) => {
            const middle = birdX;

            // change offset for the position of the next gap
            if (previousValue && currentValue < -100 && previousValue > -100) {
                pipeOffset.value = Math.random() * 400 - 200;
                cancelAnimation(pipeX);
                runOnJS(moveTheMap)();
            }

            if (
                currentValue !== previousValue &&
                previousValue &&
                currentValue <= middle &&
                previousValue > middle
            ) {
                runOnJS(setScore)(score + 1);
            }
        }
    );

    useEffect(() => {
        if (score > highScore) {
            saveHighScore(score);
        }
    }, [score]);

    const isPointCollidingWithRect = (point, rect) => {
        'worklet';
        return (
            point.x >= rect.x && // right of the left edge AND
            point.x <= rect.x + rect.w && // left of the right edge AND
            point.y >= rect.y && // below the top AND
            point.y <= rect.y + rect.h // above the bottom
        );
    };

    // Collision detection
    useAnimatedReaction(
        () => birdY.value,
        (currentValue, previousValue) => {
            const center = {
                x: birdX + 32,
                y: birdY.value + 24,
            };

            // Ground collision detection
            if (currentValue > height - 100 || currentValue < 0) {
                gameOver.value = true;
            }

            const isColliding = obstacles.value.some((rect) =>
                isPointCollidingWithRect(center, rect)
            );
            if (isColliding) {
                gameOver.value = true;
            }
        }
    );

    useAnimatedReaction(
        () => gameOver.value,
        (currentValue, previousValue) => {
            if (currentValue && !previousValue) {
                cancelAnimation(pipeX);
            }
        }
    );

    useFrameCallback(({ timeSincePreviousFrame: dt }) => {
        if (!dt || gameOver.value) {
            return;
        }
        birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
        birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
    });

    const restartGame = () => {
        'worklet';
        birdY.value = height / 3;
        birdYVelocity.value = 0;
        gameOver.value = false;
        pipeX.value = width;
        runOnJS(moveTheMap)();
        runOnJS(setScore)(0);
    };

    const gesture = Gesture.Tap().onStart(() => {
        if (gameOver.value) {
            restartGame();
        } else {
            birdYVelocity.value = JUMP_FORCE;
        }
    });

    const birdTransform = useDerivedValue(() => {
        return [
            {
                rotate: interpolate(
                    birdYVelocity.value,
                    [-500, 500],
                    [-0.5, 0.5],
                    Extrapolation.CLAMP
                ),
            },
        ];
    });

    const birdOrigin = useDerivedValue(() => {
        return { x: width / 4 + 32, y: birdY.value + 24 };
    });

    const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
    const fontStyle = {
        fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
    };
    const font = matchFont(fontStyle);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={gesture}>
                <Canvas style={{ width, height }}>
                    {/* BG */}
                    <Image image={bg} width={width} height={height} fit={'fitHeight'} />

                    {/* Pipes */}
                    <Image
                        image={pipeTop}
                        y={topPipeY}
                        x={pipeX}
                        width={pipeWidth}
                        height={pipeHeight}
                    />
                    <Image
                        image={pipeBottom}
                        y={bottomPipeY}
                        x={pipeX}
                        width={pipeWidth}
                        height={pipeHeight}
                    />

                    {/* Base */}
                    <Image
                        image={base}
                        width={width}
                        height={150}
                        y={height - 75}
                        x={0}
                        fit={'cover'}
                    />

                    {/* Bird */}
                    <Group transform={birdTransform} origin={birdOrigin}>
                        <Image image={bird} y={birdY} x={birdX} width={64} height={48} />
                    </Group>

                    {/* Score and High Score */}
                    <Group>
                        <Text
                            x={width / 2 - 70}
                            y={80}
                            text={`Score: ${score}`}
                            font={font}
                            color="black"
                        />
                        <Text
                            x={width / 2 - 70}
                            y={110}
                            text={`High Score: ${highScore}`}
                            font={font}
                            color="black"
                        />
                    </Group>
                </Canvas>
            </GestureDetector>
            {/* Button to return to Idle Game */}
            <View style={styles.buttonContainer}>
                <Button title="Back" onPress={() => { navigation.navigate('Idle Game Screen') }} color="#dc5858" />
            </View>
        </GestureHandlerRootView>
    );
};

export default FlappyBurgerGame;

const styles = StyleSheet.create({
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
});
