var express = require('express');
var fs = require('fs');
var cmd = require('node-cmd');
var os = require('os');
var Product = require('../models/product');
var postAuth = require('../controller/postAuthController')

var api_problem_1 = express.Router();

api_problem_1.post("/api-problem_1", postAuth.isAuthenticated, (req, res) => {
	console.log("/api-problem_1");
	let product = req.body.product;
	let problem = req.body.problem;

	let time = problem.time;
	let deviation = problem.deviation;
	let wattage = problem.wattage;

	let tasks = product.tasks;
	let id_order = {}



	let precedence_relations = product.precedence_relations;
	let num_tasks = tasks.length;
	let num_precedence_relations = precedence_relations.length;

	//Calculate R
	if (problem.cycle_time != NaN) {
		cycle_time = problem.cycle_time;
	} else {
		cycle_time = parseFloat(time) * parseFloat(wattage);
	}

	//Create input for C++ program
	str = num_tasks.toString() + "\n" + cycle_time + "\n" + deviation + "\n";

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

	fs.writeFileSync("./temp/input_p1.txt", str);
	date = new Date();
	console.log(
		date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
		" - Save input file!"
	);

	//Run C++ program
	if (os.platform() == "win32") command = "cd optimization && start ALBP1-SA_greedy.exe";
	else command = "cd optimization &&  ./ALBP1-SA_greedy";
	cmd.get(
		command,
		//Send output
		function (err, data, stderr) {
			if (err != null) {
				console.log(err);
			}

			var text = fs.readFileSync("./temp/output_p1.json");

			output_data = JSON.parse(text);
			output_data.tasks = tasks;
			output_data.rmin = parseFloat(cycle_time) - (parseFloat(cycle_time) * deviation) / 100;
			output_data.rmax = parseFloat(cycle_time) + (parseFloat(cycle_time) * deviation) / 100;
			text = JSON.stringify(output_data);
			res.send(output_data);
			console.log(
				date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
				" - Send output file!"
			);


		}
	);
});

module.exports = api_problem_1;
