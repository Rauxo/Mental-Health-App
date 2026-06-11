import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JourneyScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchJourney = async () => {
    try {
      const res = await apiClient.get('/journey');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch journey data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJourney();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4facfe" />
        <Text style={{ marginTop: 10, color: '#64748B' }}>Analyzing your mental wellness journey...</Text>
      </View>
    );
  }

  const renderEntryList = (title: string, entries: any[], renderItem: (item: any) => JSX.Element) => (
    entries && entries.length > 0 ? (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {entries.map((item, idx) => (
          <View key={idx} style={styles.entryRow}>
            {renderItem(item)}
            <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    ) : null
  );

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
          <Text style={styles.title}>Your Journey</Text>
          <Text style={styles.subtitle}>AI-driven analysis of your mental condition.</Text>
        </View>

        {data ? (
          <>
            {/* Score Card */}
            <View style={styles.card}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{data.score}</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreLabel}>Wellness Score</Text>
                  <Text style={styles.scoreDesc}>
                    {data.score >= 80 ? 'Excellent' : data.score >= 50 ? 'Moderate' : 'Needs Attention'}
                  </Text>
                </View>
              </View>
            </View>



            {/* AI Analysis */}
            <View style={styles.aiCardContainer}>
              <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.aiCard}>
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.aiTitle}>AI Feedback</Text>
                </View>
                <Text style={styles.aiText}>{data.analysis}</Text>
              </LinearGradient>
            </View>

            {/* Suggestions */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Actionable Steps</Text>
              {data.suggestions && data.suggestions.map((suggestion: string, idx: number) => (
                <View key={idx} style={styles.suggestionRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4facfe" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>

            {/* Mood entries */}
            {renderEntryList('Recent Moods', data.moods, (item) => (
              <Text style={styles.entryText}>Mood: {item.mood} (Intensity: {item.intensity})</Text>
            ))}

            {/* Journal entries */}
            {renderEntryList('Recent Journals', data.journals, (item) => (
              <Text style={styles.entryText}>{item.content}</Text>
            ))}

            {/* Meditation entries */}
            {renderEntryList('Recent Meditations', data.meditations, (item) => (
              <Text style={styles.entryText}>Category: {item.category}, Duration: {item.duration}s</Text>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available.</Text>
        )}
        
        <View style={{height: 100}} />
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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#4facfe',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  scoreInfo: {
    marginLeft: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  scoreDesc: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  aiCardContainer: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  aiCard: {
    padding: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  aiText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    opacity: 0.95,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  suggestionText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 172, 254, 0.1)',
  },
  entryText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    marginRight: 10,
  },
  entryDate: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  }
});
