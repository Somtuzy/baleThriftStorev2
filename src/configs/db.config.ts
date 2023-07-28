import mongoose from'mongoose';
import pino from 'pino'

const logger = pino()

export default (function database() {
    const startdb = () => {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: 'Bale'
        })
        .then(() => {
            logger.info('Database connection successful...')
        })
        .catch(err => {
            logger.error('Error connecting to the database:', err)
            logger.info('Reconnecting to database...')
            startdb()
        })
    }

    startdb()
})