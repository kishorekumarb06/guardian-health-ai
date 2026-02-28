import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================
// Health Check
// ==========================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================
// AUTHENTICATION
// ==========================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER"
      }
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecret_fallback_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

import { verifyToken, isAdmin, AuthRequest } from './authMiddleware';

// ==========================
// USERS / PROFILE
// ==========================

// Get my Profile (Protected)
app.get('/api/profile', verifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contacts: true,
        vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
        telemetry: true,
        healthHistory: { orderBy: { date: 'desc' }, take: 5 }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update my Profile (Protected)
app.put('/api/profile', verifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const { name, phone, bloodType, allergies, emergencyNotes } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone, bloodType, allergies, emergencyNotes }
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


// ==========================
// ADMIN DASHBOARD
// ==========================

app.get("/api/admin/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get('/api/admin/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { vitals: true, healthHistory: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/admin/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body // CAUTION: In production, sanitize this deeply
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/admin/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ==========================
// USER SPECIFIC ENDPOINTS
// ==========================

app.get('/api/users/:id/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.params.id }
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/users/:id/contacts', async (req, res) => {
  try {
    const newContact = await prisma.contact.create({
      data: {
        ...req.body,
        userId: req.params.id
      }
    });
    res.json(newContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// ==========================
// VITALS
// ==========================

app.get('/api/users/:id/vitals/latest', async (req, res) => {
  try {
    const vitals = await prisma.vitalSign.findFirst({
      where: { userId: req.params.id },
      orderBy: { recordedAt: 'desc' }
    });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

// ==========================
// HEALTH HISTORY
// ==========================

app.get('/api/users/:id/health-history', async (req, res) => {
  try {
    const history = await prisma.healthEvent.findMany({
      where: { userId: req.params.id },
      orderBy: { date: 'desc' }
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ==========================
// TELEMETRY
// ==========================

app.get('/api/users/:id/telemetry/latest', async (req, res) => {
  try {
    const telemetry = await prisma.telemetry.findUnique({
      where: { userId: req.params.id }
    });
    res.json(telemetry);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ==========================
// MEDICAL RECORDS
// ==========================

app.get('/api/users/:id/medical-records', async (req, res) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: { userId: req.params.id },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ==========================
// Start Server
// ==========================

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ==========================
// AI ASSISTANT
// ==========================

app.get('/api/ai/analyze/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { vitals: { orderBy: { recordedAt: 'desc' }, take: 1 } }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const latestVital = user.vitals[0];
    let riskScore = 15;
    let status = "Green";
    let advice = "Your vitals are stable. Continue your current routine.";

    if (latestVital) {
      if (latestVital.heartRate && latestVital.heartRate > 100) {
        riskScore = 45;
        status = "Yellow";
        advice = "Your heart rate is slightly elevated. Consider resting and monitoring for any changes.";
      }
      if ((latestVital.bloodPressure && latestVital.bloodPressure === "140/90") || (latestVital.spO2 && latestVital.spO2 < 94)) {
        riskScore = 75;
        status = "Red";
        advice = "Your vitals indicate potential risk. Please contact your physician or emergency contact if you experience discomfort.";
      }
    }

    res.json({ riskScore, status, advice });
  } catch (err) {
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// Helper mechanisms for AI mapping
const calculateRisk = (vitals: any) => {
  if (!vitals) return { score: 10, status: "Green", flags: [] };

  let score = 15;
  const flags = [];

  if (vitals.heartRate && vitals.heartRate > 100) {
    score += 30;
    flags.push("elevated heart rate");
  }
  if (vitals.bloodPressure === "140/90" || (vitals.spO2 && vitals.spO2 < 94)) {
    score += 40;
    flags.push("abnormal blood pressure or oxygen");
  }

  return {
    score,
    status: score >= 60 ? "Red" : score >= 30 ? "Yellow" : "Green",
    flags
  };
};

const generateAdvice = (flags: string[]) => {
  if (flags.length === 0) return "Keep up the good work! Your vitals look normal.";
  return `We detected the following issues: ${flags.join(", ")}. Please consult a healthcare professional.`;
};

import { generateAIResponse } from "./src/ai/ollamaService";

app.post('/api/ai', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const aiReply = await generateAIResponse(message);

    return res.json({ reply: aiReply });

  } catch (error) {
    return res.status(500).json({ error: "AI generation failed" });
  }
});

import { sendEmergencyEmail } from "./src/emailService";

app.post("/api/emergency", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const location = `https://maps.google.com/?q=${latitude},${longitude}`;

    await sendEmergencyEmail(location);

    res.json({ message: "Emergency alert sent." });
  } catch (err: any) {
    console.error("Failed to send emergency alert:", err);
    res.status(500).json({ error: "Failed to send emergency alert." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;