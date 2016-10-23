var Class = require('../models/Class');

function create(classObj) {
	newClass = new Class(classObj);
	return newClass.save();
}

function insert(classObj, courseId) {
	// console.log(classObj);
	var class_query = Class.find({crn: classObj.crn}).exec();
	return class_query.then(function (classes) {
		// console.log('classes', classes);
		if (classes.length == 0) {
			classObj.course = courseId;
			return create(classObj);
		}
		else if (classes.length > 1) throw new Error('duplicate class');
		else {
			return classes[0];
		}
	}).catch(function (err) {
		throw err;
	});
}

function all_classes_with_instruction() {
	var class_query = Class.find({"instructor.name.last": {$ne: null}, "instructor.email": {$exists: false}}).exec();
	return class_query.then(function (classes) {
		return classes;
	}).catch(function (err) {
		throw err;
	});
}

function updateInstructorEmail(the_class) {
	var class_query = Class.find({"crn": the_class.crn}).exec();
	return class_query.then(function (result) {
		result[0].instructor = the_class.instructor;
		// console.log(result[0]);
		return result[0].save();
	});
}
exports.insert = insert;
exports.withInstructors = all_classes_with_instruction;
exports.updateInstructorEmail = updateInstructorEmail;