// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// const uploadToS3 = (data, filename) => {
//     const BUCKET_NAME = '1expensetrackerapp';
//     const IAM_USER_KEY = process.env.AWS_KEY;
//     const IAM_USER_SECRET = process.env.AWS_SECRET;

//     let s3bucket = new S3Client({
//         region: 'your-region', // e.g., 'ap-south-1' or 'us-east-1'
//         credentials: {
//             accessKeyId: IAM_USER_KEY,
//             secretAccessKey: IAM_USER_SECRET
//         }
//     });

//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: data,
//         ACL: 'public-read'
//     };

//     return new Promise((resolve, reject) => {
//         const upload = async () => {
//             try {
//                 const command = new PutObjectCommand(params);
//                 await s3bucket.send(command);
//                 const location = `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
//                 resolve(location);
//             } catch (err) {
//                 console.log("Something went wrong", err);
//                 reject(err);
//             }
//         };
//         upload();
//     });
// };

// module.exports = {
//     uploadToS3
// };



//this is for AWS-SDK OLD VERSION V2 SO IT SAYS TO MOVE TO V3
const AWS=require("aws-sdk")

const uploadToS3 = (data,filename) => {
    const BUCKET_NAME='1expensetrackerapp'
    const IAM_USER_KEY=process.env.AWS_KEY
    const IAM_USER_SECRET=process.env.AWS_SECRET

    let s3bucket = new AWS.S3({
        accessKeyId : IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET
    }) 
        var params = {
            Bucket : BUCKET_NAME,
            Key : filename,
            Body : data,
            ACL : 'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(params , (err,s3response) => {
                if(err){
                    console.log("Something went wrong", err)
                    reject(err)
                }else{
                    //console.log('success' , s3response)
                    resolve(s3response.Location)
                }
    
            })
        })
        
}

module.exports={
    uploadToS3
}