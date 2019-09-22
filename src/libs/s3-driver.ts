import { AWSError, S3 } from "aws-sdk";

export default class S3Driver {
    protected s3: S3 = new S3();

    /**
     * @param bucketName 操作対象のバケット名
     */
    public constructor(public bucketName: string) {
    }

    /**
     * ファイルをアップロードします。
     * @param data ファイルの内容
     * @param path アップロードするパス
     * @param acl アクセスコントロール
     */
    public putObject(
        data: any,
        path: string,
        acl: S3.ObjectCannedACL= "bucket-owner-full-control",
    ): Promise<S3.Types.PutObjectOutput> {

        const param: S3.Types.PutObjectRequest = {
            ACL: acl,
            Body: data,
            Bucket: this.bucketName,
            Key: path,
        };
        return new Promise((resolve, reject) => {
            this.s3.putObject(param, (err: AWSError, output: S3.Types.PutObjectOutput) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(output);
            });
        });
    }
}
