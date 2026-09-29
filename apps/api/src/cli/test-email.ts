import { loadEnv } from "../config/env.ts";
import { createSmtpDelivery } from "../lead-notifier.ts";

const main = async (): Promise<void> => {
  const env = loadEnv();

  console.log(`SMTP host:     ${env.SMTP?.host ?? "NOT CONFIGURED"}`);
  console.log(`SMTP user:     ${env.SMTP?.user ?? "NOT CONFIGURED"}`);
  console.log(`Notify address: ${env.LEADS_NOTIFY_EMAIL}`);

  if (env.SMTP === undefined) {
    console.log("\nNo SMTP credentials found.");
    console.log("Set these in .env, then run this command again:");
    console.log("  SMTP_HOST=smtp.gmail.com");
    console.log("  SMTP_PORT=587");
    console.log("  SMTP_SECURE=false");
    console.log("  SMTP_USER=<your@gmail.com>");
    console.log("  SMTP_PASS=<google app password>");
    console.log("  SMTP_FROM=<your@gmail.com>");
    process.exitCode = 1;
    return;
  }

  const delivery = createSmtpDelivery(env.SMTP);

  try {
    const result = await delivery({
      to: env.LEADS_NOTIFY_EMAIL,
      from: env.SMTP.from,
      subject: "Stellan SMTP test — delivery works",
      text: [
        "This is a test message from the Stellan contact form API.",
        "",
        `Sent at: ${new Date().toISOString()}`,
        `Server:  ${env.SMTP.host}:${env.SMTP.port}`,
        `As:      ${env.SMTP.user}`,
        "",
        "If you are reading this, contact form submissions will arrive in this inbox.",
      ].join("\n"),
    });

    const accepted = (result as { accepted?: unknown } | undefined)?.accepted;
    console.log(`\nDelivery succeeded${Array.isArray(accepted) ? `: ${accepted.join(", ")}` : ""}`);
  } catch (error) {
    console.log(`\nDelivery failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
};

await main();
