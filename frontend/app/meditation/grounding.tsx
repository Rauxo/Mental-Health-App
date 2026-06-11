import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const GROUNDING_STEPS = [
  { count: 5, action: 'Things you can see', desc: 'Look around and notice 5 things you can see.', icon: 'eye-outline' },
  { count: 4, action: 'Things you can feel', desc: 'Notice 4 things you can feel or touch.', icon: 'hand-left-outline' },
  { count: 3, action: 'Things you can hear', desc: 'Listen carefully for 3 things you can hear.', icon: 'ear-outline' },
  { count: 2, action: 'Things you can smell', desc: 'Notice 2 things you can smell right now.', icon: 'flower-outline' },
  { count: 1, action: 'Thing you can taste', desc: 'Notice 1 thing you can taste.', icon: 'restaurant-outline' },
  { count: 0, action: 'Breathe', desc: 'Take a deep breath. You are grounded and present.', icon: 'leaf-outline' }
];

const BENEFITS = [
  "Interrupts anxious thought loops...",
  "Brings you back to the present moment...",
  "Lowers your resting heart rate...",
  "Activates your relaxation response...",
  "Helps detach from emotional distress..."
];

export default function GroundingScreen() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [benefitIndex, setBenefitIndex] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const benefitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, { toValue: -15, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim1, { toValue: 0, duration: 2000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, { toValue: 15, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim2, { toValue: 0, duration: 2500, useNativeDriver: true })
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

    return () => clearInterval(benefitInterval);
  }, []);

  const nextStep = () => {
    if (currentStepIndex < GROUNDING_STEPS.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setCurrentStepIndex(prev => prev + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    } else {
      completeActivity();
    }
  };

  const completeActivity = async () => {
    Toast.show({ type: 'success', text1: 'Namaste 🙏', text2: `Completed Quick Calm.` });
    router.back();
  };

  const currentStep = GROUNDING_STEPS[currentStepIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#10B981', '#059669']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            
            <View style={styles.iconCluster}>
              <Animated.View style={{ transform: [{translateY: floatAnim1}] }}>
                <Ionicons name={currentStep.icon as any} size={40} color="rgba(255,255,255,0.6)" style={styles.sideIcon1} />
              </Animated.View>
              
              {currentStep.count > 0 ? (
                <View style={styles.countCircle}>
                  <Text style={styles.countText}>{currentStep.count}</Text>
                </View>
              ) : (
                <View style={styles.countCircle}>
                  <Ionicons name="leaf" size={48} color="#10B981" />
                </View>
              )}

              <Animated.View style={{ transform: [{translateY: floatAnim2}] }}>
                <Ionicons name={currentStep.icon as any} size={30} color="rgba(255,255,255,0.4)" style={styles.sideIcon2} />
              </Animated.View>
            </View>

            <Text style={styles.stepAction}>{currentStep.action}</Text>
            <Text style={styles.stepDesc}>{currentStep.desc}</Text>
          </Animated.View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsLabel}>HOW THIS HELPS</Text>
          <Animated.Text style={[styles.benefitsText, { opacity: benefitFade }]}>
            {BENEFITS[benefitIndex]}
          </Animated.Text>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.actionButton} onPress={nextStep}>
            <Text style={styles.actionButtonText}>
              {currentStepIndex < GROUNDING_STEPS.length - 1 ? 'Next Step' : 'Finish'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#059669" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#10B981' },
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'flex-start' },
  closeButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  
  iconCluster: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  sideIcon1: { marginRight: -20, marginTop: 40 },
  sideIcon2: { marginLeft: -20, marginBottom: 40 },
  
  countCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10, zIndex: 10 },
  countText: { fontSize: 56, fontWeight: '800', color: '#059669' },
  
  stepAction: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 16 },
  stepDesc: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 28 },
  
  benefitsContainer: { height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  benefitsLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 8 },
  benefitsText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', fontStyle: 'italic' },

  bottomControls: { padding: 30, alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, gap: 10 },
  actionButtonText: { fontSize: 20, fontWeight: '700', color: '#059669' }
});
