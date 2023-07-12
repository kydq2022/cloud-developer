import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

const documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

// TODO: Implement the dataLayer logic

export const getTodoListByUserId = async (userId: string) => {
    logger.info(`getTodoListByUserId`);
    const result = await documentClient.query({
        TableName: process.env.TODOS_TABLE,
        KeyConditionExpression: `userId = :userId`,
        ExpressionAttributeValues: { ':userId': userId }
    }).promise();
    return result.Items;
}

export const getTodoByTodoId = async (userId: string, todoId: string) => {
    logger.info(`getTodoListByUserId`);
    const result = await documentClient.get({
        TableName: process.env.TODOS_TABLE,
        Key: {
            userId,
            todoId
        }
    }).promise();
    return result.Item;
}

export const createTodo = async (todo: TodoItem) => {
    logger.info(`createTodo`);
    const result = await documentClient.put({
        TableName: process.env.TODOS_TABLE,
        Item: todo
    }).promise();
    return result;
}

export const updateTodo = async (todoId: string, userId: string, todoUpdate: TodoUpdate) => {
    logger.info(`updateTodo`);
    const result = await documentClient.update({
        TableName: process.env.TODOS_TABLE,
        Key: {
            todoId,
            userId
        },
        UpdateExpression: 'SET #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':dueDate': todoUpdate.dueDate,
            ':done': todoUpdate.done
        }

    }).promise();
    logger.info(`updateTodo result`);
    logger.info(result);
    return result;
}

export const deleteTodo = async (todoId: string, userId: string) => {
    logger.info(`deleteTodo`);
    const result = await documentClient.delete({
        TableName: process.env.TODOS_TABLE,
        Key: {
            todoId,
            userId
        }
    }).promise();
    return result;
}

export const updateTodoAttachmentUrl = async (todoId: string, userId: string, attachmentUrl: string) => {
    logger.info(`updateTodoAttachmentUrl`);
    const result = await documentClient.update({
        TableName: process.env.TODOS_TABLE,
        Key: {
            todoId,
            userId
        },
        UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
        }
    }).promise();
    logger.info(`updateTodoAttachmentUrl result`);
    logger.info(result);
    return result;
}