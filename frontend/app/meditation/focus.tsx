import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const FOCUS_TEXTS = [
  "Immerse yourself in deep work...",
  "Embrace the silence, let distractions fade...",
  "One task at a time. Stay present...",
  "Your focus determines your reality...",
  "Breathe in clarity, breathe out chaos...",
  "Direct your energy to what matters most...",
  "Protect your attention, it is your greatest asset...",
  "Let go of the noise, hone in on the signal...",
  "Small steps of focus lead to giant leaps...",
  "You are capable of intense concentration...",
  "Clear your mind, zero in on your goal...",
  "Flow state engaged. Keep the momentum..."
];

const BENEFITS = [
  "Trains your brain for deep work...",
  "Improves cognitive endurance...",
  "Helps block out external distractions...",
  "Increases productivity and flow...",
  "Strengthens your attention span..."
];

export default function FocusScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [benefitIndex, setBenefitIndex] = useState(0);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const benefitFade = useRef(new Animated.Value(1)).current;
  
  // Particle sparks
  const spark1Y = useRef(new Animated.Value(height)).current;
  const spark2Y = useRef(new Animated.Value(height)).current;
  const spark3Y = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // Lightbulb pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true })
      ])
    ).start();

    // Floating Sparks
    const createSparkAnimation = (anim: Animated.Value, duration: number, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -100, duration: duration, useNativeDriver: true })
        ])
      ).start();
    };

    createSparkAnimation(spark1Y, 15000, 0);
    createSparkAnimation(spark2Y, 18000, 5000);
    createSparkAnimation(spark3Y, 22000, 2000);

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
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Change focus text every 15 seconds
          if (newTime % 15 === 0) {
            cycleText();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const cycleText = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      setTextIndex(prev => (prev + 1) % FOCUS_TEXTS.length);
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    });
  };

  const startSession = async () => {
    setIsTimerRunning(true);
    setIsPlaying(true);
    setElapsedTime(0);
    
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
         require('../../assets/music.mpeg'),
         { shouldPlay: true, isLooping: true },
         (status: any) => {
           if (status.isLoaded) setIsPlaying(status.isPlaying);
         }
      );
      setSound(newSound);
    } catch (err) {
      console.error("Failed to load sound", err);
    }
  };

  const togglePlayPause = async () => {
    setIsTimerRunning(!isTimerRunning);
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleCompleteTimer = async () => {
    setIsTimerRunning(false);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    Toast.show({ type: 'success', text1: 'Session Complete! 🎉', text2: `You focused for ${formatTime(elapsedTime)}.` });
    router.back();
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
      <LinearGradient colors={['#FDE68A', '#D97706']} style={styles.container}>
        
        {/* Animated Particles / Sparks */}
        <Animated.View style={[styles.spark, { left: width * 0.2, transform: [{translateY: spark1Y}] }]}>
          <Ionicons name="flash" size={24} color="rgba(255,255,255,0.3)" />
        </Animated.View>
        <Animated.View style={[styles.spark, { left: width * 0.8, transform: [{translateY: spark2Y}] }]}>
          <Ionicons name="star" size={16} color="rgba(255,255,255,0.4)" />
        </Animated.View>
        <Animated.View style={[styles.spark, { left: width * 0.5, transform: [{translateY: spark3Y}] }]}>
          <Ionicons name="sparkles" size={32} color="rgba(255,255,255,0.2)" />
        </Animated.View>

        <View style={styles.header}>
          <TouchableOpacity onPress={handleCompleteTimer} style={styles.closeBtn}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Deep Focus</Text>
          <View style={{width: 48}} />
        </View>

        <View style={styles.content}>
          <Animated.View style={[styles.pulseCircle, { transform: [{scale: pulseAnim}] }]}>
            <View style={styles.innerPulseCircle}>
              <Ionicons name="bulb" size={90} color="#D97706" />
            </View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Animated.Text style={[styles.subtext, { opacity: fadeAnim }]}>
              "{FOCUS_TEXTS[textIndex]}"
            </Animated.Text>
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
          <Text style={styles.elapsedLabel}>ELAPSED TIME</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="#D97706" style={{marginLeft: isPlaying ? 0 : 6}} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.stopBtn} onPress={handleCompleteTimer}>
              <Ionicons name="square" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDE68A' },
  container: { flex: 1 },
  spark: { position: 'absolute', zIndex: 0 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, zIndex: 10 },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  pulseCircle: { width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  innerPulseCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#D97706', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  
  textContainer: { height: 100, paddingHorizontal: 30, justifyContent: 'center' },
  subtext: { fontSize: 24, color: '#fff', fontWeight: '700', textAlign: 'center', fontStyle: 'italic', lineHeight: 34 },

  benefitsContainer: { height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  benefitsLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 8 },
  benefitsText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', fontStyle: 'italic' },

  controlsContainer: { padding: 30, alignItems: 'center', zIndex: 10 },
  timeText: { fontSize: 72, fontWeight: '800', color: '#fff', fontVariant: ['tabular-nums'], marginBottom: 4 },
  elapsedLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 3, marginBottom: 20, fontWeight: '800' },
  
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  playPauseBtn: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 },
  stopBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }
});
