import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { updateTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event ', event);
    try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId = getUserId(event);
      const todo = await updateTodo(todoId, updatedTodo, userId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          item: todo
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
