'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Waves, Shield, CheckCircle, Loader2, ArrowLeft, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { signIn, signInWithGoogle, createUser, auth, getUserProfile } from '@/lib/firebase';
import { sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';

type AuthError = {
  message: string;
  code?: string;
};

type AuthMode = 'signin' | 'signup' | 'reset';

export function AnimatedAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [resetEmail, setResetEmail] = useState('');

  // Check URL parameters to determine initial state
  useEffect(() => {
    const mode = searchParams.get('mode') as AuthMode;
    const message = searchParams.get('message');
    
    if (mode === 'signup' || mode === 'signin' || mode === 'reset') {
      setAuthMode(mode);
    } else {
      setAuthMode('signin');
    }
    
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  // Update URL when changing modes
  const handleModeChange = (newMode: AuthMode) => {
    setAuthMode(newMode);
    setError(null);
    setSuccess(null);
    router.push(`/auth?mode=${newMode}`);
  };

  // Toggle between signin and signup
  const handleToggle = () => {
    const newMode = authMode === 'signin' ? 'signup' : 'signin';
    handleModeChange(newMode);
  };

  // Sign In handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await signIn(signInData.email, signInData.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Your email is not verified. Please check your inbox for a verification link.');
        setLoading(false);
        return;
      }
      
      router.push('/dashboard');
    } catch (error: unknown) {
      const authError = error as AuthError;
      
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (authError.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (authError.code === 'auth/too-many-requests') {
        setError('Too many unsuccessful login attempts. Please try again later.');
      } else if (authError.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError(authError.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Up handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await createUser(signUpData.email, signUpData.password, {
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
        role: 'user',
      });

      if (auth.currentUser) {
        const actionCodeSettings = {
          url: `${window.location.origin}/auth?mode=signin&message=Email verified successfully`,
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        setSuccess('Account created! Please check your email for verification.');
        setAuthMode('signin');
        router.push('/auth?mode=signin&message=Account created! Please verify your email.');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      
      if (authError.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try signing in instead.');
      } else if (authError.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check your email and try again.');
      } else if (authError.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(authError.message || 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password Reset handler
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: `${window.location.origin}/auth?mode=signin&message=Password reset successfully`,
        handleCodeInApp: true,
      });
      
      setSuccess('Check your email for a password reset link');
    } catch (error: unknown) {
      const authError = error as AuthError;
      if (authError.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError(authError.message || 'An error occurred sending the reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || 'An error occurred with Google sign in');
      setLoading(false);
    }
  };

  const isSignUp = authMode === 'signup';
  const isReset = authMode === 'reset';

  return (
    <div className="min-h-screen w-full flex items-center justify-center">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Error and Success Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm backdrop-blur-sm">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="float-right ml-2 text-red-300 hover:text-red-100"
                >
                  ×
                </button>
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-3 rounded-lg text-sm backdrop-blur-sm">
                {success}
                <button 
                  onClick={() => setSuccess(null)}
                  className="float-right ml-2 text-green-300 hover:text-green-100"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Password Reset Form */}
        {isReset && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-white/70 text-sm">Enter your email to receive a password reset link</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Mail className="w-5 h-5 mr-2" />}
                Send Reset Email
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => handleModeChange('signin')}
                className="text-sm text-cyan-300 hover:text-cyan-200 hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Container */}
        {!isReset && (
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            
            {/* Sliding Overlay Panel */}
            <div className={clsx(
              'absolute top-0 w-1/2 h-full bg-gradient-to-br from-cyan-500 to-blue-600 transition-all duration-700 ease-in-out z-10 rounded-3xl shadow-2xl',
              isSignUp ? 'left-0' : 'left-1/2'
            )}>
              <div className="h-full flex flex-col items-center justify-center text-white p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Waves className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                      {isSignUp ? 'Welcome!' : 'Welcome Back!'}
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {isSignUp 
                        ? 'New to WaveGuard? Create an account to start protecting your community.'
                        : 'Already have an account? Sign in to access your coastal protection dashboard.'
                      }
                    </p>
                  </div>

                  <button
                    onClick={handleToggle}
                    disabled={loading}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>

                  {/* Features */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Real-time threat monitoring</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>AI-powered predictions</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Community protection network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Static Forms */}
          <div className="flex min-h-[600px]">
            
            {/* Sign Up Form - Left */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <div className={clsx(
                'transition-all duration-700 ease-in-out',
                isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
                  <p className="text-white/70 text-sm">Join the coastal protection network</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        placeholder="First Name"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      placeholder="Confirm Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                    Create Account
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/70">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Google
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign In Form - Right */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <div className={clsx(
                'transition-all duration-700 ease-in-out',
                !isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                  <p className="text-white/70 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400" />
                      <span className="ml-2 text-sm text-white/70">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleModeChange('reset')}
                      className="text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                    Sign In
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/70">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Bottom Brand */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Waves className="w-5 h-5" />
            <span className="text-sm font-semibold">WaveGuard - Coastal Protection AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
