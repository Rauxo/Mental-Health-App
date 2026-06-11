import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', title: 'Quick Calm', subtitle: 'Grounding & Stress Reset', icon: 'leaf-outline', route: '/meditation/grounding', color: '#10B981' },
  { id: '2', title: 'Breathing & Meditation', subtitle: 'Box breathing, deep breaths', icon: 'water-outline', route: '/meditation/breathing', color: '#3B82F6' },
  { id: '3', title: 'Focus', subtitle: 'Music & Open-ended focus', icon: 'bulb-outline', route: '/meditation/focus', color: '#F59E0B' },
  { id: '4', title: 'Mindful Walking', subtitle: 'Guided walking sessions', icon: 'walk-outline', route: '/meditation/walking', color: '#8B5CF6' },
  { id: '5', title: 'Sleep Relax', subtitle: 'Deep sleep & night sounds', icon: 'moon-outline', route: '/meditation/sleep', color: '#6366F1' },
];

export default function MeditationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient]} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wellness & Focus</Text>
          <Text style={styles.subtitle}>Choose your path to tranquility.</Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.cardContainer}
              onPress={() => router.push(cat.route as any)}
            >
              <View style={styles.card}>
                <View style={[styles.cardIconWrapper, { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }]}>
                  <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bgGradient: {
    backgroundColor: '#F8FAFC',
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.15,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: "#3B82F6",
    top: -80,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: "#10B981",
    bottom: 100,
    left: -60,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: "#F59E0B",
    bottom: -30,
    right: 40,
    opacity: 0.3,
  },
  container: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
  },
  cardIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
