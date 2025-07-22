import React, { useState } from 'react';
import { Plus, Calendar, User, BarChart3, Moon, Sun, Trash2, Edit3 } from 'lucide-react';
import { saveWorkout } from '../services/workoutService';


const GymBroApp = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const [darkMode, setDarkMode] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [exerciseType, setExerciseType] = useState('strength'); // strength or cardio
  
  // Workout state
  const [workoutExercises, setWorkoutExercises] = useState([]);
  
  // Calorie tracking state
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [calorieEntries, setCalorieEntries] = useState([]);
  
  // Calculate total calories for today
  const todayCalories = calorieEntries.reduce((total, entry) => total + entry.calories, 0);

  const addExercise = () => {
    if (!currentExercise) return;
    
    const newExercise = {
      id: Date.now(),
      name: currentExercise,
      type: exerciseType,
      sets: exerciseType === 'strength' ? sets : '',
      reps: exerciseType === 'strength' ? reps : '',
      weight: exerciseType === 'strength' ? weight : '',
      duration: exerciseType === 'cardio' ? duration : '',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setWorkoutExercises([...workoutExercises, newExercise]);

    //Save to supabase
    button.addEventListener('click', async () => {
        try {
            await saveWorkout(newExercise);
            console.log('Workout saved to Supabase!');
        } catch (error) {
            console.error('Error saving workout:', error);
        }
    });
    
    // Clear inputs
    setCurrentExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
  };

  const addCalorieEntry = () => {
    if (!foodItem || !calories) return;
    
    const newEntry = {
      id: Date.now(),
      food: foodItem,
      calories: parseInt(calories),
      time: mealTime || new Date().toLocaleTimeString(),
      timestamp: new Date().toLocaleString()
    };
    
    setCalorieEntries([...calorieEntries, newEntry]);
    
    // Clear inputs
    setFoodItem('');
    setCalories('');
    setMealTime('');
  };

  const removeExercise = (id) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id));
  };

  const removeCalorieEntry = (id) => {
    setCalorieEntries(calorieEntries.filter(entry => entry.id !== id));
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/70 backdrop-blur-sm border-white/20';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500';

  const renderCurrentWorkout = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Current Workout</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Exercise Type Toggle */}
      <div className={`p-4 rounded-2xl border ${cardClasses}`}>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setExerciseType('strength')}
            className={`px-4 py-2 rounded-xl transition-all ${
              exerciseType === 'strength' 
                ? 'bg-blue-500 text-white' 
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            Strength
          </button>
          <button
            onClick={() => setExerciseType('cardio')}
            className={`px-4 py-2 rounded-xl transition-all ${
              exerciseType === 'cardio' 
                ? 'bg-blue-500 text-white' 
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            Cardio
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Exercise name"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            className={`w-full p-3 rounded-xl border ${inputClasses}`}
          />
          
          {exerciseType === 'strength' ? (
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className={`p-3 rounded-xl border ${inputClasses}`}
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={`p-3 rounded-xl border ${inputClasses}`}
              />
              <input
                type="number"
                placeholder="Weight (lbs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`p-3 rounded-xl border ${inputClasses}`}
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Duration (e.g., 30 min)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`w-full p-3 rounded-xl border ${inputClasses}`}
            />
          )}
          
          <button
            onClick={addExercise}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </div>
      </div>

      {/* Current Exercises */}
      {workoutExercises.length > 0 && (
        <div className={`p-4 rounded-2xl border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-3">Today's Exercises</h3>
          <div className="space-y-2">
            {workoutExercises.map((exercise) => (
              <div key={exercise.id} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white/60'} flex items-center justify-between`}>
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm opacity-70">
                    {exercise.type === 'strength' 
                      ? `${exercise.sets} sets × ${exercise.reps} reps ${exercise.weight ? `@ ${exercise.weight}lbs` : ''}`
                      : `${exercise.duration}`
                    }
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(exercise.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calorie Tracking */}
      <div className={`p-4 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Track Calories</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Food item"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            className={`w-full p-3 rounded-xl border ${inputClasses}`}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className={`p-3 rounded-xl border ${inputClasses}`}
            />
            <input
              type="time"
              placeholder="Time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className={`p-3 rounded-xl border ${inputClasses}`}
            />
          </div>
          <button
            onClick={addCalorieEntry}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Food
          </button>
        </div>
      </div>

      {/* Today's Calories */}
      <div className={`p-4 rounded-2xl border ${cardClasses}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Today's Calories</h3>
          <div className="text-2xl font-bold text-green-500">{todayCalories}</div>
        </div>
        {calorieEntries.length > 0 && (
          <div className="space-y-2">
            {calorieEntries.slice(-3).map((entry) => (
              <div key={entry.id} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white/60'} flex items-center justify-between text-sm`}>
                <div>
                  <span className="font-medium">{entry.food}</span>
                  <span className="mx-2">•</span>
                  <span>{entry.calories} cal</span>
                </div>
                <button
                  onClick={() => removeCalorieEntry(entry.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview</h2>
      
      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">12</div>
            <div className="text-sm opacity-70">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">2,450</div>
            <div className="text-sm opacity-70">Avg Calories</div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          {['Push Day - Upper Body', 'Leg Day - Lower Body', 'Pull Day - Back & Biceps'].map((workout, index) => (
            <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white/60'}`}>
              <div className="font-medium">{workout}</div>
              <div className="text-sm opacity-70">{index + 1} days ago • 45 min</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Calorie Trends</h3>
        <div className="space-y-2">
          {['Monday: 2,200 cal', 'Tuesday: 2,450 cal', 'Wednesday: 2,100 cal'].map((day, index) => (
            <div key={index} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white/60'} text-sm`}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Plans & Presets</h2>
      
      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">
            <div className="text-sm font-medium">Generate AI</div>
            <div className="text-xs opacity-80">Workout Plan</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl">
            <div className="text-sm font-medium">Create Custom</div>
            <div className="text-xs opacity-80">Preset</div>
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">My Presets</h3>
        <div className="space-y-3">
          {['Push-Pull-Legs Split', 'Full Body Workout', 'Cardio + Abs'].map((preset, index) => (
            <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white/60'} flex items-center justify-between`}>
              <div>
                <div className="font-medium">{preset}</div>
                <div className="text-sm opacity-70">3-4 exercises • 45-60 min</div>
              </div>
              <Edit3 size={16} className="opacity-50" />
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
              index < 3 ? 'bg-green-500 text-white' : 
              index === 3 ? 'bg-blue-500 text-white' : 
              `${darkMode ? 'bg-gray-700' : 'bg-white/60'}`
            }`}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      
      <div className={`p-6 rounded-2xl border ${cardClasses} text-center`}>
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          JD
        </div>
        <div className="text-xl font-semibold">John Doe</div>
        <div className="text-sm opacity-70">Member since Jan 2024</div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-3">
          {[
            { label: 'Notifications', icon: '🔔' },
            { label: 'Workout Reminders', icon: '⏰' },
            { label: 'Theme Settings', icon: '🎨' },
            { label: 'Units (lbs/kg)', icon: '⚖️' },
            { label: 'Privacy', icon: '🔒' },
            { label: 'Help & Support', icon: '❓' }
          ].map((setting, index) => (
            <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white/60'} flex items-center gap-3`}>
              <span className="text-lg">{setting.icon}</span>
              <span className="font-medium">{setting.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-500">156</div>
            <div className="text-sm opacity-70">Total Workouts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">12.5k</div>
            <div className="text-sm opacity-70">Calories Burned</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workout':
        return renderCurrentWorkout();
      case 'overview':
        return renderOverview();
      case 'plans':
        return renderPlans();
      case 'profile':
        return renderProfile();
      default:
        return renderCurrentWorkout();
    }
  };

  const TabButton = ({ id, icon: Icon, label, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-white text-gray-800 shadow-lg scale-105' 
          : `${darkMode ? 'bg-white/10 text-gray-300' : 'bg-black/10 text-gray-600'} backdrop-blur-sm hover:bg-white/20`
      }`}
    >
      <Icon size={22} className="mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen ${themeClasses} transition-all duration-300`}>
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-4 pb-24 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-800' : 'border-white/20'}`}>
          <div className="flex items-center gap-2">
            <TabButton
              id="workout"
              icon={Plus}
              label="Workout"
              isActive={activeTab === 'workout'}
            />
            <TabButton
              id="overview"
              icon={BarChart3}
              label="Overview"
              isActive={activeTab === 'overview'}
            />
            <TabButton
              id="plans"
              icon={Calendar}
              label="Plans"
              isActive={activeTab === 'plans'}
            />
            <TabButton
              id="profile"
              icon={User}
              label="Profile"
              isActive={activeTab === 'profile'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymBroApp;