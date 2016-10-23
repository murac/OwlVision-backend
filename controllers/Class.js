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
exports.insert = insert;