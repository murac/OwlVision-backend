var express = require('express');
var passport = require('passport');
var router = express.Router();
const cheerioReq = require("cheerio-req");

function scrape(req, res) {
	cheerioReq("https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=ANTH&pv_term=201701&pv_campus=01&pv_college=&pv_level=&pv_crsno=6084&pv_section=001", (err, $) => {
		var crns = $("html u");
		var result = [];
		crns.each(function (i, el) {
			// this === el
			result.push({crn: $(this).text(), course: $(this).parent().parent().next().text()});
		}).get().join(', ');
		console.log(result);
	});
}

router.get('/', scrape);