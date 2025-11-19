#!/usr/bin/env node

/**
 * Simple CLI helper to call the secure custom-claims API route.
 *
 * Usage:
 *   ADMIN_API_KEY=xxxx npm run claims:set -- --uid <UID> --admin true --sideQuestAdmin false --reason "promo"
 */

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = {
    uid: "",
    claims: {},
    reason: "",
  };

  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    const value = args[i + 1];

    if (!value) {
      continue;
    }

    switch (key) {
      case "--uid":
        result.uid = value;
        i += 1;
        break;
      case "--admin":
        result.claims.admin = value === "true";
        i += 1;
        break;
      case "--sideQuestAdmin":
        result.claims.sideQuestAdmin = value === "true";
        i += 1;
        break;
      case "--prototypeAdmin":
        result.claims.prototypeAdmin = value === "true";
        i += 1;
        break;
      case "--reason":
        result.reason = value;
        i += 1;
        break;
      default:
        break;
    }
  }

  return result;
};

async function run() {
  const apiUrl =
    process.env.ADMIN_CLAIMS_API_URL ||
    "https://door24.app/api/admin/set-claims";
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    console.error("ADMIN_API_KEY env var is required");
    process.exit(1);
  }

  const { uid, claims, reason } = parseArgs();

  if (!uid) {
    console.error("--uid argument is required");
    process.exit(1);
  }

  if (!Object.keys(claims).length) {
    console.error("Provide at least one claim flag (--admin, --sideQuestAdmin, --prototypeAdmin)");
    process.exit(1);
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-api-key": adminApiKey,
      },
      body: JSON.stringify({
        targetUid: uid,
        claims,
        reason,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Failed to set claims:", response.status, errorBody);
      process.exit(1);
    }

    const data = await response.json();
    console.log("Custom claims updated:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Unexpected error calling claims API:", error);
    process.exit(1);
  }
}

run();


