var Course = require('../models/Course');

function create(courseObj) {
	newCourse = new Course(courseObj);
	return newCourse.save();
}

function insert(courseObj) {
	// console.log(courseObj);
	var course_query = Course.find({
		'course_id.subject': courseObj.course_id.subject,
		'course_id.number': courseObj.course_id.number
	}).exec();
	return course_query.then(function (courses) {
		// console.log('courses', courses);
		if (courses.length == 0) {
			return create(courseObj);
		}
		else if (courses.length > 1) throw new Error('duplicate courses');
		else {
			return courses[0];
		}
	}).catch(function (err) {
		throw err;
	});
}

function attachClassToCourse(course_id, class_id) {
	return Course.findOne({_id: course_id}, 'classes', (error, course)=> {
		if (error) throw error;
		if (course.classes.indexOf(class_id) < 0) course.classes.push(class_id);
		return course.save();
	});
}


exports.insert = insert;
exports.attach = attachClassToCourse;