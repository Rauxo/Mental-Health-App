import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const BENEFITS = [
  "Calms your nervous system...",
  "Reduces the stress hormone cortisol...",
  "Increases oxygen to your brain...",
  "Helps regulate your heart rate...",
  "Promotes a deep sense of relaxation..."
];

export default function BreathingScreen() {
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [benefitIndex, setBenefitIndex] = useState(0);
  
  // Animations
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const breathAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const benefitFade = useRef(new Animated.Value(1)).current;

  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, { toValue: -20, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim1, { toValue: 0, duration: 3000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, { toValue: 20, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatAnim2, { toValue: 0, duration: 4000, useNativeDriver: true })
      ])
    ).start();

    const benefitInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(benefitFade, { toValue: 0, duration: 500, useNativeDriver: true })
      ]).start(() => {
        setBenefitIndex(prev => (prev + 1) % BENEFITS.length);
        Animated.timing(benefitFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }, 4000);

    startSession();

    return () => clearInterval(benefitInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // Box Breathing [4,4,4,4]
  useEffect(() => {
    if (!isPaused) {
      const pattern = [4, 4, 4, 4];
      
      const animateBreath = () => {
        if (isPaused) return;
        setBreathPhase('Inhale');
        Animated.timing(breathAnim, { toValue: 2.5, duration: pattern[0] * 1000, useNativeDriver: true }).start(() => {
          if (isPaused) return;
          setBreathPhase('Hold');
          setTimeout(() => {
            if (isPaused) return;
            startExhale();
          }, pattern[1] * 1000);
        });
      };

      const startExhale = () => {
        if (isPaused) return;
        setBreathPhase('Exhale');
        Animated.timing(breathAnim, { toValue: 1, duration: pattern[2] * 1000, useNativeDriver: true }).start(() => {
          if (isPaused) return;
          setBreathPhase('Hold');
          setTimeout(() => {
            if (!isPaused) animateBreath();
          }, pattern[3] * 1000);
        });
      };

      animateBreath();
    }
  }, [isPaused]);

  const startSession = async () => {
    setElapsedTime(0);
    setIsPaused(false);
    breathAnim.setValue(1);

    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
         require('../../assets/breathing.mp3'),
         { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
    } catch(err) {}
  };

  const handleComplete = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    Toast.show({ type: 'success', text1: 'Namaste 🙏', text2: `Session Complete! You focused for ${formatTime(elapsedTime)}.` });
    router.back();
  };

  const togglePause = async () => {
    setIsPaused(!isPaused);
    if (sound) {
      if (!isPaused) await sound.pauseAsync();
      else await sound.playAsync();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#3B82F6', '#1E3A8A']} style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleComplete} style={styles.closeBtn}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Box Breathing</Text>
          <View style={{width: 48}} />
        </View>

        <View style={styles.sessionContent}>
          <View style={styles.breathAnimContainer}>
            <Animated.View style={[styles.breathCircle, { transform: [{scale: breathAnim}] }]} />
            
            <Animated.View style={[styles.floatingIcon1, { transform: [{translateY: floatAnim1}] }]}>
               <MaterialCommunityIcons name="weather-windy" size={32} color="rgba(255,255,255,0.4)" />
            </Animated.View>
            <Animated.View style={[styles.floatingIcon2, { transform: [{translateY: floatAnim2}] }]}>
               <Ionicons name="leaf" size={28} color="rgba(255,255,255,0.3)" />
            </Animated.View>

            <View style={styles.breathInnerCircle}>
              <Text style={styles.breathPhaseText}>{breathPhase}</Text>
            </View>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsLabel}>HOW THIS HELPS</Text>
          <Animated.Text style={[styles.benefitsText, { opacity: benefitFade }]}>
            {BENEFITS[benefitIndex]}
          </Animated.Text>
        </View>

        <View style={styles.controlsContainer}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.elapsedLabel}>ELAPSED</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.playPauseBtn} onPress={togglePause}>
              <Ionicons name={isPaused ? "play" : "pause"} size={40} color="#1E3A8A" style={{marginLeft: isPaused ? 4 : 0}} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.stopBtn} onPress={handleComplete}>
              <Ionicons name="square" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#3B82F6' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },

  sessionContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  breathAnimContainer: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center' },
  breathCircle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)' },
  
  floatingIcon1: { position: 'absolute', top: 20, left: 40 },
  floatingIcon2: { position: 'absolute', bottom: 30, right: 30 },

  breathInnerCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 12}, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
  breathPhaseText: { fontSize: 26, fontWeight: '800', color: '#1E3A8A' },

  benefitsContainer: { height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  benefitsLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 8 },
  benefitsText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', fontStyle: 'italic' },

  controlsContainer: { padding: 30, alignItems: 'center' },
  timeText: { fontSize: 72, fontWeight: '800', color: '#fff', fontVariant: ['tabular-nums'], marginBottom: 4 },
  elapsedLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, marginBottom: 20 },
  
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  playPauseBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  stopBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }
});
