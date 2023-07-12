import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodoListByUserId } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodoHandler');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('Processing event ', event);
    try {
      const userId: string = getUserId(event);
      const todos = await getTodoListByUserId(userId);
      return {
        statusCode: 201,
        body: JSON.stringify({
          items: todos
        })
      }

    } catch (error) {
      return {
        statusCode: error.code || 500,
        body: JSON.stringify({
          error
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
