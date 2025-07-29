import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import GlassCard from '../../components/glass/GlassCard';

export default function ProfileScreen({ onLogout }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom:40 }}>
      <Text style={styles.h1}>Profile</Text>

      <GlassCard style={{ alignItems:'center', marginBottom:24 }}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>User Name</Text>
      </GlassCard>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutTxt}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page:{ flex:1, backgroundColor:colors.background, padding:24 },
  h1:{ color:colors.text,fontSize:32,fontWeight:'800',marginBottom:24 },
  avatar:{ fontSize:48, marginBottom:12 },
  name:{ color:colors.text,fontSize:20,fontWeight:'600' },
  logoutBtn:{ backgroundColor:colors.error,borderRadius:14,padding:14,alignItems:'center' },
  logoutTxt:{ color:'#fff',fontWeight:'700' },
});
