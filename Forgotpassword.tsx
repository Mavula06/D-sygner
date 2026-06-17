// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { resetPasswordSchema, ResetPasswordFormData } from '../../lib/validation/schemas';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await authService.resetPassword(data.email);
      setSent(true);
    } catch (error: any) {
      let msg = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email address.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.content}>
          {sent ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="mail-outline" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSubtitle}>
                We've sent password reset instructions to your email. Check your spam folder if you don't see it.
              </Text>
              <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/(auth)/login')}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Back to Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputWrapper}>
                      <TextInput
                        label="Email address"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="outlined"
                        outlineColor={Colors.border}
                        activeOutlineColor={Colors.primary}
                        textColor={Colors.white}
                        style={styles.input}
                        theme={{ colors: { background: Colors.card } }}
                        left={<TextInput.Icon icon="email-outline" color={Colors.textMuted} />}
                      />
                      {errors.email && (
                        <Text style={styles.errorText}>{errors.email.message}</Text>
                      )}
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={[Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.btnText}>Send Reset Link</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.lg },
  back: {
    marginTop: 60, marginBottom: Spacing.xl, width: 44, height: 44,
    borderRadius: 22, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1 },
  title: { fontSize: 34, fontWeight: '900', color: Colors.white, letterSpacing: -0.8, marginBottom: Spacing.md },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted, lineHeight: 24, marginBottom: Spacing.xl },
  form: { gap: Spacing.md },
  inputWrapper: { gap: 4 },
  input: { backgroundColor: Colors.card, fontSize: FontSize.md },
  errorText: { color: Colors.error, fontSize: FontSize.xs, marginLeft: 4 },
  submitBtn: { borderRadius: BorderRadius.md, overflow: 'hidden', marginTop: Spacing.sm },
  btnGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center', minHeight: 56 },
  btnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700', letterSpacing: 0.3 },
  successContainer: { alignItems: 'center', paddingTop: 40 },
  successIcon: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: `${Colors.primary}15`,
    borderWidth: 1.5, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  successTitle: { fontSize: 28, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: Spacing.md },
  successSubtitle: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  backToLogin: { width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden' },
});
