import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    if (!entry.trim()) return;
    setIsSaving(true);
    try {
      await apiClient.post('/journals', { content: entry });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Journal entry saved! AI is analyzing your stress patterns.' });
      setEntry('');
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save entry.' });
    } finally {
      setIsSaving(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // You could fetch previous entries here if you render them
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient]} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4facfe" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daily Journal</Text>
          <Text style={styles.subtitle}>Write down your thoughts and feelings.</Text>
        </View>

        <View style={styles.editorContainer}>
          <TextInput
            style={styles.editor}
            placeholder="Today I feel..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={entry}
            onChangeText={setEntry}
            editable={!isSaving}
          />
        </View>

        <TouchableOpacity
          style={[styles.buttonContainer, (!entry.trim() || isSaving) && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!entry.trim() || isSaving}
        >
          <View style={styles.saveButton}>
            {isSaving ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Entry'}</Text>
          </View>
        </TouchableOpacity>

        {/* Empty space for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2FE',
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
  container: {
    padding: 20,
    paddingTop: 110, // Match mood padding for top navbar
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  editorContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    minHeight: 350,
    padding: 20,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  editor: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#1E293B',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButton: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#4facfe",
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
