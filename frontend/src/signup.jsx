import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {apiRequest} from "./api/api.js";
import { Eye, EyeOff, Lock, Mail, User, Zap } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const data = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    });

    localStorage.setItem("token", data.token);

    // redirect to dashboard / todos page
    window.location.href = "/todo";
  } catch (error) {
    alert(error.message);
  } finally {
    setIsLoading(false);
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
        '0 0 20px rgba(84, 172, 191, 0.5)',
        '0 0 40px rgba(84, 172, 191, 0.8)',
        '0 0 20px rgba(84, 172, 191, 0.5)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-lunaNavy relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #54ACBF 0%, transparent 70%)' }}
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
        style={{ background: 'radial-gradient(circle, #54ACBF 0%, transparent 70%)' }}
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
              'linear-gradient(rgba(84, 172, 191, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(84, 172, 191, 0.5) 1px, transparent 1px)',
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
            <Zap className="w-8 h-8 text-lunaLight" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-lunaLight to-lunaMid bg-clip-text text-transparent">
              TaskMind
            </h1>
          </motion.div>
          <p className="text-lunaLight/60 text-lg">Join us and start creating</p>
        </motion.div>

        {/* Signup card */}
        <motion.div
          variants={itemVariants}
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-lunaMid/20 to-lunaBlue/20 blur-xl"
            variants={glowVariants}
            animate="animate"
          />

          <div className="relative bg-white/5 backdrop-blur-xl border border-lunaLight/20 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-lunaLight mb-3">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 w-5 h-5 text-lunaMid pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight placeholder-lunaLight/40 focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    required
                  />
                </div>
              </motion.div>

              {/* Email input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-lunaLight mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-lunaMid pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight placeholder-lunaLight/40 focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    required
                  />
                </div>
              </motion.div>

              {/* Password input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-lunaLight mb-3">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-lunaMid pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight placeholder-lunaLight/40 focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-lunaLight/60 hover:text-lunaMid transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-8 bg-gradient-to-r from-lunaMid to-lunaBlue hover:from-lunaMid/90 hover:to-lunaBlue/90 text-white font-bold py-3 rounded-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full"
                    />
                  ) : (
                    'Create Account'
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center mt-8 text-lunaLight/60">
          Already have an account?{' '}
          <motion.a
            href="/login"
            className="text-lunaMid hover:text-lunaLight font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.a>
        </motion.p>
      </motion.div>
    </div>
  );
}