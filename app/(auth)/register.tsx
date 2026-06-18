// app/(auth)/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, ActivityIndicator, SegmentedButtons, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { registerSchema, RegisterFormData } from '../../lib/validation/schemas';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      agreeToTerms: false,
    },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authService.register(data.email, data.password, data.displayName, data.role as any);
      // Auth listener in _layout handles redirect
    } catch (error: any) {
      let msg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>D,sygner</Text>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join thousands of professionals</Text>
        </View>

        <View style={styles.form}>
          {/* Role Selector */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View style={styles.roleContainer}>
                <Text style={styles.label}>I want to</Text>
                <View style={styles.roleButtons}>
                  {[
                    { value: 'customer', label: '🛍️ Book Services', icon: 'person' },
                    { value: 'provider', label: '🔧 Offer Services', icon: 'briefcase' },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.roleBtn,
                        value === opt.value && styles.roleBtnActive,
                      ]}
                      onPress={() => onChange(opt.value)}
                    >
                      <Text style={[
                        styles.roleBtnText,
                        value === opt.value && styles.roleBtnTextActive,
                      ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputWrapper}>
                <TextInput
                  label="Full name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  mode="outlined"
                  outlineColor={Colors.border}
                  activeOutlineColor={Colors.primary}
                  textColor={Colors.white}
                  style={styles.input}
                  theme={{ colors: { background: Colors.card } }}
                  left={<TextInput.Icon icon="account-outline" color={Colors.textMuted} />}
                />
                {errors.displayName && (
                  <Text style={styles.errorText}>{errors.displayName.message}</Text>
                )}
              </View>
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputWrapper}>
                <TextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  outlineColor={Colors.border}
                  activeOutlineColor={Colors.primary}
                  textColor={Colors.white}
                  style={styles.input}
                  theme={{ colors: { background: Colors.card } }}
                  left={<TextInput.Icon icon="lock-outline" color={Colors.textMuted} />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      color={Colors.textMuted}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputWrapper}>
                <TextInput
                  label="Confirm password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showConfirm}
                  mode="outlined"
                  outlineColor={Colors.border}
                  activeOutlineColor={Colors.primary}
                  textColor={Colors.white}
                  style={styles.input}
                  theme={{ colors: { background: Colors.card } }}
                  left={<TextInput.Icon icon="lock-check-outline" color={Colors.textMuted} />}
                  right={
                    <TextInput.Icon
                      icon={showConfirm ? 'eye-off' : 'eye'}
                      color={Colors.textMuted}
                      onPress={() => setShowConfirm(!showConfirm)}
                    />
                  }
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
              </View>
            )}
          />

          {/* Terms */}
          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => onChange(!value)}
                activeOpacity={0.7}
              >
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() => onChange(!value)}
                  color={Colors.primary}
                  uncheckedColor={Colors.border}
                />
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={{ color: Colors.primary }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: Colors.primary }}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            )}
          />
          {errors.agreeToTerms && (
            <Text style={[styles.errorText, { marginTop: -Spacing.sm }]}> 
              {errors.agreeToTerms.message}
            </Text>
          )}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  back: {
    marginTop: 60,
    marginBottom: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { marginBottom: Spacing.xl },
  logo: { fontSize: 22, fontWeight: '900', color: Colors.primary, letterSpacing: -0.5, marginBottom: Spacing.lg },
  title: { fontSize: 34, fontWeight: '900', color: Colors.white, letterSpacing: -0.8, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted },
  form: { gap: Spacing.md },
  label: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.sm },
  roleContainer: { gap: 4 },
  roleButtons: { flexDirection: 'row', gap: Spacing.sm },
  roleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  roleBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  roleBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  roleBtnTextActive: { color: Colors.primary },
  inputWrapper: { gap: 4 },
  input: { backgroundColor: Colors.card, fontSize: FontSize.md },
  errorText: { color: Colors.error, fontSize: FontSize.xs, marginLeft: 4 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  termsText: { flex: 1, color: Colors.textMuted, fontSize: FontSize.sm, lineHeight: 20 },
  submitBtn: { borderRadius: BorderRadius.md, overflow: 'hidden', marginTop: Spacing.sm },
  btnGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center', minHeight: 56 },
  submitText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700', letterSpacing: 0.3 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  footerText: { color: Colors.textMuted, fontSize: FontSize.md },
  footerLink: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
});
