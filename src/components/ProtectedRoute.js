import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigation.navigate('Login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;