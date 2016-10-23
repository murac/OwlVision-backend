var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var InstructorSchema = new Schema({
	name: {
		first: String,
		middle: String,
		last: String
	},
	email: {type: String, unique: true, sparse: true},
	classes: [{type: Schema.Types.ObjectId, ref: 'Class'}],
	updated_at: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Instructor', InstructorSchema);