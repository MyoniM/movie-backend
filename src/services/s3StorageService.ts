import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { GetObjectCommand, HeadObjectCommand, HeadObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

import { generateUID } from '../utils/uid';

export type PresignedPostData = {
  /** The URL to which the POST request should be sent. */
  readonly url: string;

  /**
   * Fields that need to be included as part of the POST request.
   * Extra keys that must be included in the form to be submitted.
   * This will include signature metadata as well as any fields provided to createPresignedPost.
   */
  readonly fields: { [key: string]: string };

  /** The object key for which the pre-signed URL was generated. */
  readonly key: string;
};
export type GenerateUploadPresignedPostParams = {
  path: string; // The path to the file to be uploaded in the bucket.
  fileName: string; // The file name for which the pre-signed URL will be generated.
  expiry: number; // The expiration time for the pre-signed URL in seconds.
  minFileSize: number; // The minimum file size in bytes that is allowed to be uploaded.
  maxFileSize: number; // The maximum file size in bytes that is allowed to be uploaded.
};
export type GenerateDownloadPresignedUrlParams = {
  objectKey: string; // The object key for which the pre-signed URL will be generated.
  expiry: number; // The expiration time for the pre-signed URL in seconds.
};
export class S3StorageService {
  private readonly s3_client: S3Client;
  private readonly bucket_name: string;
  constructor(s3_client: S3Client, bucket_name: string) {
    this.s3_client = s3_client;
    this.bucket_name = bucket_name;
  }

  async generateUploadPresignedPost(params: GenerateUploadPresignedPostParams): Promise<PresignedPostData> {
    const extension = params.fileName.split('.').length > 1 ? params.fileName.split('.').pop() : '';
    const Key = `${params.path}${generateUID()}${extension ? `.${extension}` : ''}`;
    const { url, fields } = await createPresignedPost(this.s3_client, {
      Bucket: this.bucket_name,
      Expires: params.expiry,
      Conditions: [['content-length-range', params.minFileSize, params.maxFileSize]],
      Key: Key,
    });
    return { url, fields, key: Key };
  }

  async generateDownloadPreSignedUrl({ objectKey, expiry }: GenerateDownloadPresignedUrlParams): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket_name,
      Key: objectKey,
    });
    const url = await getSignedUrl(this.s3_client, command, {
      expiresIn: expiry,
    });
    return url;
  }

  async objectExists(objectKey: string): Promise<boolean> {
    try {
      const cmd = new HeadObjectCommand({
        Bucket: this.bucket_name,
        Key: objectKey,
      });
      const data: HeadObjectCommandOutput = await this.s3_client.send(cmd);
      const exists = data.$metadata.httpStatusCode === 200;
      return exists;
    } catch (error: any) {
      if (error.$metadata?.httpStatusCode === 404) {
        console.log('objectExists', `Object ${objectKey} does not exist`);
        // doesn't exist and permission policy includes s3:ListBucket
      } else if (error.$metadata?.httpStatusCode === 403) {
        console.log('objectExists', `Object ${objectKey} exists but forbidden`);
        // doesn't exist, permission policy WITHOUT s3:ListBucket
      }
      console.log('objectExists', `Error checking object ${objectKey} Failed with ${error}`);
      return false;
    }
  }
}

export const createStorageService = (
  access_key_id: string = process.env.AWS_ACCESS_KEY as string,
  secret_access_key: string = process.env.AWS_SECRET_KEY as string,
  region: string = process.env.AWS_S3_REGION as string,
  bucket_name: string = process.env.AWS_S3_BUCKET as string
): S3StorageService =>
  new S3StorageService(
    new S3Client({
      region: region,
      credentials: {
        accessKeyId: access_key_id,
        secretAccessKey: secret_access_key,
      },
    }),
    bucket_name
  );
