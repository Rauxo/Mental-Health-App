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

const TIPS = [
  { id: '1', title: '5-4-3-2-1 Grounding', text: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to stay present.', icon: 'leaf-outline' },
  { id: '2', title: 'Daily Affirmation', text: 'I am worthy of peace, love, and joy. I allow myself to rest.', icon: 'heart-outline' },
  { id: '3', title: 'Box Breathing', text: 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 4 times to calm your nervous system.', icon: 'water-outline' },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [tips, setTips] = useState(TIPS);
  const [loadingTips, setLoadingTips] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.name?.split(' ')[0] || user?.username || user?.email?.split('@')[0] || '';
  const greeting = getGreeting();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  const fetchTips = async () => {
    setLoadingTips(true);
    try {
      const response = await apiClient.get('/tips');
      if (response.data && response.data.length > 0) {
        setTips(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    } finally {
      setLoadingTips(false);
    }
  };

  const fetchRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      const response = await apiClient.get('/recommendations');
      if (response.data && response.data.recommendation) {
        setRecommendation(response.data.recommendation);
      }
    } catch (error) {
      console.error('Failed to fetch recommendation:', error);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  useEffect(() => {
    fetchTips();
    fetchRecommendation();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTips(), fetchRecommendation()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#E0F2FE' }]} />
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
          <Text style={styles.greeting}>{greeting}{firstName ? `, ${firstName}` : ''}!</Text>
          <Text style={styles.subtitle}>Welcome to your safe space</Text>
        </View>

        {recommendation && (
          <View style={styles.recommendationCard}>
            <LinearGradient colors={['#FDF2F8', '#FCE7F3']} style={styles.recommendationGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.recommendationHeader}>
                <MaterialCommunityIcons name="robot-outline" size={24} color="#EC4899" />
                <Text style={styles.recommendationTitle}>AI Suggests</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
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
          <Text style={styles.sectionTitle}>Daily Tips & Tricks</Text>
          <TouchableOpacity onPress={fetchTips} disabled={loadingTips}>
            <Ionicons name="refresh" size={24} color={loadingTips ? "#94a3b8" : "#4facfe"} />
          </TouchableOpacity>
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
    marginBottom: 24,
    borderRadius: 24,
    shadowColor: '#EC4899',
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
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    color: '#BE185D',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  recommendationText: {
    color: '#831843',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  }
});
