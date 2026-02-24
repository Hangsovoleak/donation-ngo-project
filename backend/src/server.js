/**
 * Software Framework: Node.js (Express & Prisma)
 * Description:
 *      Server entry point. Handles environment configuration, 
 *      database connectivity checks, and starts the HTTP listener.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import "dotenv/config";
import app from "./app.js";
import prisma from "./db/prisma.js";
import cookieParser from "cookie-parser";

/*------------------------------------------------------------------------------
                                SERVER STARTUP
------------------------------------------------------------------------------*/

const port = process.env.PORT || 5000;

/**
 * @brief Warm up server.
 * 
 * Verifies the database connection before accepting requests.
 */
async function warmUp() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful.");
  } catch (e) {
    console.log("Database connection failed:", e.message);
  }
}

app.use(cookieParser());

// Start HTTP Server
app.listen(port, async () => {
  console.log(`API running at: http://localhost:${port}`);
  await warmUp();
});
