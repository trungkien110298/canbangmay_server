var express = require("express");
var fs = require("fs");
var cmd = require("node-cmd");
var os = require("os");
var Product = require("../models/product");
var auth = require('../controller/authController')

var api_problem_3 = express.Router();

api_problem_3.post("/api-problem_3", auth.isAuthenticated, (req, res) => {
	console.log("/api-problem_3");
	let product = req.body.product;
	let problem = req.body.problem;
	let deviation = problem.deviation;

	let tasks = product.tasks;
	let id_order = {}



	let precedence_relations = product.precedence_relations;
	let num_tasks = tasks.length;
	let num_precedence_relations = precedence_relations.length;



	//Create input for C++ program
	str = num_tasks.toString() + "\n" + deviation + "\n";

	for (i in tasks) {
		task = tasks[i];
		id_order[task.task_id] = task.task_order;
		str +=
			task.task_order.toString() +
			" " +
			task.device +
			" " +
			task.task_type +
			" " +
			task.time +
			" " +
			task.level +
			"\n";
	}

	str += num_precedence_relations.toString() + "\n";
	for (i in precedence_relations) {
		pr = precedence_relations[i];
		str += id_order[pr.previous_task_id] + " " + id_order[pr.posterior_task_id] + "\n";
	}

	fs.writeFileSync("./temp/input_p3.txt", str);
	date = new Date();
	console.log(
		date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
		" - Save input file!"
	);

	//Run C++ program
	if (os.platform() == "win32") command = "cd controller && start ALBPE-SA.exe";
	else command = "cd controller &&  ./ALBPE-SA";
	cmd.get(
		command,
		//Send output
		function (err, data, stderr) {
			if (err != null) {
				console.log(err);
			}

			var text = fs.readFileSync("./temp/output_p3.json");
			output_data = JSON.parse(text);
			output_data.tasks = tasks;
			let R = output_data.R;
			output_data.rmin = parseFloat(R) - (parseFloat(R) * deviation) / 100;
			output_data.rmax = parseFloat(R) + (parseFloat(R) * deviation) / 100;
			text = JSON.stringify(output_data);
			res.send(output_data);
			console.log(
				date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
				" - Send output file!"
			);


		}
	);
});

module.exports = api_problem_3;
