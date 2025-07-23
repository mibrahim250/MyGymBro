import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    daily_calorie_goal: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { user, profile } = await authService.getCurrentUser();
      if (user && profile) {
        setUserProfile({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: user.email || '',
          age: profile.age ? profile.age.toString() : '',
          weight: profile.weight ? profile.weight.toString() : '',
          height: profile.height ? profile.height.toString() : '',
          daily_calorie_goal: profile.daily_calorie_goal ? profile.daily_calorie_goal.toString() : '2000',
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        ...(userProfile.age && { age: parseInt(userProfile.age) }),
        ...(userProfile.weight && { weight: parseFloat(userProfile.weight) }),
        ...(userProfile.height && { height: parseFloat(userProfile.height) }),
        ...(userProfile.daily_calorie_goal && { 
          daily_calorie_goal: parseInt(userProfile.daily_calorie_goal) 
        }),
      };

      const { error } = await profileService.updateProfile(profileData);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const calculateBMI = () => {
    const weight = parseFloat(userProfile.weight);
    const height = parseFloat(userProfile.height) / 100; // Convert cm to meters
    
    if (weight && height) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const bmi = calculateBMI();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={colors.textSecondary}
                value={userProfile.first_name}
                onChangeText={(value) => updateProfile('first_name', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={colors.textSecondary}
                value={userProfile.last_name}
                onChangeText={(value) => updateProfile('last_name', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userProfile.email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                placeholderTextColor={colors.textSecondary}
                value={userProfile.age}
                onChangeText={(value) => updateProfile('age', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="70"
                placeholderTextColor={colors.textSecondary}
                value={userProfile.weight}
                onChangeText={(value) => updateProfile('weight', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="175"
              placeholderTextColor={colors.textSecondary}
              value={userProfile.height}
              onChangeText={(value) => updateProfile('height', value)}
              keyboardType="numeric"
            />
          </View>

          {bmi && (
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>BMI</Text>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>
          )}
        </View>

        <View style={styles.goalsCard}>
          <Text style={styles.sectionTitle}>Goals</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Daily Calorie Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="2000"
              placeholderTextColor={colors.textSecondary}
              value={userProfile.daily_calorie_goal}
              onChangeText={(value) => updateProfile('daily_calorie_goal', value)}
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>Recommended daily calorie intake</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.surface,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  goalsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  disabledInput: {
    backgroundColor: colors.border,
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  bmiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  bmiLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  bmiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileScreen;