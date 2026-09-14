import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" /> 
      <Stack.Screen name="add-task" />
      <Stack.Screen name="add-team-task" />
      <Stack.Screen name="task/[id]" />
      <Stack.Screen name="performance-report" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="export-tasks" options={{ presentation: 'modal' }} />
      <Stack.Screen name="create-workspace" options={{ presentation: 'modal' }} />
      <Stack.Screen name="join-workspace" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
