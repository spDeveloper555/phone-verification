const Mongo_indexes = {
    createIndex: [
        {
            'users': [{ user_id: 1, email: 1}]
        }
    ],
    collectionSetup: [
        'users',
    ]
}
module.exports = Mongo_indexes;