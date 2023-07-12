import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { s3GeneratePresignedUrl } from '../../helpers/attachmentUtils'
import { getUserId } from '../utils'
import { updateTodoAttachmentUrl } from '../../helpers/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrlHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event ', event);
    try {
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event);

      await updateTodoAttachmentUrl(todoId, userId);
      const presignedUrl = s3GeneratePresignedUrl(todoId);

      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: presignedUrl
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
