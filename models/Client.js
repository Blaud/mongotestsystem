const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    client_id: {
        type: String,
        required: true,
        unique: true
    },
    messages: [
        {
            ref: 'messages',
            type: Schema.Types.ObjectId
        }
    ]
});

module.exports = mongoose.model('clients', clientSchema);