import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { authRepository } from "../repositories/auth.repository.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../utils/error.helper.js";

export const authService = {
  createAccessToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      },
    );
  },

  async createRefreshToken(user) {
    const secret = randomBytes(32).toString("hex");

    const hash = await bcrypt.hash(secret, 10);

    return {
      token: `${user.id}.${secret}`,
      hash,
    };
  },

  async registerUser(user) {
    if (
      !user ||
      [user.name, user.email, user.password].some(
        (value) => typeof value !== "string" || value.trim() === "",
      )
    ) {
      throw new BadRequestError(
        "Name, email and password are required and must be non-empty strings",
      );
    }

    const existingUser = await authRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await authRepository.createUser({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    return { message: "User registered successfully" };
  },

  async loginUser(email, password) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const accessToken = this.createAccessToken(user);
    const refresh = await this.createRefreshToken(user);
    await authRepository.saveRefreshTokenHash(user.id, refresh.hash);

    const {
      password_hash,
      refresh_token_hash,
      refresh_token_expires_at,
      ...safeUser
    } = user;
    return {
      user: safeUser,
      accessToken: accessToken,
      refreshToken: refresh.token,
    };
  },

  async logoutUser(refreshToken) {
    const user = await verifyRefreshToken(refreshToken);

    const revoked = await authRepository.revokeRefreshTokenHash(
      user.id,
      user.refresh_token_hash,
    );

    if (!revoked) {
      throw new UnauthorizedError("Refresh token was revoked or replaced");
    }
  },

  async refreshToken(refreshToken) {
    const user = await verifyRefreshToken(refreshToken);

    const accessToken = this.createAccessToken(user);
    const refresh = await this.createRefreshToken(user);

    const updated = await authRepository.rotateRefreshTokenHash(
      user.id,
      user.refresh_token_hash,
      refresh.hash,
    );

    if (!updated) {
      throw new UnauthorizedError("Refresh token was revoked or already used");
    }

    return {
      accessToken,
      refreshToken: refresh.token,
    };
  },
};

async function verifyRefreshToken(token) {
  if (typeof token !== "string" || token.trim() === "") {
    throw new BadRequestError("Refresh token is required");
  }

  const match = /^([1-9]\d*)\.([a-f0-9]{64})$/.exec(token);

  if (!match || !Number.isSafeInteger(Number(match[1]))) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const userId = Number(match[1]);
  const secret = match[2];

  const user = await authRepository.findUserForRefresh(userId);

  if (!user) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const isMatch = await bcrypt.compare(secret, user.refresh_token_hash);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  return user;
}
