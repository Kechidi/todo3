import React, { useState, useCallback } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, TouchableOpacity
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
    <Swipeable
      renderRightActions={() => <RightActions id={item.id} />}
    >
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleMarkTodo(item.id)}
      >
        <Text style={styles.title}>{item.text}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Button title="Add a new Todo" onPress={() => navigation.navigate('AddTodo')} />

      <Text style={styles.sectionHeader}>Pending</Text>
      <FlatList
        data={todos.filter(todo => !todo.completed)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.sectionHeader}>Completed</Text>
      <FlatList
        data={todos.filter(todo => todo.completed)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Button title="Remove All Todos" onPress={handleDeleteTodos} />
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
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 10,
  },
});
