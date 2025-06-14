import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient colors={['#000000', '#0F2027', '#2C5364']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.nameText}>{user?.name}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  profileHeader: {
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: '#ccc',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#00ffff',
  },
  logoutButton: {
    backgroundColor: '#e94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;