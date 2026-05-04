import type { JwtPayload } from "@/libs/tokens.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}