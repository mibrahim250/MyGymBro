import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import GlassCard from '../../components/glass/GlassCard';


export default function NutritionScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom:40 }}>
      <Text style={styles.h1}>Nutrition</Text>

      <GlassCard>
        <Text style={styles.txt}>Coming soon – calorie logging & macros panel.</Text>
      </GlassCard>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page:{ flex:1, backgroundColor:colors.background, padding:24 },
  h1:{ color:colors.text,fontSize:32,fontWeight:'800',marginBottom:24 },
  txt:{ color:colors.textDim,fontSize:15 },
});
