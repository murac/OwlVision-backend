var express = require('express');
var passport = require('passport');
var router = express.Router();
const cheerioReq = require("cheerio-req");
var Course = require('../controllers/Course');
var Class = require('../controllers/Class');
var Instructor = require('../controllers/Instructor');
var async = require('async');

var base_url_dept = "https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd";
var base_url_disp = "https://banner.fau.edu/FAUPdad/bwckctlg.p_display_courses";
var base_disp_end = "&sel_subj=&sel_levl=&sel_schd=&sel_coll=&sel_divs=&sel_dept=&sel_attr=";
var base_master = "https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=&pv_term=201701&pv_sub=&pv_pterm=1&pv_crn=&pv_campus=&pv_college=&pv_level=&pv_crsno=&pv_section=";

var options_dept = [
	{dept: "pv_dept"},
	{term: "pv_term"},
	{sub: "pv_sub"},
	{crn: "pv_crn"},
	{campus: "pv_campus"},
	{crsno: "pv_crsno"},
	{section: "pv_section"},
];

var options_disp = [
	{dept: "pv_dept"},
	{term: "term_in"},
	{sub: "one_subj"},
	{crn: "pv_crn"},
	{campus: "pv_campus"},
	{crsno: "pv_crsno"},
	{section: "pv_section"},
];

function scrape(req, res) {
	var basic = "https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=CMST&pv_term=201701";
	cheerioReq(base_master, (err, $) => {
		if (err)console.log("error: ", err);
		var crns = $(".datadisplaytable").last().children('tr');
		var result = [];
		crns.each(function (i, el) {
			// this === el
			var classObj = initClassObj();
			var tds = $(this).children('.dddefault');
			tds.each(function (k, el) {
				cur = $(this);
				switch (k) {
					case 1:
						if (cur.children().text() != '') classObj.class.crn = cur.children().text();
						break;
					case 2:
						item = cur.text().trim();
						if (item !== "") {
							item = item.split(' ');
							classObj.course.course_id.subject = item[0];
							classObj.course.course_id.number = item[1];
						}
						break;
					case 3:
						if (cur.text().trim() !== "") classObj.class.section = cur.text().trim();
						break;
					case 5:
						if (cur.text().trim() !== "") classObj.class.title = cur.text().trim();
						break;
					case 9:
						if (cur.text().trim() !== "") classObj.class.location.campus = cur.text().trim();
						break;
					case 10:
						classObj.class.days = cur.text().trim().split(' ').filter(v=>v !== "");
						break;
					case 11:
						if (cur.text().trim() !== "") classObj.class.time.start = cur.text().trim();
						break;
					case 12:
						if (cur.text().trim() !== "") classObj.class.time.end = cur.text().trim();
						break;
					case 14:
						if (cur.text().trim() !== "") classObj.class.location.building = cur.text().trim();
						break;
					case 15:
						if (cur.text().trim() !== "") classObj.class.location.room = cur.text().trim();
						break;
					case 20:
						if (cur.text().trim() !== "") classObj.class.instructor.name.last = cur.text().trim();
						break;
				}
			});
			if (Object.keys(classObj.course.course_id).length !== 0) {
				// console.log(classObj);
				result.push(classObj);
			}
			// result.push({crn: $(this).text(), course: $(this).parent().parent().next().text()});
		}).get().join(', ');
		// console.log(result);
		async.eachSeries(result, function (o, callback) {
			Course.insert(o.course).then(function (course) {
				Class.insert(o.class, course._id).then(function (newClass) {
					Course.attach(course._id, newClass._id).then(function () {
						console.log(newClass.title + ' added to course: ' + course.course_id.subject + ' ' + course.course_id.number);
						callback();
					});
				});
			});
		});
	});
	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
}

