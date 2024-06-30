import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const navigation = useNavigation();

    const handleClick = (index) => {
        const newBoard = [...board];
        if (newBoard[index] || calculateWinner(newBoard)) {
            return;
        }
        newBoard[index] = xIsNext ? '🍔' : '🍕';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const renderSquare = (index) => {
        return (
            <TouchableOpacity style={styles.square} onPress={() => handleClick(index)}>
                <Text style={styles.squareText}>{board[index]}</Text>
            </TouchableOpacity>
        );
    };

    const winner = calculateWinner(board);
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? '🍔' : '🍕'}`;

    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 32, justifyContent: 'center', alignItems: 'center'}}>Tic Tac Toe</Text>
            <Text style={styles.status}>{status}</Text>
            <View style={styles.board}>
                <View style={styles.row}>
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </View>
                <View style={styles.row}>
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </View>
                <View style={styles.row}>
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </View>
            </View>
            <View style={{ padding: 10 }}>
                <Button title="Restart Game" onPress={restartGame} color="#58dc91"/>
            </View>

            <View style={{ padding: 10 }}>
                <Button title="Back" onPress={() => { navigation.navigate('Idle Game Screen') }} color="#dc5858" />
            </View>
        </View>
    );
};

const calculateWinner = (squares) => {
    //winning combinations 
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    status: {
        fontSize: 24,
        marginBottom: 10,
        justifyContent: 'center'
    },
    board: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    square: {
        width: 80,
        height: 80,
        backgroundColor: '#85ede1',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderRadius: 10
    },
    squareText: {
        fontSize: 36,
    },
});

export default TicTacToeGame;
