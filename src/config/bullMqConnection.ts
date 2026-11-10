import { Redis } from 'ioredis'
import { logger } from '../utils/Logger'
import { getRedisClient } from './redis'

let bullRedisClient: Redis | null = null

export function getBullMQConnection() {
  try {
    if (!bullRedisClient) {
      bullRedisClient = getRedisClient()
      if (bullRedisClient) {
        logger.info('✅ BullMQ Redis client initialized (singleton)')
      } else {
        logger.warn('⚠️  BullMQ running without Redis connection')
      }
    } else {
      logger.debug('♻️ Reusing existing BullMQ Redis connection')
    }
    return bullRedisClient
  } catch (error) {
    logger.error('❌ Failed to initialize BullMQ connection', { error })
    throw error
  }
}
