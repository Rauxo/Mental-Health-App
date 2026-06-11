import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";
import Toast from 'react-native-toast-message';

const originalShow = Toast.show;
Toast.show = (options) => {
  return originalShow({
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
    ...options,
  });
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      setIsFirstLaunch(value === null);
    });
  }, []);

  useEffect(() => {
    if (isFirstLaunch === null) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    if (isFirstLaunch) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
    } else if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
    } else if (isAuthenticated) {
      if (inAuthGroup || inOnboarding) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, segments, isFirstLaunch]);

  if (isFirstLaunch === null) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthWrapper>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
          </Stack>
          <Toast swipeable={false} />
        </AuthWrapper>
      </QueryClientProvider>
    </Provider>
  );
}
