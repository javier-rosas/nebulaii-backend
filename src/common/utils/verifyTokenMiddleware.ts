import jwt from "jsonwebtoken";

interface VerifyTokenMiddlewareOptions {
  secret: string | Buffer;
}

interface AugmentedEvent {
  headers: {
    authorization?: string;
  };
  user?: unknown;
}

interface AugmentedHandler {
  event: AugmentedEvent;
}

export function verifyTokenMiddleware(options: VerifyTokenMiddlewareOptions) {
  return {
    before: (handler: AugmentedHandler, next: (error?: Error) => void) => {
      const token = handler.event.headers.authorization;
      if (!token) {
        return next(new Error("Authorization token missing."));
      }
      try {
        const decoded = jwt.verify(token, options.secret);
        handler.event.user = decoded;
        next();
      } catch (err) {
        next(new Error("Invalid token."));
      }
    },
  };
}
