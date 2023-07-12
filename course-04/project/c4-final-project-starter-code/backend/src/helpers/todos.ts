import * as TodosAccess from './todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

import * as uuid from 'uuid'
import * as createHttpError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('todos');

export const createTodo = async (createTodoRequest: CreateTodoRequest, userId: string) => { 
    try {
        logger.info('createTodo');
        const todoId = uuid.v4()

        logger.info(`userId ${userId}`);
        await TodosAccess.createTodo({
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false
          })
        return await TodosAccess.getTodoByTodoId(userId, todoId);
    } catch (error) {
        logger.error(`createTodo error`);
        logger.error(error);
        throw new createHttpError[500](error.message);
    }
}

export const getTodoListByUserId = async (userId: string) => {
    try {
        logger.info('getTodoListByUserId');
        return await TodosAccess.getTodoListByUserId(userId);
    } catch (error) {
        logger.error(`getTodoListByUserId error`);
        logger.error(error);
        throw new createHttpError[500](error.message);
    }
}

export const updateTodo =async ( todoId: string, updateTodoRequest: UpdateTodoRequest, userId: string) => {
    try {
        logger.info('updateTodo');
        logger.info('updateTodoData', updateTodoRequest);
        const todo = await TodosAccess.getTodoByTodoId(userId, todoId);
        if(!todo) {
            throw new createHttpError.NotFound('Item Not Found');
        }
        await TodosAccess.updateTodo(todoId, userId, updateTodoRequest);
        return await TodosAccess.getTodoByTodoId(userId, todoId);
    } catch (error) {
        logger.error(`updateTodo error`);
        logger.error(error);
        throw new createHttpError[500](error.message);
    }
}

export const deleteTodo =async ( todoId: string, userId: string) => {
    try {
        logger.info('deleteTodo');
        const todo = await TodosAccess.getTodoByTodoId(userId, todoId);
        if(!todo) {
            throw new createHttpError.NotFound('Item Not Found');
        }
        await TodosAccess.deleteTodo(todoId, userId);
        return true;
    } catch (error) {
        logger.error(`deleteTodo error`);
        logger.error(error);
        throw new createHttpError[500](error.message);
    }
}

export const updateTodoAttachmentUrl = async (todoId: string, userId: string) => {
    try {
        logger.info('updateTodoAttachmentUrl');
        const bucket = process.env.ATTACHMENT_S3_BUCKET
        const attachmentUrl = `https://${bucket}.s3.amazonaws.com/${todoId}.jpg`;
        await TodosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl);
        return await TodosAccess.getTodoByTodoId(userId, todoId);
    } catch (error) {
        logger.error(`deleteTodo error`);
        logger.error(error);
        throw new createHttpError[500](error.message);
    }
}