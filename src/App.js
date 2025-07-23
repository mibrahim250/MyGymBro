import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/colors';

const theme = {
  colors: {
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;