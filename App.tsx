import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Home';
import AddTodoScreen from './todo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: "Ajout d'une tâche à réaliser" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
