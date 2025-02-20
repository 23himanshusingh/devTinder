const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: {
                values : ['ignored', 'interested'],
                error : '{VALUE} is not supported'
            },
            required: true,
        }
    },
    {timestamps : true}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // schema level compound index

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('ERROR : Interested/Ignored Same user id');
    }
    next();
});

ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest;