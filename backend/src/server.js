import "dotenv/config";
import app from "./app.js";
import prisma from "./db/prisma.js";

const port = process.env.PORT || 3000;

async function warmUp() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("DB warm-up OK");
  } catch (e) {
    console.log("DB warm-up failed:", e.message);
  }
}

app.listen(port, async () => {
  console.log(`API running port: http://localhost:${port}`);
  await warmUp();
});
