var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
        type: String,
        required: true, 
        unique: true
    }, 
	paid: {
        type: Boolean,
        default: false
    }, 
	created: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);
