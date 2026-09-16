import { authService } from "../services/auth.service.js";
import { HttpResponse } from "../utils/success.helper.js";

export const authController = {
  async registerUser(req, res, next) {
    try {
      const { name, email, password } = req.body ?? {};
      const result = await authService.registerUser({ name, email, password });
      return new HttpResponse(res).created(
        result,
        "User registered successfully",
      );
    } catch (error) {
      next(error);
    }
  },

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.loginUser(email, password);
      return new HttpResponse(res).success(tokens, "Login successful");
    } catch (error) {
      next(error);
    }
  },

  async logoutUser(req, res, next) {
    try {
      const { refreshToken } = req.body ?? {};

      await authService.logoutUser(refreshToken);

      return new HttpResponse(res).success(null, "Logout successful");
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body ?? {};

      const tokens = await authService.refreshToken(refreshToken);

      return new HttpResponse(res).success(
        tokens,
        "Token refreshed successfully",
      );
    } catch (error) {
      next(error);
    }
  },
};
