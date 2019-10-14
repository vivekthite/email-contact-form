'use strict';

const AWS = require('aws-sdk');
//const uuid = require('uuid');

module.exports.submitContactForm = async event => {
  console.log("Event : ",event);

  const messageData = JSON.parse(event.body);
  console.log("Message : ",messageData);
  let message = "Success";
  let statusCode=200;

  let response = {  
    headers:{
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Credentials":true
    }
  };

  if(typeof messageData.name != 'string' || messageData.name.length === 0){
    statusCode=400;
    message='Name is required';
  }

  else if(typeof messageData.email != 'string' || messageData.email.length === 0){
    statusCode=400;
    message='Email is required';
  }

  else if(typeof messageData.message != 'string' || messageData.message.length === 0){
    statusCode=400;
    message='Message is required';
  }

  const sns = new AWS.SNS();
  const snsMessage = {
    Message: `
      Contact Form Message

      From: ${messageData.name} <${messageData.email}>
      Message: ${messageData.message}
    `,
    Subject: 'Message from contact form',    
    TopicArn: process.env.CONTACT_TOPIC_ARN
  };

  const result = await sns.publish(snsMessage).promise();
  console.log("Publish Result : ",result);

  /* { ResponseMetadata: { RequestId: '000836af-962b-5a11-a82e-60b10fa6d
  MessageId: '36fad447-bc2e-5145-ace7-825925a3f9cd'  */

  response.statusCode=statusCode;
  response.body=JSON.stringify({message:message});  
  console.log("Response : ",response);
  return response;
};

module.exports.saveContactMessage = async (event,context) => {
  console.log("Save contact message event : ",JSON.stringify({event}));
  const dynamodb = new AWS.DynamoDB();
  const snsObject = event.Records[0].Sns

  const dbItem = {
    TableName: process.env.CONTACT_TABLE_NAME,
    Item: {
      'id' : {S: snsObject.MessageId},
      'Subject' : {S: snsObject.Subject},
      'Message' : {S: snsObject.Message},
      //'MessageId': {S: snsObject.MessageId},
      'Timestamp': {S: snsObject.Timestamp}
    }
  }

  console.log('Saving into table : ',dbItem);
  await dynamodb.putItem(dbItem).promise();
  console.log('Saved ...');
  return;
}