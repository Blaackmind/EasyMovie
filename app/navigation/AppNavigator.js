import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EasyMovie' }} />
    <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetailsScreen} 
      options={{ title: 'Detalhes' }} 
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
    <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetailsScreen} 
      options={{ title: 'Detalhes' }} 
    />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Favorites') {
          iconName = 'favorite';
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#6200ee',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Favorites" component={FavoritesStack} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { estaAutenticado } = useAuth();

  return estaAutenticado ? <AppTabs /> : <AuthStack />;
}