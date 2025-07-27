import React from 'react';
import { View, Switch, Text } from 'react-native';

export default function ThemeToggle({ isDark, toggle }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Text style={{ color: isDark ? '#fff' : '#333', marginRight: 10 }}>
        {isDark ? '🌑 Sakura Night' : '🌸 Sakura Day'}
      </Text>
      <Switch value={isDark} onValueChange={toggle} />
    </View>
  );
}
