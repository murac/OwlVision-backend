var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var ClassSchema = new Schema({
	course: {type: Schema.Types.ObjectId, ref: 'Course'},
	crn: {type: String, unique: true},
	title: String,
	section: String,
	time: {
		start: String,
		end: String
	},
	days: [String],
	location: {
		campus: String,
		building: String,
		room: String
	},
	instructor: {
		name: {
			first: String,
			last: String
		},
		email: String
	},
	updated_at: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Class', ClassSchema);