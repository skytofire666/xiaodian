const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { BASE_TABLES, BUSINESS_TABLES, ensureFullMysqlSchema } = require("../db/schema");

const serverDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(serverDir, "..");

function loadLocalEnv() {
  [
    path.join(projectRoot, ".env.local"),
    path.join(projectRoot, ".env"),
    path.join(serverDir, ".env.local"),
    path.join(serverDir, ".env"),
  ].forEach((filePath) => {
    if (!fs.existsSync(filePath)) return;

    fs.readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;

        const index = trimmed.indexOf("=");
        if (index === -1) return;

        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();
        if (key && process.env[key] === undefined) {
          process.env[key] = value.replace(/^["']|["']$/g, "");
        }
      });
  });
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

async function main() {
  loadLocalEnv();

  if (String(process.env.DB_TYPE || "").toLowerCase() !== "mysql") {
    throw new Error("DB_TYPE must be mysql before setting up the database.");
  }

  const pool = mysql.createPool({
    host: requiredEnv("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASSWORD"),
    database: requiredEnv("DB_NAME"),
    waitForConnections: true,
    connectionLimit: 3,
  });

  try {
    await ensureFullMysqlSchema(pool);
    const expectedTables = [...BASE_TABLES, ...BUSINESS_TABLES];
    const [rows] = await pool.query(
      `SELECT TABLE_NAME AS tableName
         FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME IN (${expectedTables.map(() => "?").join(",")})
        ORDER BY TABLE_NAME`,
      expectedTables
    );

    console.log(`Database schema ready. ${rows.length}/${expectedTables.length} expected tables exist.`);
    console.log(rows.map((row) => row.tableName).join("\n"));
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
