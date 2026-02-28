import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Document } from "@langchain/core/documents";
import * as fs from 'fs';
import * as path from 'path';

// Define our embedding model. We use a free, local HuggingFace model.
// BAAI/bge-small-en-v1.5 is a highly performant embedding model for texts
const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/bge-small-en-v1.5",
});

let vectorStore: Chroma | null = null;
const COLLECTION_NAME = "guardian_health_docs";

// Initialize the Chroma DB with embeddings
export const initVectorDB = async () => {
    try {
        vectorStore = new Chroma(embeddings, {
            collectionName: COLLECTION_NAME,
            url: "http://localhost:8000", // Default URL for a local Chroma Docker instance
        });
        console.log("Vector DB Initialized.");
    } catch (e) {
        console.warn("Chroma is not running locally. Proceeding without active vector store.");
    }
};

// Function to ingest text documents into our Local Vector Database
export const ingestKnowledge = async () => {
    if (!vectorStore) return;

    try {
        console.log("Loading medical context files...");
        const knowledgeDir = path.join(__dirname, 'knowledge');

        // Let's create the folder if it doesn't exist to prevent errors
        if (!fs.existsSync(knowledgeDir)) {
            fs.mkdirSync(knowledgeDir, { recursive: true });
            // Dump a generic fallback doc
            fs.writeFileSync(
                path.join(knowledgeDir, 'general_advice.txt'),
                "General guideline: Always contact a doctor if heart rate exceeds 120 or blood pressure is over 140/90. Rest and hydrate. A sustained SpO2 drop below 94 mandates medical attention."
            );
        }

        const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.txt'));

        // Create documents from the files
        const docs: Document[] = files.map(filename => {
            const content = fs.readFileSync(path.join(knowledgeDir, filename), 'utf-8');
            return new Document({
                pageContent: content,
                metadata: { source: filename }
            });
        });

        if (docs.length === 0) {
            console.log("No documents to ingest.");
            return;
        }

        console.log(`Ingesting ${docs.length} documents into Chroma Vector Store...`);
        // Note: Chroma usually persists automatically. 
        await vectorStore.addDocuments(docs);
        console.log("Knowledge Base update complete.");

    } catch (error) {
        console.error("Failed to ingest knowledge:", error);
    }
};

// Retrieve context for a query
export const retrieveContext = async (query: string, k = 2): Promise<string> => {
    if (!vectorStore) return "RAG Vector Store offline.";

    try {
        const results = await vectorStore.similaritySearch(query, k);
        const context = results.map((r: Document) => r.pageContent).join('\n---\n');
        return context;
    } catch (err) {
        console.error("Vector retrieval failed:", err);
        return "Failed to fetch contextual knowledge.";
    }
};
