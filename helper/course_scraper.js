var express = require('express');
var passport = require('passport');
var router = express.Router();
const cheerioReq = require("cheerio-req");

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
	console.log("hi");
	// cheerioReq("https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=ANTH&pv_term=201701&pv_campus=01&pv_college=&pv_level=&pv_crsno=6084&pv_section=001", (err, $) => {
	// 	var crns = $("html u");
	// 	var result = [];
	// 	crns.each(function (i, el) {
	// 		// this === el
	// 		result.push({crn: $(this).text(), course: $(this).parent().parent().next().text()});
	// 	}).get().join(', ');
	// 	console.log(result);
	// });
	cheerioReq("https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=CMST&pv_term=201701", (err, $) => {
		if (err)console.log("error: ", err);
		// var crns = $(".datadisplaytable")['1'].children[1].children;
		var crns = $(".datadisplaytable").last().children('tr');
		// console.log(crns['1']);
		var result = [];
		crns.each(function (i, el) {
			// this === el
			var tds = $(this).children('td');
			result.push(tds.text());
			// result.push({crn: $(this).text(), course: $(this).parent().parent().next().text()});
		}).get().join(', ');
		console.log(result);
	});
	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
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

router.get('/', scrape);

module.exports = router;