import { clerkMiddleware } from '@clerk/nextjs/server';

const middleware = clerkMiddleware();

export default function proxy(req: any, evt: any) {
  return middleware(req, evt);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
