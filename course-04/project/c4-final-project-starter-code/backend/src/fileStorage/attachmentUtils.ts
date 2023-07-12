import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

const logger = createLogger('attachmentUltils')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const s3Client = new XAWS.S3({
    signatureVersion: 'v4'
  })

export const s3GeneratePresignedUrl = (key: string) => {
    try {

        const presignedUrl = s3Client.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: `${key}.jpg`,
            Expires: parseInt(process.env.SIGNED_URL_EXPIRATION),
        });
        return presignedUrl;
    } catch (error) {
        logger.error(`s3GeneratePresignedUrl error`);
        logger.error(error);
        throw error;
    }
}
