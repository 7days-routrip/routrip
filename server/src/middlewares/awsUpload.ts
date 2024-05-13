import { ACCESS_KEY, S3_BUCKET_NAME, S3_BUCKET_REGION, SECRET_ACCESS_KEY } from "@/settings";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import multer from "multer";
import { v4 } from "uuid";

aws.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: S3_BUCKET_REGION,
});
const s3 = new aws.S3();

const profileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `profile/${Date.now() + v4() + "." + file.originalname.split(".").pop()}`);
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname });
    },
  }),
});
const placeImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `placeImg/${Date.now() + v4() + "." + file.originalname.split(".").pop()}`);
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname });
    },
  }),
});

const postsUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `posts/${Date.now() + v4() + "." + file.originalname.split(".").pop()}`);
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname });
    },
  }),
});

const awsUpload = { profileUpload, placeImgUpload, postsUpload };
export default awsUpload;
