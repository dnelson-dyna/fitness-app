import { CosmosClient, Database, Container } from '@azure/cosmos';
import { env } from './env';

class CosmosDBClient {
  private client: CosmosClient;
  private database: Database | null = null;
  private containers: {
    workouts?: Container;
    meals?: Container;
    users?: Container;
    progress?: Container;
  } = {};

  constructor() {
    this.client = new CosmosClient({
      endpoint: env.AZURE_COSMOS_ENDPOINT,
      key: env.AZURE_COSMOS_KEY,
    });
  }

  async init() {
    if (!this.database) {
      const { database } = await this.client.databases.createIfNotExists({
        id: env.COSMOS_DATABASE_NAME,
      });
      this.database = database;

      // Create containers
      const containerConfigs = [
        { id: 'workouts', partitionKey: '/userId' },
        { id: 'meals', partitionKey: '/userId' },
        { id: 'users', partitionKey: '/id' },
        { id: 'progress', partitionKey: '/userId' },
      ];

      for (const config of containerConfigs) {
        const { container } = await this.database.containers.createIfNotExists({
          id: config.id,
          partitionKey: { paths: [config.partitionKey] },
        });
        this.containers[config.id as keyof typeof this.containers] = container;
      }
    }
  }

  getContainer(name: 'workouts' | 'meals' | 'users' | 'progress'): Container {
    const container = this.containers[name];
    if (!container) {
      throw new Error(`Container ${name} not initialized`);
    }
    return container;
  }
}

export const cosmosDB = new CosmosDBClient();
