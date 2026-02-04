import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Screen } from "../components/Screen";
import { useAuth } from "../state/auth";

export function SignupScreen({ navigation }: { navigation: any }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    if (!email || !password) {
      setError("Please enter an email and password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password);
    } catch (err) {
      setError((err as Error).message || "Signup failed");
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
            <Text className="text-4xl font-serif text-foreground">Join veas</Text>
            <Text className="text-sm text-muted">
              Create your account in minutes and meet your true sky.
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
              placeholder="Create a password"
              secureTextEntry
            />
            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              secureTextEntry
            />

            {error ? <Text className="text-xs text-red-500">{error}</Text> : null}

            <Button
              title={loading ? "Creating..." : "Sign up"}
              onPress={handleSignup}
              loading={loading}
            />
          </Card>

          <View className="items-center">
            <Text className="text-xs text-muted">
              Already have an account?{" "}
              <Text
                className="text-foreground underline"
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
