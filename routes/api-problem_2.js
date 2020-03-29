var express = require("express");
var fs = require("fs");
var cmd = require("node-cmd");
var os = require("os");
var Product = require("../models/product");

var api_problem_2 = express.Router();

api_problem_2.post("/api-problem_2", (req, res) => {
	console.log("/api-problem_2");
	let product = req.body.product;
	let problem = req.body.problem;

	let tasks = product.tasks;
	let precedence_relations = product.precedence_relations;
	let num_workers = problem.num_workers;
	let deviation = product.deviation;
	let num_tasks = tasks.length;
	let num_precedence_relations = precedence_relations.length;
	let id_order = {};

	//Create input for C++ program
	str = num_tasks.toString() + "\n" + num_workers + "\n" + deviation + "\n";

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
		str +=
			id_order[pr.previous_task_id] +
			" " +
			id_order[pr.posterior_task_id] +
			"\n";
	}

	fs.writeFileSync("./temp/input_p2.txt", str);
	date = new Date();
	console.log(
		date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
			" - Save input file!"
	);

	//Run C++ program
	if (os.platform() == "win32") command = "cd controller && start Problem2.exe";
	else command = "cd controller &&  ./Problem2";
	cmd.get(
		command,
		//Send output
		function(err, data, stderr) {
			if (err != null) {
				console.log(err);
			}

			var text = fs.readFileSync("./temp/output_p2.json");
			output_data = JSON.parse(text);
			output_data.tasks = tasks;
			let R = output_data.R;
			output_data.rmin = parseInt(R) - (parseInt(R) * deviation) / 100;
			output_data.rmax = parseInt(R) + (parseInt(R) * deviation) / 100;
			text = JSON.stringify(output_data);
			res.send(output_data);
			console.log(
				date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
					" - Send output file!"
			);
		}
	);
});

module.exports = api_problem_2;
