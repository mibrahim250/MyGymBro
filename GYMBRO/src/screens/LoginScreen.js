
import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login to GYMBRO</Text>
      <Button title="Sign In with Supabase" onPress={() => {}} />
    </View>
  );
};

export default LoginScreen;
