import React, { useState, useCallback } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    let storedTodos = await SecureStore.getItemAsync('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
      return () => {};
    }, [fetchTodos])
  );

  const handleDeleteTodos = async () => {
    setTodos([]);
    await SecureStore.deleteItemAsync('todos');
  };

  const handleDeleteTodo = async (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    await SecureStore.setItemAsync('todos', JSON.stringify(newTodos));
  };

  const handleMarkTodo = async (id) => {
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(newTodos);
    await SecureStore.setItemAsync('todos', JSON.stringify(newTodos));
  };

  const RightActions = ({ id }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleDeleteTodo(id);
        }}
        style={styles.rightAction}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => <RightActions id={item.id} />}>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: item.completed ? '#a6e5d8' : '#fff' }]}
        onPress={() => handleMarkTodo(item.id)}
      >
        <Text style={styles.title}>{item.text}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Button title="ADD A NEW TODO" color="#0000FF" onPress={() => navigation.navigate('AddTodo')} />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="REMOVE TODOS" color="#FF0000" onPress={handleDeleteTodos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  rightAction: {
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 8,
    padding: 20,
  },
  actionText: {
    color: '#fff',
  },
});
