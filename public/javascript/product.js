$(document).ready(function () {
	toastr.options = {
		closeButton: false,
		debug: false,
		newestOnTop: false,
		progressBar: false,
		positionClass: "toast-top-right",
		preventDuplicates: false,
		onclick: null,
		showDuration: "1000",
		hideDuration: "1000",
		timeOut: "3000",
		extendedTimeOut: "5000",
		showEasing: "swing",
		hideEasing: "linear",
		showMethod: "fadeIn",
		hideMethod: "fadeOut",
	};

	$.ajaxSetup({
		headers: {
			'Authorization': Cookies.get('token')
		}
	})
	var product = JSON.parse(sessionStorage.getItem("product"));
	if (!product) {
		//TODO: product
		bootbox.prompt({
			size: "small",
			title: "Nhập mã sản phẩm",
			required: true,
			callback: function (result) {
				if (result != null) {
					$.ajax({
						url: "/api-check_product_id",
						contentType: "application/json",

						method: "POST",
						data: JSON.stringify({ product_id: result }),
						dataType: "json",
						success: function (data) {
							if (data.code == "2") {
								toastr.error("Mã sản phẩm đã tồn tại", "Error!");
								$("#new_product").trigger("click");
							} else {
								product = { product_id: result };
								sessionStorage.setItem("product", JSON.stringify(product));
								toastr.success("Tạo sản phẩm mới thành công", "Success!");
							}
						},
					});
				}
			},
		});

		//Display data

		add_task_row();
		add_relation_row();
	} else {
		display_data(product);
	}

	$("#home").on("click", function () {
		$.ajax({
			url: "/home",
			// contentType: "application/json",
			method: "GET",
			// dataType: "json",
			// 
			success: function (data) {
				var newDoc = document.open("text/html", "replace");
				newDoc.write(data);
				newDoc.close();
				// window.location.replace("/home");
			}
		})
	});

	$("#add_task").on("click", function () {
		add_task_row();
	});

	$("#add_relation").on("click", function () {
		add_relation_row();
	});

	$("#save").on("click", function () {
		let product = get_data();
		sessionStorage.setItem("product", JSON.stringify(product));
		let req = { product: product };
		$.ajax({
			url: "/api-save_product",
			contentType: "application/json",
			method: "POST",
			data: JSON.stringify(req),
			dataType: "json",
			success: function (data) {
				if (data.code == 9000) {
					window.location.replace("/api-login")
				}
				else {
					toastr.success("Lưu sản phẩm thành công", "Success!");
				}
			},
		});
	});

	$("#submit-file").click(function (e) {
		e.preventDefault();
		$("#files").parse({
			config: {
				delimiter: "auto",
				complete: csv_to_html,
			},
			before: function (file, inputElem) {
				console.log("Parsing file...", file);
			},
			error: function (err, file) {
				console.log("ERROR:", err, file);
			},
			complete: function () {
				console.log("Done with all files");
			},
		});
		async function csv_to_html(result) {

			let product = {
				product_id: $("#product_id").val(),
				product_name: $("#product_name").val(),
				description: $("#description").val(),
				tasks: [],
			};
			for (let i in result.data) {
				if (i == 0 || i == result.data.length - 1) continue;
				let row = result.data[i];
				let cells = row.join(",").split(",");
				if (cells[1] == '') {
					continue
				}
				await new Promise((r) => setTimeout(r, 1)); //to get different task_id
				product.tasks.push({
					task_id: Date.now(),
					task_order: i,
					name: cells[1],
					description: cells[2],
					device: cells[3],
					time: parseFloat(cells[4]),
					level: parseInt(cells[5]),
					task_type: parseInt(cells[6]),
				});
			}
			$.each($("#tasks tbody tr"), function (index) {
				if (index != 0 && $("#tasks tbody tr").length > 2) {
					delete_precedence_relations_option($(this).attr("task_id"));
					$(this).remove();
				}
			});
			$.each($("#precedence_relations tbody tr"), function (index) {
				if (index != 0 && $("#precedence_relations tbody tr").length > 2) {
					$(this).remove();
				}
			});
			sessionStorage.setItem("product", JSON.stringify(product));
			display_data(product);
			display_graph();
			toastr.success("Tải lên thành công", "Success!");
		}
	});

	// $("#save_as").click(function() {
	// 	bootbox.prompt({
	// 		size: "small",
	// 		title: "Nhập mã sản phẩm mới",
	// 		callback: function(result) {
	// 			// TODO: Check product id in database
	// 			$("#product_id").val(result);
	// 			let req = get_data();
	// 			$.ajax({
	// 				url: "/api-save_product",
	// 				contentType: "application/json",
	// 				method: "POST",
	// 				data: JSON.stringify(req),
	// 				dataType: "json",
	// 				success: function(data) {
	// 					if (data.code == "1010") {
	// 						bootbox.alert("Mã sản phẩm đã tồn tại");
	// 						$("#save_as").trigger("click");
	// 					} else {
	// 						bootbox.alert("Lưu thành công");
	// 					}
	// 				}
	// 			});
	// 		}
	// 	});
	// });
	// $("#tasks").on("update", function(){
	// 	alert("Table change!")
	// })
});

