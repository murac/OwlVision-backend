var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var CourseSchema = new Schema({
	course_id: {
		subject: String,
		number: String
	},
	classes: [{type: Schema.Types.ObjectId, ref: 'Class'}],
	updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Course', CourseSchema);