function instructor_email_update(req, res) {
	var first_half = "https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=&pv_term=201701&pv_sub=&pv_pterm=1&pv_crn=";
	var last_half = "&pv_campus=&pv_college=&pv_level=&pv_crsno=&pv_section=";

	// var url = first_half + "33087" + last_half;
	// cheerioReq(url, (err, $) => {
	// 	if (err)console.log("error: ", err);
	// 	// var email = $('a[href^="mailto:"]');
	// 	// console.log(url);
	// 	console.log('len', $(".dddefault").last().length);
	// 	var email_anchor = $(".dddefault").last().children('a');
	// 	if (email_anchor.text() === "") console.log("empty");
	// 	// var email_addr = email_anchor.attr('href').replace('mailto:', '');
	// 	// var first_name = email_anchor.attr('target').replace('Claiborne', '').trim();
	// 	// console.log(email_addr);
	// });

	Class.withInstructors().then(function (classes) {
		var url, email_anchor, email_addr, first_name, newIns, last_name_length;
		async.eachSeries(classes, function (the_class, callback) {
			url = first_half + the_class.crn + last_half;
			cheerioReq(url, function (err, $) {

				//code for classes that do not have email information on FAU page
				//
				//
				// email_anchor = $(".dddefault").last().text().split(' ');
				// email_anchor = email_anchor.filter(v=>v != '' && v != "(P)");
				// newIns = the_class.instructor;
				// last_name_length = newIns.name.last.split(' ').length;
				// newIns.name.last = email_anchor.splice(email_anchor.length - last_name_length, last_name_length).join(' ');
				// if (email_anchor.length > 1 && (email_anchor[email_anchor.length - 1].indexOf('.') != -1 || email_anchor[email_anchor.length - 1].length === 1)) {
				// 	newIns.name.middle = email_anchor.splice(email_anchor.length - 1, 1).join(' ');
				// }
				// newIns.name.first = email_anchor.join(' ');
				// // console.log(newIns);
				// Instructor.createOrUpdate(newIns, the_class._id).then(function (instructor) {
				// 	Class.replaceInstructorWithRef(the_class._id, instructor._id);
				// 	console.log("newInstructor: ", instructor);
				// 	console.log(the_class.title + " attached to " + instructor.name.last + ", " + instructor.name.first);
				// 	callback();
				// });

				//code for classes that have email information on FAU page
				email_anchor = $(".dddefault").last().children('a');
				if (email_anchor.length > 0) {
					email_addr = email_anchor.attr('href').replace('mailto:', '');
					first_name = email_anchor.attr('target').replace(the_class.instructor.name.last, '').trim();
					the_class.instructor.name.first = first_name;
					the_class.instructor.email = email_addr;
					Class.updateInstructorEmail(the_class).then(function (the_class) {
						console.log(the_class.instructor.name.last + ', ' + the_class.instructor.name.first + ' email updated to: ' + the_class.instructor.email);
						callback();
					});
				} else {
					first_name = email_anchor.attr('target').replace(the_class.instructor.name.last, '').trim();
					the_class.instructor.name.first = first_name;
					Class.updateInstructorEmail(the_class).then(function (the_class) {
						console.log(the_class.instructor.name.last + ', ' + the_class.instructor.name.first + ' name updated');
						callback();
					});
				}
			});
		});
	});
	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
}

function normalize_instructors(req, res) {
	Class.normInstructors().then(function (classes) {
		var ins;
		var potential_middle_name, new_first_name, name_arr;
		async.eachSeries(classes, function (the_class, callback) {
			ins = the_class.instructor;
			//
			// test code
			//
			//
			// name_arr = ins.name.first.split(' ');
			// potential_middle_name = name_arr[name_arr.length - 1];
			// if (potential_middle_name.indexOf('.') != -1) {
			// 	ins.name.middle = potential_middle_name;
			// 	ins.name.first = name_arr.splice(name_arr.length - 1, 1).join(' ');
			// 	console.log("new name", ins.name);
			// }
			console.log('classId', the_class._id);
			Instructor.createOrUpdate(ins, the_class._id).then(function (instructor) {
				console.log('classId', the_class._id);
				var classId = the_class._id;
				console.log("instructor", instructor);
				Class.replaceInstructorWithRef(classId, instructor._id).then(function (retClass) {
					// console.log("New Instructor: ", instructor);
					console.log(retClass.title + ' attached to instructor: ' + retClass.instructor);
					callback();
				});
			});
			// callback();
		});
	});
	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
}

