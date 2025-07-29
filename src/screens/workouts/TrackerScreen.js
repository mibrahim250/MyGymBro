import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { colors } from '../../styles/colors';
import GlassCard from '../../components/glass/GlassCard';

export default function TrackerScreen() {
  const [exercise,setExercise]=useState('');
  const [weight,setWeight]  =useState('');
  const [reps,setReps]      =useState('');
  const [sets,setSets]      =useState('');
  const [log,setLog]        =useState([]);

  const add = () => {
    if(!exercise.trim()) return;
    setLog([{ id:Date.now(), exercise, weight, reps, sets }, ...log]);
    setExercise(''); setWeight(''); setReps(''); setSets('');
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.h1}>Tracker</Text>

      {/* input card */}
      <GlassCard style={{ marginBottom:28 }}>
        <Text style={styles.label}>EXERCISE</Text>
        <TextInput style={styles.input} placeholder="Bench Press" placeholderTextColor="#666"
          value={exercise} onChangeText={setExercise}/>

        <View style={styles.row}>
          <View style={[styles.col,{marginRight:8}]}>
            <Text style={styles.label}>WEIGHT</Text>
            <TextInput style={styles.input} placeholder="135" placeholderTextColor="#666"
              keyboardType="numeric" value={weight} onChangeText={setWeight}/>
          </View>
          <View style={[styles.col,{marginLeft:8}]}>
            <Text style={styles.label}>REPS</Text>
            <TextInput style={styles.input} placeholder="10" placeholderTextColor="#666"
              keyboardType="numeric" value={reps} onChangeText={setReps}/>
          </View>
        </View>

        <Text style={styles.label}>SETS</Text>
        <TextInput style={styles.input} placeholder="3" placeholderTextColor="#666"
          keyboardType="numeric" value={sets} onChangeText={setSets}/>

        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Text style={styles.addTxt}>＋ Add</Text>
        </TouchableOpacity>
      </GlassCard>

      {/* log entries */}
      {log.map(entry=>(
        <GlassCard key={entry.id} style={styles.entry}>
          <Text style={styles.entryTxt}>
            {entry.exercise} — {entry.weight || 0} lb × {entry.reps||0} × {entry.sets||1}
          </Text>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page:{ flex:1, backgroundColor:colors.background, padding:24 },
  h1:{ color:colors.text,fontSize:32,fontWeight:'800',marginBottom:24 },
  label:{ color:colors.accent,fontSize:11,fontWeight:'600',marginBottom:6 },
  input:{ backgroundColor:'rgba(255,255,255,0.05)',borderRadius:14,color:colors.text,
          padding:14,marginBottom:14,borderWidth:1,borderColor:colors.border },
  row:{ flexDirection:'row' }, col:{ flex:1 },
  addBtn:{ backgroundColor:colors.accent,borderRadius:16,padding:14,alignItems:'center' },
  addTxt:{ color:'#000',fontWeight:'700' },
  entry:{ marginBottom:12 },
  entryTxt:{ color:colors.text },
});
