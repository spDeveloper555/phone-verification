const Mongo_indexes = {
    createIndex: [
        {
            'user_verification': [{ phone: 1}]
        }
    ],
    collectionSetup: [
        'user_verification',
    ]
}
module.exports = Mongo_indexes;