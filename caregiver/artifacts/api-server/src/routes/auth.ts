import { Router, type IRouter, type Request } from "express";
import bcrypt from "bcryptjs";
import { runQuery } from "../neo4j";
import { generateToken, requireAuth } from "../middlewares/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post("/register", async (req: Request, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: "email, password, and name are required." });
    return;
  }

  try {
    // Check if caregiver with this email already exists
    const existing = await runQuery<{ c: any }>(
      `MATCH (c:Caregiver {email: $email}) RETURN c`,
      { email }
    );

    if (existing.length > 0) {
      res.status(409).json({ error: "A caregiver with this email already exists." });
      return;
    }

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();

    const rows = await runQuery<{ c: any }>(
      `CREATE (c:Caregiver {
        id: $id,
        email: $email,
        password: $hashedPassword,
        name: $name,
        createdAt: $now,
        updatedAt: $now
      }) RETURN c`,
      { id, email, hashedPassword, name, now }
    );

    const caregiver = rows[0].c;
    const token = generateToken(caregiver.id, caregiver.email);

    // Return caregiver info without password
    const { password: _pw, ...caregiverData } = caregiver;
    res.status(201).json({ token, caregiver: caregiverData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required." });
    return;
  }

  try {
    const rows = await runQuery<{ c: any }>(
      `MATCH (c:Caregiver {email: $email}) RETURN c`,
      { email }
    );

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const caregiver = rows[0].c;
    const isValidPassword = await bcrypt.compare(password, caregiver.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // role 전달 → admin 은 영구 토큰, caregiver 는 7일
    const token = generateToken(caregiver.id, caregiver.email, caregiver.role);

    // Return caregiver info without password
    const { password: _pw, ...caregiverData } = caregiver;
    res.json({ token, caregiver: caregiverData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me - Get current caregiver info (requires auth)
router.get("/me", requireAuth, async (req: Request, res) => {
  try {
    const rows = await runQuery<{ c: any }>(
      `MATCH (c:Caregiver {id: $id}) RETURN c`,
      { id: req.caregiverId }
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Caregiver not found." });
      return;
    }

    const caregiver = rows[0].c;
    const { password: _pw, ...caregiverData } = caregiver;
    res.json(caregiverData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
