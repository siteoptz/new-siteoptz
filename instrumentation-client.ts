import { initBotId } from "botid/client/core";

// The contact form submits via a Server Action, which Next.js posts back to the page's own
// route rather than a separate API endpoint - the docs' own server-action example protects
// "/dashboard" (the page itself) for exactly this reason. "/contact" is the only entry: a
// protected route left out of this list fails closed on checkBotId(), and an unprotected
// route added here would load the challenge where it has no reason to run.
initBotId({
  protect: [
    {
      path: "/contact",
      method: "POST",
    },
  ],
});
