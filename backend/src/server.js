//import dotenv for environment variables
import "dotenv/config";
import app from "./app.js";
import prisma from "./db/prisma.js";

const port = process.env.PORT || 5000;

//warm up the server
async function warmUp() {
  try {
    //check database connection and warm up the server
    await prisma.$queryRaw`SELECT 1`;
    console.log("DB OK! yeahhhhhh jork jey");
  } catch (e) {
    //if database connection failed
    console.log("DB failed tt hx:", e.message);
  }
}

//listen to port and warm up the server
app.listen(port, async () => {
  //log port number
  console.log(`API running port: http://localhost:${port}`);
  //warm up the server
  await warmUp();
});
