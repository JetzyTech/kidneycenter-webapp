import { MongoClient, Db } from "mongodb";

let cachedDb: Db | null = null;

const connectMongo = async (): Promise<Db> => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use MongoDB"
    );
  }

  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(process.env.MONGODB_NAME); 
    cachedDb = db; // Cache the database instance for reuse
    return db;
  } catch (e: any) {
    console.error("MongoDB Client Error: " + e.message);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectMongo;
