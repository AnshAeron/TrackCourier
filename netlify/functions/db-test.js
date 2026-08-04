export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlStart: process.env.DATABASE_URL?.substring(0, 30) || null,
      nodeEnv: process.env.NODE_ENV,
    }),
  };
}
