import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import protect from "../middleware/auth.middleware.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.mfaEnabled) {
  return res.json({
    mfaRequired: true,
    userId: user._id,
  });
}

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("❌ AUTH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/mfa/setup", protect, async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: "TodoApp",
  });

  const qr = await QRCode.toDataURL(secret.otpauth_url);

  const user = await User.findById(req.user);
  user.mfaSecret = secret.base32;
  await user.save();

  res.json({ qr });
});

router.post("/mfa/verify", protect, async (req, res) => {
  const { token } = req.body;

  const user = await User.findById(req.user);

  const verified = speakeasy.totp({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.mfaEnabled = true;
  await user.save();

  res.json({ message: "MFA enabled" });
});

router.post("/mfa/login", async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId);

  const verified = speakeasy.totp({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const jwtToken = generateToken(user._id);

  res.json({ token: jwtToken });
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user).select("-password");

  res.json({
    id: user._id,
    email: user.email,
    mfaEnabled: user.mfaEnabled,
  });
});

export default router;