// Reorder task and update id_order when a task be deleted
function reorder_tasks() {
	var count_task = 0;
	$.each($("#tasks tbody tr"), function () {
		let task_id = $(this).attr("task_id");
		let task_name = $(".task_name", this).val();
		if (task_id) {
			$(this).find("td h6").html(count_task);
			update_precedence_relations_option(
				task_id,
				task_name,
				String(count_task)
			);
			count_task++;
		}
	});
}

function update_local_product() {
	let product = get_data();
	sessionStorage.setItem("product", JSON.stringify(product));
}

function add_task_row() {
	let num_tasks = $("#tasks tbody tr").length - 2; //Ignore 2 row
	let new_task_order = ++num_tasks;
	let task_id = Date.now();
	var tr = $("<tr></tr>", {
		task_id: task_id,
		task_order: new_task_order,
	});

	// loop through each td and create new elements with name of new_order
	$.each($("#tasks tbody tr:nth(0) td"), function () {
		let cur_td = $(this);
		// add new td and element if it has a nane
		let td = $(cur_td).clone().val("");
		td.appendTo($(tr));
	});

	$(tr)
		.find("td button.row-remove")
		.on("click", function () {
			$(this).closest("tr").remove();
			reorder_tasks();

			delete_precedence_relations_option($(this).closest("tr").attr("task_id"));
			update_local_product();
			display_graph();
		});
	$(tr).find("select").val("");
	$(tr).find("td h6").html(new_task_order);

	// Update local product when a task change
	$(tr).change(function () {
		update_local_product();
		display_graph();
	});

	$(".task_name", tr).change(function () {
		update_precedence_relations_option(
			$(tr).attr("task_id"),
			$(this).val(),
			$(tr).attr("task_order")
		);
		update_local_product();
		//display_graph();
	});

	// Add id_order and option
	add_precedence_relations_option(task_id);

	// add the new row
	let insertPost = "#tasks tbody tr:nth(" + num_tasks + ")";
	$(tr).insertBefore($(insertPost));
}

function add_relation_row() {
	// add the new row
	let num_relations = $("#precedence_relations tbody tr").length - 2;
	let new_relation_order = ++num_relations;
	var tr = $("<tr></tr>", {
		order: new_relation_order,
	});

	// loop through each td and create new elements with name of new_order
	$.each($("#precedence_relations tbody tr:nth(0) td"), function () {
		let cur_td = $(this);
		// add new td and element if it has a nane
		let td = $(cur_td).clone().val("");
		td.appendTo($(tr));
	});

	$(tr).find("select").val("");
	$(tr)
		.find("td button.row-remove")
		.on("click", function () {
			$(this).closest("tr").remove();

			update_local_product();
			display_graph();
		});
	$(tr).change(function () {
		update_local_product();
		display_graph();
	});

	let insertPost = "#precedence_relations tbody tr:nth(" + num_relations + ")";
	$(tr).insertBefore($(insertPost));
}

function display_data(product) {
	$("#product_id").val(product.product_id);
	$("#product_id").prop("disabled", true);

	if (product.product_name) {
		$("#product_name").val(product.product_name);
	}
	if (product.description) {
		$("#description").val(product.description);
	}

	if (product.tasks) {
		let tasks = product.tasks;
		for (let i in tasks) {
			add_task_row();
		}

		$("#tasks tbody tr").each(function () {
			if (parseInt($(this).attr("task_order")) > 0) {
				let i = parseInt($(this).attr("task_order")) - 1;

				$(this).attr("task_id", tasks[i].task_id);
				$(this).find(':input[name = "name"]').val(tasks[i].name);
				$(this).find(':input[name = "description"]').val(tasks[i].description);
				$(this).find(':input[name = "time"]').val(tasks[i].time);
				$(this).find(':input[name = "device"]').val(tasks[i].device);
				$(this).find(':input[name = "task_type"]').val(tasks[i].task_type);
				$(this).find(':input[name = "level"]').val(tasks[i].level);
			}
		});
		set_precedence_relations_option(product);
	} else {
		add_task_row();
	}

	if (product.precedence_relations && product.tasks) {
		let tasks = product.tasks;
		let precedence_relations = product.precedence_relations;
		display_graph();
		for (let i in precedence_relations) {
			add_relation_row();
		}
		$("#precedence_relations tbody tr").each(function () {
			if (parseInt($(this).attr("order")) > 0) {
				let i = parseInt($(this).attr("order")) - 1;
				$(this)
					.find(':input[name = "previous_task"]')
					.val(precedence_relations[i].previous_task_id);
				$(this)
					.find(':input[name = "posterior_task"]')
					.val(precedence_relations[i].posterior_task_id);
			}
		});
	} else {
		add_relation_row();
	}
}

