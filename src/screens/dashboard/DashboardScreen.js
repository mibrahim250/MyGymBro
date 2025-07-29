import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import GlassCard from '../../components/glass/GlassCard';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.h1}>Dashboard</Text>

      {/* greeting */}
      <GlassCard style={{ marginBottom: 24 }}>
        <Text style={styles.labelDim}>WELCOME BACK</Text>
        <Text style={styles.h2}>Ready to crush it? 💪</Text>
      </GlassCard>

      {/* two quick stats */}
      <View style={styles.row}>
        <GlassCard style={styles.smallCard}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={styles.number}>2 450</Text>
          <Text style={styles.labelDim}>calories today</Text>
        </GlassCard>
        <GlassCard style={styles.smallCard}>
          <Text style={styles.emoji}>⏱️</Text>
          <Text style={styles.number}>45 m</Text>
          <Text style={styles.labelDim}>avg session</Text>
        </GlassCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page:  { flex:1, backgroundColor: colors.background, padding:24 },
  row:   { flexDirection:'row', gap:16 },
  h1:    { color:colors.text, fontSize:32, fontWeight:'800', marginBottom:24 },
  h2:    { color:colors.text, fontSize:24, fontWeight:'700', marginTop:6 },
  labelDim:{ color:colors.textDim, fontSize:12, letterSpacing:1 },
  emoji: { fontSize:24, marginBottom:6 },
  number:{ fontSize:20, color:colors.accent, fontWeight:'700' },
  smallCard:{ flex:1, alignItems:'center' },
});
