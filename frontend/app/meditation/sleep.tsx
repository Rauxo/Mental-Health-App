import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const BENEFITS = [
  "Quiets racing thoughts before bed...",
  "Releases physical tension in your body...",
  "Signals to your brain that it's time to rest...",
  "Promotes deeper, more restorative sleep...",
  "Helps regulate your circadian rhythm..."
];

export default function SleepScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [benefitIndex, setBenefitIndex] = useState(0);

  const starAnim1 = useRef(new Animated.Value(0)).current;
  const starAnim2 = useRef(new Animated.Value(0)).current;
  const moonAnim = useRef(new Animated.Value(1)).current;
  const benefitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(starAnim1, { toValue: 0.3, duration: 2000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim2, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(starAnim2, { toValue: 0.3, duration: 3000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moonAnim, { toValue: 1.05, duration: 4000, useNativeDriver: true }),
        Animated.timing(moonAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
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
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const startSession = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
         require('../../assets/music.mpeg'),
         { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
    } catch (err) {}
  };

  const handleStopSession = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    Toast.show({ type: 'success', text1: 'Good Night 🌙', text2: 'Sleep session ended.' });
    router.back();
  };

  const togglePlayPause = async () => {
    setIsPlaying(!isPlaying);
    if (sound) {
      if (!isPlaying) await sound.playAsync();
      else await sound.pauseAsync();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0F172A', '#020617']} style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleStopSession} style={styles.closeBtn}>
            <Ionicons name="close" size={32} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.sessionContent}>
          <Animated.View style={[styles.moonGlow, { transform: [{scale: moonAnim}] }]}>
            <Ionicons name="moon" size={100} color="#818CF8" />
          </Animated.View>

          <Animated.View style={[styles.star1, { opacity: starAnim1 }]}>
             <Ionicons name="star" size={24} color="#FDE047" />
          </Animated.View>
          <Animated.View style={[styles.star2, { opacity: starAnim2 }]}>
             <Ionicons name="star" size={16} color="#FDE047" />
          </Animated.View>
          
          <Text style={styles.sessionTitle}>Deep Sleep</Text>
          <Text style={styles.sessionSubtitle}>Relax, breathe, and drift away...</Text>
          <Text style={styles.openEndedText}>Audio runs until you stop it</Text>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsLabel}>HOW THIS HELPS</Text>
          <Animated.Text style={[styles.benefitsText, { opacity: benefitFade }]}>
            {BENEFITS[benefitIndex]}
          </Animated.Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="#fff" style={{marginLeft: isPlaying ? 0 : 6}} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.stopSessionBtn} onPress={handleStopSession}>
            <Text style={styles.stopSessionText}>End Session</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'flex-start' },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24 },
  
  sessionContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  moonGlow: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(129, 140, 248, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 40, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.2)' },
  
  star1: { position: 'absolute', top: 100, right: 60 },
  star2: { position: 'absolute', bottom: 250, left: 80 },

  sessionTitle: { fontSize: 36, fontWeight: '800', color: '#F8FAFC', marginBottom: 12 },
  sessionSubtitle: { fontSize: 18, color: '#94A3B8', marginBottom: 24 },
  openEndedText: { fontSize: 14, color: '#64748B', fontWeight: '500', fontStyle: 'italic', marginBottom: 20 },

  benefitsContainer: { height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 20 },
  benefitsLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 8 },
  benefitsText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', fontStyle: 'italic' },
  
  controlsRow: { padding: 40, alignItems: 'center', paddingBottom: 60, gap: 32 },
  playPauseBtn: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(129, 140, 248, 0.2)', borderWidth: 2, borderColor: '#818CF8', alignItems: 'center', justifyContent: 'center' },
  stopSessionBtn: { paddingHorizontal: 32, paddingVertical: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 24, borderWidth: 1, borderColor: '#EF4444' },
  stopSessionText: { color: '#EF4444', fontWeight: '700', fontSize: 18 }
});
