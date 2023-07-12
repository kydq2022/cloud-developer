import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.debug('Processing event ', event);
    try {
      const todoId = event.pathParameters.todoId
      // TODO: Remove a TODO item by id
      const userId = getUserId(event);
      await deleteTodo(todoId, userId);

      return {
        statusCode: 204,
        body: JSON.stringify({
          result: 'Deleeted'
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

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
