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

function withInstructors() {
	var class_query = Class.find({"instructor.name.last": {$ne: null}, "instructor.email": {$exists: false}}).exec();
	return class_query.then(function (classes) {
		return classes;
	}).catch(function (err) {
		throw err;
	});
}

function normInstructors() {
	var class_query = Class.find({
		"instructor.name.last": {$ne: null},
		"instructor.name.first": {$exists: true}
	}).exec();
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

function replaceInstructorWithRef(classId, insId) {
	return Class.findOneAndUpdate({_id: classId}, {$set: {instructor: insId}}, {new: true}).exec().then(function (doc) {
		return doc;
	}).catch(function (error) {
		throw error;
	});
}

function findClassByInstructor(classId) {
	var class_query = Class.find({"instructor": classId}).exec();
	return class_query.then(function (the_class) {
		return the_class;
	}).catch(function (error) {
		throw error;
	});
}

function allClasses() {
	var class_query = Class.find({}).exec();
	return class_query.then(function (classes) {
		return classes;
	}).catch(function (error) {
		throw error;
	});
}

function findClassByCrn(crn) {
	var class_query = Class.find({"crn": crn}).exec();
	return class_query.then(function (the_class) {
		return the_class;
	}).catch(function (error) {
		throw error;
	});
}


exports.insert = insert;
exports.withInstructors = withInstructors;
exports.normInstructors = normInstructors;
exports.updateInstructorEmail = updateInstructorEmail;
exports.replaceInstructorWithRef = replaceInstructorWithRef;
exports.findClassByInstructor = findClassByInstructor;
exports.allClasses = allClasses;
exports.findClassByCrn = findClassByCrn;