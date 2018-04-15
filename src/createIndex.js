/*global require, module */
import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import pug from 'pug';

const s3 = new S3({ apiVersion: '2006-03-01' });

import getFileList from './getFileList';

const template = pug.compileFile('./index.pug');

function processDirectoryInBucket(directory, bucket) {
  s3.listObjectsV2({ Bucket: bucket, Prefix: directory + "/", Delimiter: "/" }, (err, data) => {
    if (err) { console.log(err); throw err; }

    let files = getFileList(data.Contents);
    var html = template({directory, files});
    var params = {
	  ACL: "authenticated-read",
      Body: html,
      Bucket: bucket,
      ContentType: "text/html",
      Key: directory + "/index.html"
    };

    if (files.length === 0) {
      console.log("empty directory: skipping");
      return;
    }

    s3.putObject(params, function (err, data) {
      if (err) { console.log(err, err.stack); }
      else { }
    });
  });
}

export const generateListing = function(event, callback) {
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  if (key.endsWith("/index.html")) {
    console.log("index.html: skipping");
    return;
  }
  const bucket = event.Records[0].s3.bucket.name;
  const currentDirectory = path.dirname(key);

  if (currentDirectory === ".") {
    console.log("root directory: skipping")
    return;
  }

  processDirectoryInBucket(currentDirectory, bucket);
};