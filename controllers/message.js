const Message = require("../models/Message");
const Client = require("../models/Client");
const errorHandler = require("../utils/errorHandler");
const faker = require('faker');

module.exports.getAll = async function(req, res) {
  try {
    const messages = await Message.aggregate(
      [
        { $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": "$first", count: 1, _id: 0} }
      ]
    )

    res.status(200).json(messages)
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.dropAll = async function(req, res) {
  try {
    Message.collection.drop();
    Client.collection.drop();
    res.status(200).json({"message": "Success"})
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getByclientId = async function(req, res) {
    try {
      //get client array of msg ids
         msgs$ = (await Client.findOne({client_id: req.params.clientId})).messages
        const messages = await Message.find(
          { _id: { $in: msgs$ } }
        ).sort({"Message.timestamp" : 1});
          res.status(200).json(messages);

    } catch (e) {
      errorHandler(res, e);
    }
  };

module.exports.create = async function(req, res) {
  try {
    const message = await Message({
      Message: { client_id: 1 }
    }).save();

    const updated = {
      client_id: message.Message.client_id
    };

    const client = await Client.findOneAndUpdate(
      { client_id: message.Message.client_id },
      {
        $set: updated,
        $push: { messages: message._id }
      },
      {
        new: true, // return new doc if one is upserted
        upsert: true // insert the document if it does not exist
      }
    );

    res.status(200).json({ message, client });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.createMany = function(req, res) {
  try {
    let count = 0;
    for (let i=0; i<req.params.count; i++) {
      setTimeout(async function(){
          generatedTime = faker.date.recent(req.params.daysBack);
            const message = await Message({
                created: generatedTime,
                Message: { 
                    client_id: faker.random.number({min:Number(req.params.startId), max:Number(req.params.endId)}),
                    timestamp: generatedTime, 
                    channels:{ sms:{text: faker.random.arrayElement(["azazaaAAA", "Some cool text", "Sample text", "Wazaaaaaap"])}}
                },
                Report: {
                  "result.code" : faker.random.arrayElement([0, 103, 102, 101])
                }
              }).save();
              const updated = {
                client_id: message.Message.client_id
              };
          
              const client = await Client.findOneAndUpdate(
                { client_id: message.Message.client_id },
                {
                  $set: updated,
                  $push: { messages: message._id }
                },
                {
                  new: true, // return new doc if one is upserted
                  upsert: true // insert the document if it does not exist
                }
              );
              count++;
              console.log(count,"created");
     }, 0);
   }  
   res.status(200).json({
    message: req.params.count + " messages would be created for users in ID range of "+ req.params.startId + " and " + req.params.endId
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCountsPerDay = async function(req, res) {
  try {
    const messagesDelivered = await Message.aggregate(
      [
        {
          $match: {
                    "Report.result.code": 0
                  }
        },
        { $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": { $dayOfYear:"$first"}, count: 1, _id: 0} }
      ]
    )

    const messagesFailed = await Message.aggregate(
      [
        {
          $match: {
                    "Report.result.code": {$ne: 0}
                  }
        },
        { $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": { $dayOfYear:"$first"}, count: 1, _id: 0} }
      ]
    )

    res.status(200).json([messagesDelivered, messagesFailed])
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCountsPerDayByClientId = async function(req, res) {
  try {
    const messages = await Message.aggregate(
      [
        {
          $match: {"Message.client_id" : Number(req.params.clientId)}
        },
        { 
          $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": "$first", count: 1, _id: 0} }
      ]
    )
    res.status(200).json(messages)
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCountsPerDayBetweenDatesByClientId = async function(req, res) {
  try {
    msgs$ = (await Client.findOne({client_id: req.params.clientId})).messages
    const messagesDelivered = await Message.aggregate(
      [
        {
          $match: {
                    "_id": { $in: msgs$ },
                    "Message.timestamp": {$gte:new Date(req.params.startDate), $lt:new Date(req.params.endDate)},
                    "Report.result.code": 0
                  }
        },
        { 
          $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": { $dayOfYear:"$first"} , count: 1, _id: 0} }
      ]
    )

    const messagesFailed = await Message.aggregate(
      [
        {
          $match: {
                    "_id": { $in: msgs$ },
                    "Message.timestamp": {$gte:new Date(req.params.startDate), $lt:new Date(req.params.endDate)},
                    "Report.result.code": {$ne: 0}
                  }
        },
        { 
          $group: {
            _id: {
              $add: [
               { $dayOfYear: "$Message.timestamp"}, 
               { $multiply: 
                 [400, {$year: "$Message.timestamp"}]
               }
            ]},   
            count: { $sum: 1 },
            first: {$min: "$Message.timestamp"}
          }
        },
        { $sort: {"_id": 1} },
        { $project: { "timestamp": { $dayOfYear:"$first"}, count: 1, _id: 0} }
      ]
    )
    res.status(200).json([messagesDelivered,messagesFailed])
  } catch (e) {
    errorHandler(res, e);
  }
};