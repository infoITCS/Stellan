import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { MongoClient, type Collection } from "mongodb";

export type LeadInput = {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly phone?: string;
  readonly service: string;
  readonly message: string;
  readonly consent: true;
};

type LeadDocument = LeadInput & {
  readonly createdAt: Date;
};

export type LeadRecord = LeadInput & {
  readonly id: string;
  readonly createdAt: string;
  readonly source: string;
};

export type LeadStore = {
  save(lead: LeadInput): Promise<string>;
  close(): Promise<void>;
  markNotified?(leadId: string, outcome: string): void;
  readonly description: string;
};

export const supportedServiceSlugs = [
  "managed-it",
  "cloud-services",
  "cybersecurity",
  "network-infrastructure",
  "it-consulting",
  "enterprise-automation",
  "ai-engineering",
  "web-development",
] as const;

export const serviceLabels: Record<string, string> = {
  "managed-it": "Managed IT",
  "cloud-services": "Cloud services",
  cybersecurity: "Cybersecurity",
  "network-infrastructure": "Network and infrastructure",
  "it-consulting": "IT consulting",
  "enterprise-automation": "Enterprise automation",
  "ai-engineering": "AI engineering",
  "web-development": "Web development",
};

export const serviceLabel = (slug: string): string => serviceLabels[slug] ?? slug;

export const leadsFileName = "leads.jsonl";

export async function connectLeadStore(
  uri: string,
  databaseName: string,
  collectionName: string,
): Promise<LeadStore> {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    const collection: Collection<LeadDocument> = client.db(databaseName).collection(collectionName);
    await collection.createIndex({ createdAt: -1 });

    return {
      description: `mongodb ${databaseName}.${collectionName}`,
      async save(lead) {
        const { phone, ...rest } = lead;
        const document: LeadDocument = {
          ...rest,
          ...(phone === undefined ? {} : { phone }),
          createdAt: new Date(),
        };
        const result = await collection.insertOne(document);
        return String(result.insertedId);
      },
      async close() {
        await client.close();
      },
    };
  } catch (error) {
    await client.close();
    throw error;
  }
}

export function createFileLeadStore(directory: string, fileName: string = leadsFileName): LeadStore {
  const target = join(directory, fileName);
  let queue: Promise<void> = Promise.resolve();

  return {
    description: `file ${target}`,
    save(lead) {
      const record: LeadRecord = {
        ...lead,
        id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        source: "contact-form",
      };

      queue = queue.then(async () => {
        await mkdir(directory, { recursive: true });
        await appendFile(target, `${JSON.stringify(record)}\n`, "utf8");
      });

      return queue.then(() => record.id);
    },
    async close() {
      await queue;
    },
  };
}