function get_data() {
	let product = { tasks: [], precedence_relations: [] };

	$("#tasks tbody tr").each(function () {
		if (parseInt($(this).attr("task_order")) > 0) {
			let task_id = $(this).attr("task_id");
			let task_order = $(this).find("h6").html();
			let name = $(this).find(':input[name = "name"]').val();
			let description = $(this).find(':input[name = "description"]').val();
			let device = $(this).find(':input[name = "device"]').val();
			let time = parseFloat($(this).find(':input[name = "time"]').val());
			let task_type = parseInt(
				$(this).find(':input[name = "task_type"]').val()
			);
			let level = parseInt($(this).find(':input[name = "level"]').val());
			let row = {
				task_id: task_id,
				task_order: task_order,
				name: name,
				description: description,
				device: device,
				time: time,
				level: level,
				task_type: task_type,
			};

			product["tasks"].push(row);
		}
	});
	$("#precedence_relations tbody tr").each(function () {
		if (parseInt($(this).attr("order")) > 0) {
			let previous_task_id = $(this)
				.find(':input[name = "previous_task"]')
				.val();
			let posterior_task_id = $(this)
				.find(':input[name = "posterior_task"]')
				.val();
			let row = {
				previous_task_id: previous_task_id,
				posterior_task_id: posterior_task_id,
			};
			product["precedence_relations"].push(row);
		}
	});

	product["product_id"] = $("#product_id").val();
	product["product_name"] = $("#product_name").val();
	product["description"] = $("#description").val();

	return product;
}

function set_precedence_relations_option(product) {
	let tasks = product.tasks;
	$("#pr0 td select").each(function () {
		$(this).html(" ");
		for (let t in tasks) {
			let task = tasks[t];

			let option = $("<option></option>", {
				value: task.task_id,
			});
			option.html(task.task_order + " - " + task.name);
			$(this).append(option);
		}
		$(this).val("");
	});
}

function add_precedence_relations_option(task_id) {
	$("#precedence_relations select").each(function () {
		let option = $("<option></option>", {
			value: task_id,
		});
		$(this).append(option);
	});
}

function delete_precedence_relations_option(task_id) {
	$("#precedence_relations tbody tr").each(function (index) {
		if ($(this).attr("order")) {
			let previous_task_id = $(this)
				.find(':input[name = "previous_task"]')
				.val();
			let posterior_task_id = $(this)
				.find(':input[name = "posterior_task"]')
				.val();
			if (
				(posterior_task_id == task_id || previous_task_id == task_id) &&
				index != 0
			) {
				// Delete relations have task just be deleted
				$(this).remove();
			}
			$("option", this).each(function () {
				if ($(this).val() == task_id) {
					$(this).remove();
				}
			});
		}
	});
}

function update_precedence_relations_option(task_id, task_name, task_order) {
	$("#precedence_relations option").each(function () {
		if ($(this).val() == task_id) {
			$(this).html(task_order + " - " + task_name);
		}
	});
}

function display_graph() {
	let product = JSON.parse(sessionStorage.getItem("product"));
	let tasks = product.tasks;
	let precedence_relations = product.precedence_relations;
	$("#graph").html(" ");
	let data = { nodes: [], edges: [] };
	for (let t in tasks) {
		let task = tasks[t];
		data.nodes.push({ id: task.task_id, label: task.task_order.toString() });
	}

	if (!precedence_relations) {
		return
	}
	for (let pr in precedence_relations) {
		let rela = precedence_relations[pr];
		data.edges.push({
			source: rela.previous_task_id,
			target: rela.posterior_task_id,
		});
	}

	//const width = document.getElementById("graph").scrollWidth;
	//const height = document.getElementById("graph").scrollHeight || 500;
	let width = document.getElementById("graph_rl").scrollWidth - 50;
	let height = 300;
	const graph = new G6.Graph({
		container: "graph",
		width: width,
		height: height,

		fitView: false,
		modes: {
			default: ["drag-canvas", "zoom-canvas", "click-select"],
		},
		layout: {
			type: "dagre",
			rankdir: "LR",
			align: "DL",
			nodesepFunc: () => 1,
			ranksepFunc: () => 1,
		},
		defaultNode: {
			type: "sql",
			size: 50,
			labelCfg: {
				style: {
					fontSize: 30,
					// ...           
				}
			}
		},
		defaultEdge: {
			size: 2,
			color: "#FFFFF",
			style: {
				endArrow: {
					path: "M 0,0 L 8,4 L 8,-4 Z",
					fill: "#FFFFF",
				},
			},
		},
	});
	graph.data(data);
	graph.render();
}
