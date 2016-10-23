var Instructor = require('../models/Instructor');

function create(insObj) {
	newInstructor = new Instructor();
	newInstructor.email = insObj.email;
	newInstructor.name = insObj.name;
	newInstructor.classes = insObj.classes;
	// console.log('newInstructor', newInstructor);
	return newInstructor.save();
}

function insert(insObj, classId) {
	// console.log('ins class', classId);
	var ins_query;
	if (insObj.email) {
		ins_query = Instructor.find({email: insObj.email}).exec();
	}
	else {
		ins_query = Instructor.find({"name.first": insObj.name.first, "name.last": insObj.name.last}).exec();
	}

	return ins_query.then(function (instructors) {
		// console.log('instructors', instructors);
		if (instructors.length == 0) {
			insObj.classes = [];
			insObj.classes.push(classId);
			// console.log('ins ins', insObj);
			return create(insObj);
		}
		else if (instructors.length > 1) throw new Error('duplicate instructor');
		else {
			if (instructors[0].classes.indexOf(classId) < 0) {
				instructors[0].classes.push(classId);
				return instructors[0].save();
			}
			return instructors[0];
		}
	}).catch(function (err) {
		throw err;
	});
}

function ins_without_classes() {
	var ins_query = Instructor.find({"classes": {"$size": 0}}).exec();
	return ins_query.then(function (instructors) {
		return instructors;
	});
}

function attachClassToInstructor(insId, classId) {
	var ins_query = Instructor.find({_id: insId}).exec();
	var the_ins;
	return ins_query.then(function (ins) {
		if (ins.length == 1) {
			the_ins = ins[0];
			if (the_ins.classes.indexOf(classId) < 0) {
				the_ins.classes.push(classId);
				return the_ins.save();
			}
			return {not_good: "instructor already associated with class"};
		} else {
			throw new Error('instructor find error');
		}
	}).catch(function (error) {
		throw error;
	})
}

function findInstructorById(insId) {
	return Instructor.find({_id: insId}).exec().then(function (instructors) {
		if (instructors.length == 1) return instructors[0];
		else throw new Error("too many instructors");
	}).catch(function (error) {
		throw error;
	});
}

exports.createOrUpdate = insert;
exports.ins_without_classes = ins_without_classes;
exports.attachClassToInstructor = attachClassToInstructor;
exports.findInstructorById = findInstructorById;