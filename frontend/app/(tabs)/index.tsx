import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import apiClient from '../../api/client';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

const AFFIRMATIONS = [
  "I am calm and in control.",
  "Today is a fresh start.",
  "I choose peace over worry.",
  "Every breath brings peace.",
  "I am improving every day.",
  "I am worthy of peace, love, and joy.",
  "I allow myself to rest."
];

const DAILY_TIPS = [
  { id: '1', title: 'Wellness Tip', text: 'Drink a glass of water when you wake up to hydrate your brain.', icon: 'water-outline' },
  { id: '2', title: 'Motivational Quote', text: '"The secret of getting ahead is getting started." - Mark Twain', icon: 'bulb-outline' },
];

function getRecommendation() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) {
    return { title: 'Morning Meditation', reason: 'Start your day with clarity and focus.', route: '/meditation/breathing?session=Morning Meditation' };
  } else if (hour >= 10 && hour < 17) {
    return { title: 'Focus Music', reason: 'Stay productive with an open-ended session.', route: '/meditation/focus' };
  } else if (hour >= 17 && hour < 21) {
    return { title: '5-4-3-2-1 Grounding', reason: 'Unwind from work and reset your stress levels.', route: '/meditation/grounding' };
  } else {
    return { title: 'Sleep Relax', reason: 'Prepare your mind and body for a deep sleep.', route: '/meditation/sleep' };
  }
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState(AFFIRMATIONS[0]);
  const [tips, setTips] = useState(DAILY_TIPS);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.name?.split(' ')[0] || user?.username || user?.email?.split('@')[0] || '';
  const greeting = getGreeting();
  const [recommendation, setRecommendation] = useState<any>(getRecommendation());

  const refreshData = () => {
    setDailyAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
    setRecommendation(getRecommendation());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    refreshData();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#E0F2FE' }]} />
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4facfe" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}{firstName ? `, ${firstName}` : ''}!</Text>
          <Text style={styles.subtitle}>Welcome to your safe space</Text>
        </View>

        {recommendation && (
          <View style={styles.recommendationCard}>
            <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.recommendationGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.recommendationHeader}>
                <MaterialCommunityIcons name="robot-outline" size={24} color="#0EA5E9" />
                <Text style={styles.recommendationTitle}>AI Recommended For You</Text>
              </View>
              
              <View style={styles.recActivityRow}>
                <View style={{flex: 1, paddingRight: 12}}>
                  <Text style={styles.recActivityTitle}>{recommendation.title}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.recStartButton} 
                  onPress={() => router.push(recommendation.route as any)}
                >
                  <Text style={styles.recStartText}>Start</Text>
                  <Ionicons name="play" size={16} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.recReasonBox}>
                <Ionicons name="information-circle-outline" size={16} color="#0EA5E9" />
                <Text style={styles.recReasonText}>{recommendation.reason}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.mainActionCard} onPress={() => router.push('/journal')}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="book" size={32} color="#fff" />
              <Text style={styles.mainActionTitle}>Daily Journal</Text>
              <Text style={styles.mainActionSubtitle}>Write your feelings</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainActionCard} onPress={() => router.push('/ai-chat')}>
            <LinearGradient colors={['#00f2fe', '#4facfe']} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="chatbubbles" size={32} color="#fff" />
              <Text style={styles.mainActionTitle}>AI Therapist</Text>
              <Text style={styles.mainActionSubtitle}>Talk it out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Affirmation</Text>
          <TouchableOpacity onPress={refreshData}>
            <Ionicons name="refresh" size={24} color="#4facfe" />
          </TouchableOpacity>
        </View>

        <View style={styles.affirmationCard}>
          <Ionicons name="heart" size={28} color="#F43F5E" style={styles.affirmationIcon} />
          <Text style={styles.affirmationText}>"{dailyAffirmation}"</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Wellness & Growth</Text>
        </View>

        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name={tip.icon as any} size={24} color="#4facfe" />
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}

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
    paddingTop: 80,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  mainActionCard: {
    width: '48%',
    height: 140,
    borderRadius: 24,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  mainActionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  mainActionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  tipCard: {
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  tipText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
  },
  recommendationCard: {
    marginBottom: 32,
    borderRadius: 24,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationTitle: {
    color: '#0369A1',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  recActivityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recActivityTitle: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '800',
  },
  recStartButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  recStartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  recReasonBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  recReasonText: {
    color: '#0369A1',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  affirmationCard: {
    backgroundColor: '#FFF1F2',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  affirmationIcon: {
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BE123C',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  }
});
