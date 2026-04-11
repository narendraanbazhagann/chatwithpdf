// Pinecone client temporarily disabled for deployment
const pineconeClient = {
  index: () => ({
    delete: async () => {},
    describeIndexStats: async () => ({ namespaces: {} }),
  }),
};

export default pineconeClient as any;
