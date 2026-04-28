import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from './api/api.js';
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
const [userId, setUserId] = useState("");
const [otp, setOtp] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.mfaRequired) {
      setMfaRequired(true);
      setUserId(data.userId);
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/todo";
  } catch (error) {
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

const handleOtpLogin = async () => {
  try {
    const data = await apiRequest("/api/auth/mfa/login", {
      method: "POST",
      body: JSON.stringify({
        userId,
        token: otp,
      }),
    });

    localStorage.setItem("token", data.token);
    window.location.href = "/todo";
  } catch (err) {
    alert("Invalid OTP");
  }
};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(99, 102, 241, 0.5)',
        '0 0 40px rgba(99, 102, 241, 0.8)',
        '0 0 20px rgba(99, 102, 241, 0.5)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -50, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center mb-6 gap-2"
            variants={floatingVariants}
            animate="animate"
          >
            <Zap className="w-8 h-8 text-indigo-500" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              TaskMind
            </h1>
          </motion.div>
          <p className="text-gray-400 text-lg">Welcome back, creator</p>
        </motion.div>

        {/* Login card */}
        <motion.div
          variants={itemVariants}
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 blur-xl"
            variants={glowVariants}
            animate="animate"
          />

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

  {!mfaRequired ? (
    <>
      {/* Email */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-semibold text-white mb-3">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-indigo-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            required
          />
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-semibold text-white mb-3">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-indigo-500" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            required
          />
        </div>
      </motion.div>

      {/* Login Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg"
      >
        {isLoading ? "Loading..." : "Login"}
      </motion.button>
    </>
  ) : (
    <>
      {/* 🔐 OTP UI */}
      <motion.div variants={itemVariants} className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          🔐 MFA Verification
        </h3>
        <p className="text-gray-400 mb-4">
          Enter OTP from Google Authenticator
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-lg tracking-widest"
        />

        <button
          type="button"
          onClick={handleOtpLogin}
          className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg"
        >
          Verify OTP
        </button>
      </motion.div>
    </>
  )}
</form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center mt-8 text-gray-400">
          Don't have an account?{' '}
          <motion.a
            href="/"
            className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Sign up
          </motion.a>
        </motion.p>
      </motion.div>
    </div>
  );
}