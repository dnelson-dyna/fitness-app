import { CosmosClient, Database, Container } from '@azure/cosmos';
import { env } from './env.js';

class CosmosDBClient {
  private client: CosmosClient;
  private database: Database | null = null;
  private containers: Map<string, Container> = new Map();

  constructor() {
    this.client = new CosmosClient({
      endpoint: env.COSMOS_ENDPOINT,
      key: env.COSMOS_KEY,
    });
  }

  async initialize(): Promise<void> {
    try {
      // Create database if it doesn't exist
      const { database } = await this.client.databases.createIfNotExists({
        id: env.COSMOS_DATABASE_NAME,
      });
      this.database = database;

      console.log(`✅ Connected to Cosmos DB: ${env.COSMOS_DATABASE_NAME}`);

      // Create containers
      await this.createContainer(env.COSMOS_CONTAINER_WORKOUTS, '/userId');
      await this.createContainer(env.COSMOS_CONTAINER_MEALS, '/userId');
      await this.createContainer(env.COSMOS_CONTAINER_USERS, '/id');
      await this.createContainer(env.COSMOS_CONTAINER_PROGRESS, '/userId');
    } catch (error) {
      console.error('❌ Failed to initialize Cosmos DB:', error);
      throw error;
    }
  }

  private async createContainer(
    containerId: string,
    partitionKey: string
  ): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    const { container } = await this.database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: [partitionKey] },
    });

    this.containers.set(containerId, container);
    console.log(`✅ Container ready: ${containerId}`);
  }

  getContainer(containerId: string): Container {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container not found: ${containerId}`);
    }
    return container;
  }

  get workouts(): Container {
    return this.getContainer(env.COSMOS_CONTAINER_WORKOUTS);
  }

  get meals(): Container {
    return this.getContainer(env.COSMOS_CONTAINER_MEALS);
  }

  get users(): Container {
    return this.getContainer(env.COSMOS_CONTAINER_USERS);
  }

  get progress(): Container {
    return this.getContainer(env.COSMOS_CONTAINER_PROGRESS);
  }
}

export const cosmosDB = new CosmosDBClient();
