import dotenv from 'dotenv'
dotenv.config({ path: process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env' });

export default {
    db: {
        host: process.env.NODE_MONGO_HOST || 'localhost',
        port: process.env.NODE_MONGO_PORT || 27017,
        dbName: process.env.NODE_MONGO_DB || 'intratec'
    },
    jwt_key: {
        key: process.env.JWT_KEY || '463ca1b82b92aa98e76b6720abc5daf122f6e29a',
        key_recovery: process.env.JWT_KEY_RECOVERY || '051CE83850723FB35CCF1336901D304981D212FC'
    }
}