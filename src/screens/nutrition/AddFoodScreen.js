import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { colors } from '../../styles/colors';
import { nutritionService } from '../../services/nutritionService';

const AddFoodScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState({
    food_name: '',
    calories: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Common foods for quick add
  const commonFoods = [
    { name: 'Banana', calories: 105 },
    { name: 'Apple', calories: 95 },
    { name: 'Egg', calories: 70 },
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Rice (1 cup)', calories: 205 },
    { name: 'Bread Slice', calories: 80 },
    { name: 'Oatmeal (1 cup)', calories: 150 },
    { name: 'Greek Yogurt (1 cup)', calories: 130 },
    { name: 'Almonds (28g)', calories: 164 },
    { name: 'Avocado', calories: 234 },
    { name: 'Sweet Potato', calories: 112 },
    { name: 'Salmon (100g)', calories: 208 },
  ];

  const updateFoodData = (field, value) => {
    setFoodData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!foodData.food_name.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return false;
    }
    if (!foodData.calories || isNaN(foodData.calories) || parseInt(foodData.calories) <= 0) {
      Alert.alert('Error', 'Please enter a valid calorie amount');
      return false;
    }
    return true;
  };

  const handleSaveFood = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const calorieData = {
        food_name: foodData.food_name.trim(),
        calories: parseInt(foodData.calories),
        ...(foodData.notes.trim() && { notes: foodData.notes.trim() }),
      };

      const { data, error } = await nutritionService.saveCalorieEntry(calorieData);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success',
          'Food entry saved successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error saving food entry:', error);
      Alert.alert('Error', 'Failed to save food entry');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (food) => {
    setFoodData({
      food_name: food.name,
      calories: food.calories.toString(),
      notes: '',
    });
    setShowQuickAdd(false);
  };

  const clearForm = () => {
    setFoodData({
      food_name: '',
      calories: '',
      notes: '',
    });
  };

  const quickCalorieValues = [50, 100, 150, 200, 250, 300, 400, 500];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Food</Text>
          <TouchableOpacity onPress={clearForm}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Quick Add Button */}
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => setShowQuickAdd(true)}
          >
            <Text style={styles.quickAddButtonText}>🍎 Quick Add Common Foods</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chicken Breast, Apple, Rice Bowl"
              placeholderTextColor={colors.textSecondary}
              value={foodData.food_name}
              onChangeText={(value) => updateFoodData('food_name', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 150"
              placeholderTextColor={colors.textSecondary}
              value={foodData.calories}
              onChangeText={(value) => updateFoodData('calories', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Quick Calorie Buttons */}
          <View style={styles.quickCalories}>
            <Text style={styles.quickCaloriesTitle}>Quick Calorie Values</Text>
            <View style={styles.quickCaloriesGrid}>
              {quickCalorieValues.map((calories) => (
                <TouchableOpacity 
                  key={calories}
                  style={[
                    styles.quickCalorieButton,
                    foodData.calories === calories.toString() && styles.selectedQuickCalorie
                  ]}
                  onPress={() => updateFoodData('calories', calories.toString())}
                >
                  <Text style={[
                    styles.quickCalorieText,
                    foodData.calories === calories.toString() && styles.selectedQuickCalorieText
                  ]}>
                    {calories}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Portion size, cooking method, meal type..."
              placeholderTextColor={colors.textSecondary}
              value={foodData.notes}
              onChangeText={(value) => updateFoodData('notes', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Nutrition Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for Accurate Tracking</Text>
            <Text style={styles.tipText}>• Use food labels when available</Text>
            <Text style={styles.tipText}>• Measure portions for better accuracy</Text>
            <Text style={styles.tipText}>• Include cooking oils and condiments</Text>
            <Text style={styles.tipText}>• Log immediately after eating</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveFood}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Food Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Quick Add Modal */}
      <Modal
        visible={showQuickAdd}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQuickAdd(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Common Foods</Text>
            <TouchableOpacity onPress={() => setShowQuickAdd(false)}>
              <Text style={styles.modalCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {commonFoods.map((food, index) => (
              <TouchableOpacity
                key={index}
                style={styles.foodOption}
                onPress={() => handleQuickAdd(food)}
              >
                <View style={styles.foodOptionContent}>
                  <Text style={styles.foodOptionName}>{food.name}</Text>
                  <Text style={styles.foodOptionCalories}>{food.calories} cal</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearButton: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  quickAddButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  quickAddButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 20,
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
  textArea: {
    minHeight: 80,
    paddingTop: 16,
  },
  quickCalories: {
    marginBottom: 24,
  },
  quickCaloriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quickCaloriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCalorieButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '22%',
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedQuickCalorie: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickCalorieText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedQuickCalorieText: {
    color: colors.surface,
  },
  tipsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  foodOption: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  foodOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  foodOptionCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default AddFoodScreen;