function fix_instructors(req, res) {
	//
	// fixing bad code
	//
	//
	// Instructor.ins_without_classes().then(function (instructors) {
	// 	async.eachSeries(instructors, function (instructor, callback) {
	// 		Class.findClassByInstructor(instructor._id).then(function (the_class) {
	// 			Instructor.attachClassToInstructor(instructor._id, the_class._id).then(function (ins) {
	// 				if (ins.name.first && ins.name.last && ins.classes) {
	// 					console.log(ins.name.last + ", " + ins.name.first + " teaches " + ins.classes.length + " classes");
	// 				}
	// 				else console.log(ins);
	// 				callback();
	// 			});
	// 		});
	// 	});
	// });
	Class.allClasses().then(function (classes) {
		console.log("number of classes", classes.length);
		async.eachSeries(classes, function (the_class, callback) {
			Instructor.findInstructorById(the_class.instructor).then(function (instructor) {
				Instructor.attachClassToInstructor(instructor._id, the_class._id).then(function (ins) {
					if (ins.not_good) {
						console.log(ins.not_good);
					}
					else console.log(ins.name.last + ", " + ins.name.first + " teaches " + ins.classes.length + " classes");
					callback();
				});
			});
		});
	});

	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
}

function initClassObj() {
	return {
		class: {
			location: {},
			time: {},
			instructor: {
				name: {}
			}
		},
		course: {
			course_id: {}
		}
	};
}

var subjects = [
	"ABX", "ACG", "ADE", "AFH", "AFR", "AMH", "AML", "AMS", "ANG", "ANT", "APK", "ARA", "ARC", "ARE", "ARH", "ART", "ASH", "ASN", "AST", "BCH", "BME", "BMS", "BOT", "BSC", "BUL", "CAP", "CBH", "CCE", "CCJ", "CDA", "CEG", "CEN", "CES", "CET", "CGN", "CGS", "CHI", "CHM", "CHS", "CHT", "CIS", "CJC", "CJE", "CJJ", "CJL", "CLA", "CLP", "CLT", "CNT", "COM", "COP", "COT", "CPO", "CRW", "CST", "CTS", "CWR", "DAA", "DAE", "DAN", "DEP", "DIG", "DSC", "EAS", "ECM", "ECO", "ECP", "ECS", "EDA", "EDE", "EDF", "EDG", "EDH", "EDM", "EDS", "BTE", "EDP", "EEC", "EEE", "EEL", "EES", "EEX", "EGI", "EGM", "EGN", "EGS", "EIN", "EME", "EML", "ENC", "ENG", "ENL", "ENT", "ENV", "EOC", "ESC", "ESE", "ETI", "EUH", "EUS", "EVR", "EVS", "EXP", "FIL", "FIN", "FFP", "FLE", "FOL", "FOT", "FRE", "FRT", "FRW", "GEA", "GEB", "GEO", "GER", "GET", "GEW", "GIS", "GLS", "GLY", "GRA", "GRE", "HBR", "HFT", "HIS", "HMG", "HSA", "HSC", "HUM", "IDC", "IDH", "IDS", "IND", "INR", "ISC", "ISM", "ISS", "ITA", "ITT", "ITW", "JOU", "JPN", "JPT", "JPW", "JST", "LAE", "LAH", "LAS", "LAT", "LDR", "LIN", "LIT", "LNW", "MAA", "MAC", "MAD", "MAE", "MAN", "MAP", "MAR", "MAS", "MAT", "MCB", "MET", "MGF", "MHF", "MHS", "MMC", "MSL", "MTG", "MUC", "MUE", "MUG", "MUH", "MUL", "MUM", "MUN", "MUO", "MUR", "MUS", "MUT", "MVB", "MVK", "MVO", "MVP", "MVS", "MVV", "MVW", "NGR", "NSP", "NUR", "OCB", "OCE", "OCP", "PAD", "PAF", "PAX", "PCB", "PCO", "PEM", "PEN", "PEP", "PET", "PGY", "PHH", "PHI", "PHM", "PHP", "PHY", "PHZ", "POR", "POS", "POT", "PPE", "PSB", "PSC", "PSY", "PUP", "PUR", "QMB", "RAT", "RCS", "REA", "RED", "REE", "REL", "RMI", "RTV", "SCE", "SDS", "SLS", "SOP", "SOW", "SPA", "SPB", "SPC", "SPM", "SPN", "SPT", "SPW", "SSE", "STA", "SUR", "SYA", "SYD", "SYG", "SYO", "SYP", "TAX", "TCN", "THE", "TPA", "TPP", "TSL", "TTE", "URP", "VIC", "WOH", "WST", "ZOO"
];

