import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function AddTodoScreen({ navigation }) {
  const [text, setText] = useState('');

  const handleAddTodo = async () => {
    const newTodo = {
      id: new Date().getTime(),
      text: text
    };

    let storedTodos = await SecureStore.getItemAsync('todos');
    let todos = storedTodos ? JSON.parse(storedTodos) : [];
    todos.push(newTodo);
    await SecureStore.setItemAsync('todos', JSON.stringify(todos));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Task Name"
        style={styles.input}
      />
      <Button title="ADD" color="#0000FF" onPress={handleAddTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  }
});
