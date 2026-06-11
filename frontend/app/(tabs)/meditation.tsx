import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/client';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', title: '5-4-3-2-1 Grounding', duration: 180, displayDuration: '3 min', icon: 'leaf-outline' },
  { id: '2', title: 'Box Breathing', duration: 240, displayDuration: '4 min', icon: 'water-outline' },
  { id: '3', title: 'Focus', duration: 900, displayDuration: '15 min', icon: 'bulb-outline', hasAudio: true },
  { id: '4', title: 'Mindful Walking', duration: 600, displayDuration: '10 min', icon: 'walk-outline' },
  { id: '5', title: 'Sleep Relax', duration: 1200, displayDuration: '20 min', icon: 'moon-outline' },
];

export default function MeditationScreen() {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeSession && timeLeft === 0) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [activeSession, timeLeft, isPaused]);

  const startMeditation = async (cat: any) => {
    setActiveSession(cat);
    setTimeLeft(cat.duration);
    setIsPaused(false);
    
    if (cat.hasAudio) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
           require('../../assets/music.mpeg'),
           { shouldPlay: true, isLooping: true }
        );
        setSound(newSound);
      } catch (err) {
        console.error("Failed to load sound", err);
      }
    }
  };

  const handleCompleteSession = async () => {
    const sessionToSave = activeSession;
    setActiveSession(null);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    Toast.show({ type: 'success', text1: 'Namaste 🙏', text2: `You completed your ${sessionToSave.title} session.` });

    try {
      await apiClient.post('/meditation', {
        category: sessionToSave.title,
        duration: sessionToSave.duration,
        completed: true
      });
    } catch (error) {
      console.error('Could not save session', error);
    }
  };

  const cancelSession = async () => {
    setActiveSession(null);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const togglePause = async () => {
    setIsPaused(!isPaused);
    if (sound) {
      if (!isPaused) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient]} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Breathe & Meditate</Text>
          <Text style={styles.subtitle}>Take a moment to reconnect with yourself.</Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.cardContainer}
              onPress={() => startMeditation(cat)}
            >
              <View style={styles.card}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name={cat.icon as any} size={26} color="#4facfe" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={styles.cardDuration}>{cat.displayDuration}</Text>
                </View>
                <View style={styles.playCircle}>
                  <Ionicons name="play" size={24} color="#fff" style={{ marginLeft: 3 }} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Timer Modal */}
      <Modal visible={!!activeSession} animationType="slide" transparent={false}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.modalContainer}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={cancelSession} style={styles.closeButton}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.timerContent}>
              <Text style={styles.timerSessionTitle}>{activeSession?.title}</Text>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.breathePrompt}>
                {timeLeft % 8 < 4 ? 'Breathe In...' : 'Breathe Out...'}
              </Text>
            </View>

            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={togglePause}
              >
                <Ionicons name={isPaused ? "play" : "pause"} size={40} color="#333" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
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
    paddingTop: 110,
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
  grid: {
    gap: 16,
  },
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
  },
  cardIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#D6E8F7',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardDuration: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  playCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4facfe',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    padding: 20,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
  },
  timerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerSessionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 80,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 40,
    fontVariant: ['tabular-nums'],
  },
  breathePrompt: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
    opacity: 0.8,
  },
  timerControls: {
    padding: 40,
    paddingBottom: 80,
    alignItems: 'center',
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});
