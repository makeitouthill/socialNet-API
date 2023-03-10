const {Schema} = require('mongoose');

const reactionSchema = new Schema (
    {
        reactionBody: {
            type: String,
            require: true,
            maxlength: 280,
        },
        username: {
            type: String,
            require: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => moment(timestamp).format('YYYY-MM-DD [Z] HH:mm:ss a')
        },
        // Require Unicode for emoji
        emoji: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

module.exports = reactionSchema;