var departments = [
	{ACCT: "Accounting"},
	{ANTH: "Anthropology"},
	{MUSA: "Applied Music"},
	{ARCH: "Architecture"},
	{ART: "Art"},
	{BIOL: "Biological Sciences"},
	{BMED: "Biomedical Sciences"},
	{CHEM: "Chemistry & Biochemistry"},
	{CIVL: "Civil Engineering"},
	{COMD: "Communcatn Sci & Disorders"},
	{COMM: "Communication and Multimedia"},
	{CMST: "Comparative Studies"},
	{CSBS: "Complex Systems/Brain Science"},
	{CSCE: "Computer Science & Engineering"},
	{COED: "Counselor Education"},
	{CRMJ: "Criminology & Criminal Justice"},
	{CCEI: "Curric, Culture, Educ Inquiry"},
	{ECON: "Economics"},
	{EDL: "Edu Leadership & Research Meth"},
	{EEL: "Electrical Engineering"},
	{DNEG: "Engineering Dean"},
	{ENGL: "English"},
	{ENVE: "Environmental Engineering"},
	{EXED: "Exceptional Student Education"},
	{EXSC: "Exer Sci & Health Promotion"},
	{FIN: "Finance"},
	{FRSH: "Freshman Programs"},
	{GEOM: "Geomatics Engineering"},
	{GOGL: "Geosciences"},
	{HCAN: "HC-Anthropology"},
	{HCAR: "HC-Art"},
	{HCBY: "HC-Biology"},
	{HCCH: "HC-Chemistry"},
	{HCRH: "HC-Composition & Rhetoric"},
	{HCEC: "HC-Economics"},
	{HCEN: "HC-English/Comp Lit"},
	{HCES: "HC-Environmental Studies"},
	{HCFL: "HC-Foreign Language & Lit"},
	{HCHI: "HC-History"},
	{HCHU: "HC-Humanities"},
	{HCID: "HC-Interdisciplinary Studies"},
	{HCMT: "HC-Mathematics"},
	{HCPL: "HC-Philosophy"},
	{HCPH: "HC-Physics"},
	{HCPS: "HC-Political Science"},
	{HCPY: "HC-Psychology"},
	{HCSC: "HC-Science"},
	{HCSS: "HC-Social Science"},
	{HCSO: "HC-Women's Studies/Sociology"},
	{HIST: "History"},
	{ITOM: "Info Tech and Oper Mgmt"},
	{EDFT: "Instructional Tech & Research"},
	{INDS: "Interdis. Studies-Arts Letters"},
	{INSC: "Interdis. Studies-Science"},
	{JUDS: "Jewish Studies"},
	{LANG: "Languages Linguistics Comp Lit"},
	{MGMT: "Management Programs"},
	{MKTG: "Marketing"},
	{MATH: "Mathematics"},
	{MECH: "Mechanical Engineering"},
	{MLSC: "Military Science"},
	{MUS: "Music Department"},
	{NURS: "Nursing"},
	{OCEN: "Ocean Engineering"},
	{OBBA: "Online BBA"},
	{PHIL: "Philosophy"},
	{PHYS: "Physics"},
	{POLS: "Political Science"},
	{PSY: "Psychology"},
	{PADM: "Public Administration"},
	{SOWK: "Social Work"},
	{SOC: "Sociology"},
	{TCHR: "Teaching and Learning"},
	{THE: "Theatre and Dance"},
	{URP: "Urban & Regional Planning"},
	{WST: "Women, Gender and Sexuality"}
];

// router.get('/', scrape);
// router.get('/ins', instructor_email_update);
// router.get('/ins/norm', normalize_instructors);
// router.get('/ins/fix', fix_instructors);

module.exports = router;