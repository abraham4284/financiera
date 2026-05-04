import type { JwtAccessPayload } from "./auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessPayload;
    }
  }
}

export {};
