import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';

const MOODS = [
  { id: 'happy', label: 'Happy', icon: 'happy-outline' },
  { id: 'calm', label: 'Calm', icon: 'leaf-outline' },
  { id: 'neutral', label: 'Neutral', icon: 'remove-circle-outline' },
  { id: 'sad', label: 'Sad', icon: 'sad-outline' },
  { id: 'angry', label: 'Angry', icon: 'flame-outline' },
  { id: 'anxious', label: 'Anxious', icon: 'pulse-outline' },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood first.');
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.post('/moods', { mood: selectedMood, notes: '' });
      Alert.alert('Success', 'Mood saved!');
      setSelectedMood(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save mood.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient]} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.label;
            return (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodCard, isSelected && styles.selectedCard]}
                onPress={() => setSelectedMood(mood.label)}
                disabled={isSaving}
              >
                <Ionicons 
                  name={mood.icon as any} 
                  size={36} 
                  color={isSelected ? '#fff' : '#4facfe'} 
                  style={{ marginBottom: 8 }}
                />
                <Text style={[styles.moodText, isSelected && styles.selectedText]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <TouchableOpacity 
          style={[styles.buttonContainer, isSaving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Mood'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgGradient: {
    backgroundColor: '#E0F2FE',
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.15,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: "#4facfe",
    top: -80,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: "#00f2fe",
    bottom: 100,
    left: -60,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: "#FDF2F8",
    bottom: -30,
    right: 40,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 110, // Fix top margin due to navbar
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 30,
    color: '#1E293B',
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: '48%',
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  selectedCard: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
    shadowOpacity: 0.3,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradientButton: {
    backgroundColor: "#4facfe",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
