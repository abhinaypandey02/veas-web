import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Screen } from "../components/Screen";
import { useAuth } from "../state/auth";

export function LoginScreen({ navigation }: { navigation: any }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="space-y-7">
          <View className="space-y-2">
            <Text className="text-xs uppercase tracking-[0.4em] text-muted">
              Veas Astrology
            </Text>
            <Text className="text-4xl font-serif text-foreground">Welcome back</Text>
            <Text className="text-sm text-muted">
              Sign in to continue your journey with the real sky.
            </Text>
          </View>

          <Card className="space-y-4" variant="soft">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
            />

            {error ? <Text className="text-xs text-red-500">{error}</Text> : null}

            <Button
              title={loading ? "Signing in..." : "Sign in"}
              onPress={handleLogin}
              loading={loading}
            />
          </Card>

          <View className="items-center">
            <Text className="text-xs text-muted">
              New here?{" "}
              <Text
                className="text-foreground underline"
                onPress={() => navigation.navigate("Signup")}
              >
                Create an account
              </Text>
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-[11px] text-muted uppercase tracking-[0.22em]">
              Social login coming soon
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
