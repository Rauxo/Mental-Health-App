import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const PROMPTS = [
  "Notice your footsteps...\nFeel the solid ground beneath supporting you.",
  "Observe your surroundings...\nLet colors and shapes pass without judgment.",
  "Take slow, deep breaths...\nFind a rhythm that matches your stride.",
  "Feel the air against your skin...\nNotice the gentle breeze around you.",
  "Listen to the sounds nearby...\nLet them wash over you naturally.",
  "Let your arms swing freely...\nRelease any tension in your shoulders.",
  "Focus on the heel-to-toe movement...\nStay present in this very moment.",
  "Shift your attention to your breathing...\nInhale deeply, exhale completely."
];

const BENEFITS = [
  "Releases mood-boosting endorphins...",
  "Clears mental fog and improves clarity...",
  "Reduces physical and mental tension...",
  "Increases blood flow to the brain...",
  "Connects you to your physical body..."
];

export default function WalkingScreen() {
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [benefitIndex, setBenefitIndex] = useState(0);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const benefitFade = useRef(new Animated.Value(1)).current;
  
  const cloudAnim1 = useRef(new Animated.Value(-100)).current;
  const cloudAnim2 = useRef(new Animated.Value(width)).current;
  const leafAnim = useRef(new Animated.Value(0)).current;
  const sunPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Footprint walking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 15, duration: 1200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -15, duration: 1200, useNativeDriver: true })
      ])
    ).start();

    // Drifting clouds
    Animated.loop(
      Animated.timing(cloudAnim1, { toValue: width + 100, duration: 25000, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.timing(cloudAnim2, { toValue: -100, duration: 35000, useNativeDriver: true })
    ).start();

    // Swaying leaf
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(leafAnim, { toValue: -1, duration: 3000, useNativeDriver: true })
      ])
    ).start();

    // Pulsing sun
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulse, { toValue: 1.1, duration: 4000, useNativeDriver: true }),
        Animated.timing(sunPulse, { toValue: 1, duration: 4000, useNativeDriver: true })
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

    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Cycle prompt every 20 seconds
        if (newTime % 20 === 0) {
          cyclePrompt();
        }
        return newTime;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(benefitInterval);
    };
  }, []);

  const cyclePrompt = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start(() => {
      setPromptIndex(prev => (prev + 1) % PROMPTS.length);
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
    });
  };

  const handleComplete = () => {
    Toast.show({ type: 'success', text1: 'Great Walk! 👟', text2: `You walked mindfully for ${formatTime(elapsedTime)}.` });
    router.back();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const leafRotation = leafAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg']
  });

  return (
    <SafeAreaView style={styles.activeSafeArea}>
      <LinearGradient colors={['#34d399', '#059669']} style={styles.activeGradient}>
        
        {/* Animated Background Elements */}
        <Animated.View style={[styles.cloud, { top: 80, transform: [{translateX: cloudAnim1}] }]}>
          <Ionicons name="cloud" size={80} color="rgba(255,255,255,0.2)" />
        </Animated.View>
        <Animated.View style={[styles.cloud, { top: 180, transform: [{translateX: cloudAnim2}] }]}>
          <Ionicons name="cloud" size={120} color="rgba(255,255,255,0.15)" />
        </Animated.View>
        
        <Animated.View style={[styles.sun, { transform: [{scale: sunPulse}] }]}>
          <Ionicons name="sunny" size={150} color="rgba(252, 211, 77, 0.2)" />
        </Animated.View>

        <Animated.View style={[styles.leaf, { transform: [{rotate: leafRotation}] }]}>
          <Ionicons name="leaf" size={40} color="rgba(255,255,255,0.3)" />
        </Animated.View>


        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.activeSessionTitle}>Mindful Walk</Text>
          <View style={{width: 44}} />
        </View>

        <View style={styles.activeContent}>
          <View style={styles.circleContainer}>
            <View style={[styles.pulseCircle, styles.pulseCircle1]} />
            <View style={[styles.pulseCircle, styles.pulseCircle2]} />
            
            <Animated.View style={[styles.innerCircle, { transform: [{translateX: slideAnim}] }]}>
              <MaterialCommunityIcons name="shoe-print" size={80} color="#059669" />
            </Animated.View>
          </View>

          <View style={styles.promptContainer}>
            <Animated.Text style={[styles.promptText, { opacity: fadeAnim }]}>
              {PROMPTS[promptIndex].split('\n')[0]}
            </Animated.Text>
            <Animated.Text style={[styles.promptSubtext, { opacity: fadeAnim }]}>
              {PROMPTS[promptIndex].split('\n')[1]}
            </Animated.Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsLabel}>HOW THIS HELPS</Text>
          <Animated.Text style={[styles.benefitsText, { opacity: benefitFade }]}>
            {BENEFITS[benefitIndex]}
          </Animated.Text>
        </View>

        <View style={styles.bottomTimerRow}>
          <Text style={styles.activeTimeText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.activeTimeLabel}>elapsed walking time</Text>
          
          <TouchableOpacity style={styles.finishBtn} onPress={handleComplete}>
            <Text style={styles.finishBtnText}>End Walk</Text>
            <Ionicons name="flag" size={20} color="#059669" />
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeSafeArea: { flex: 1, backgroundColor: '#34d399' },
  activeGradient: { flex: 1, padding: 20 },
  
  // Background animations
  cloud: { position: 'absolute', zIndex: 0 },
  sun: { position: 'absolute', top: -40, right: -40, zIndex: 0 },
  leaf: { position: 'absolute', bottom: '30%', left: 40, zIndex: 0 },

  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, zIndex: 10 },
  cancelBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24 },
  activeSessionTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  
  activeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  circleContainer: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  pulseCircle: { position: 'absolute', width: '100%', height: '100%', borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.15)' },
  pulseCircle1: { transform: [{scale: 1.25}] },
  pulseCircle2: { transform: [{scale: 1.55}], opacity: 0.4 },
  innerCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 12}, shadowOpacity: 0.25, shadowRadius: 20, elevation: 12 },
  
  promptContainer: { height: 120, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  promptText: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12, lineHeight: 40 },
  promptSubtext: { fontSize: 20, fontWeight: '500', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontStyle: 'italic', lineHeight: 28 },

  benefitsContainer: { height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  benefitsLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 8 },
  benefitsText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', fontStyle: 'italic' },

  bottomTimerRow: { alignItems: 'center', paddingBottom: 20, zIndex: 10 },
  activeTimeText: { fontSize: 72, fontWeight: '800', color: '#fff', fontVariant: ['tabular-nums'] },
  activeTimeLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 40, fontWeight: '700' },
  finishBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 36, paddingVertical: 18, backgroundColor: '#fff', borderRadius: 30, shadowColor: '#000', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  finishBtnText: { fontSize: 20, fontWeight: '800', color: '#059669' }
});
