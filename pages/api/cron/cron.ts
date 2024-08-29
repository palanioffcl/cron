import { MongoClient } from 'mongodb';

const uriSource: string = 'mongodb+srv://palanigway:uTmpuZvLvPLU6mFc@gmonitor.6khh65r.mongodb.net/';
const uriTarget: string = 'mongodb+srv://palanioffcl:wEjJ321jSFSPw9aJ@ext-cluster.cuxph.mongodb.net/';

async function syncDatabases(): Promise<void> {
    const clientSource: MongoClient = new MongoClient(uriSource, { useNewUrlParser: true, useUnifiedTopology: true });
    const clientTarget: MongoClient = new MongoClient(uriTarget, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await clientSource.connect();
        await clientTarget.connect();

        const sourceDb = clientSource.db('gmonitor_production');
        const targetDb = clientTarget.db('gmonitor-bak');

        await targetDb.dropDatabase();
        const collections = await sourceDb.listCollections().toArray();
        
        for (const collection of collections) {
            const data = await sourceDb.collection(collection.name).find().toArray();
            await targetDb.collection(collection.name).insertMany(data);
        }

        console.log('Synchronization complete.');
    } catch (err) {
        console.error('Error during synchronization:', err);
    } finally {
        await clientSource.close();
        await clientTarget.close();
    }
}

syncDatabases();
