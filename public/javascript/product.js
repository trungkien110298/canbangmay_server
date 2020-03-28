$(document).ready(function() {
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
		hideMethod: "fadeOut"
	};

	var product = JSON.parse(sessionStorage.getItem("product"));
	if (!product) {
		//TODO: product
		bootbox.prompt({
			size: "small",
			title: "Nhập mã sản phẩm",
			required: true,
			callback: function(result) {
				if (result != null) {
					$.ajax({
						url: "/api-check_product_id",
						contentType: "application/json",
						method: "POST",
						data: JSON.stringify({ product_id: result }),
						dataType: "json",
						success: function(data) {
							if (data.code == "2") {
								toastr.error("Mã sản phẩm đã tồn tại", "Error!");
								$("#new_product").trigger("click");
							} else {
								product = { product_id: result };
								sessionStorage.setItem("product", product);
								toastr.success("Tạo sản phẩm mới thành công", "Success!");
							}
						}
					});
				}
			}
		});

		//Display data

		add_task_row();
		add_relation_row();
	} else {
		display_data(product);
	}

	$("#add_task").on("click", function() {
		add_task_row();
	});

	$("#add_relation").on("click", function() {
		add_relation_row();
	});

	$("#save").click(function() {
		let product = get_data();
		sessionStorage.setItem("product", JSON.stringify(product));
		let req = { product: product };
		$.ajax({
			url: "/api-save_product",
			contentType: "application/json",
			method: "POST",
			data: JSON.stringify(req),
			dataType: "json",
			success: function(data) {
				toastr.success("Lưu sản phẩm thành công", "Success!");
			}
		});
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
	$.each($("#tasks tbody tr"), function() {
		let task_id = $(this).attr("task_id");
		if (task_id) {
		
			$(this)
				.find("td h6")
				.html(count_task);
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
		order: new_task_order
	});

	// loop through each td and create new elements with name of new_order
	$.each($("#tasks tbody tr:nth(0) td"), function() {
		let cur_td = $(this);
		// add new td and element if it has a nane
		let td = $(cur_td)
			.clone()
			.val("");
		td.appendTo($(tr));
	});

	$(tr)
		.find("td button.row-remove")
		.on("click", function() {
			$(this)
				.closest("tr")
				.remove();
			reorder_tasks();

			delete_precedence_relations_option(
				$(this)
					.closest("tr")
					.attr("task_id")
			);
			update_local_product();
		});
	$(tr)
		.find("select")
		.val("");
	$(tr)
		.find("td h6")
		.html(new_task_order);

	// Update local product when a task change
	$(tr).change(function() {
		update_local_product();
	});

	$(".task_name", tr).change(function(){
		update_precedence_relations_option($(tr).attr("task_id"), $(this).val());
	})
	
	// Add id_oder and option
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
		order: new_relation_order
	});

	// loop through each td and create new elements with name of new_order
	$.each($("#precedence_relations tbody tr:nth(0) td"), function() {
		let cur_td = $(this);
		// add new td and element if it has a nane
		let td = $(cur_td)
			.clone()
			.val("");
		td.appendTo($(tr));
	});

	$(tr)
		.find("select")
		.val("");
	$(tr)
		.find("td button.row-remove")
		.on("click", function() {
			$(this)
				.closest("tr")
				.remove();

			update_local_product();
		});
	$(tr).change(function() {
		update_local_product();
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

		$("#tasks tbody tr").each(function() {
			if (parseInt($(this).attr("order")) > 0) {
				let i = parseInt($(this).attr("order")) - 1;

				$(this).attr("task_id", tasks[i].task_id);
				$(this)
					.find(':input[name = "name"]')
					.val(tasks[i].name);
				$(this)
					.find(':input[name = "description"]')
					.val(tasks[i].description);
				$(this)
					.find(':input[name = "time"]')
					.val(tasks[i].time);
				$(this)
					.find(':input[name = "device"]')
					.val(tasks[i].device);
				$(this)
					.find(':input[name = "task_type"]')
					.val(tasks[i].task_type);
				$(this)
					.find(':input[name = "level"]')
					.val(tasks[i].level);
			}
		});
		//reorder_tasks();
		// update_precedence_relations_option();
	} else {
		add_task_row();
	}

	if (product.precedence_relations && product.tasks) {
		let precedence_relations = product.precedence_relations;
		set_precedence_relations_option(product);
		for (let i in precedence_relations) {
			add_relation_row();
		}
		$("#precedence_relations tbody tr").each(function() {
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
	// if (problem == "problem1") {
	//     let time = parseInt($("#time").val()) * 3600
	//     let deviation = $("#deviation").val()
	//     let wattage = $("#wattage").val()
	//     let r = $("#R").val()
	//     data = { "NCCN": [], "RBTT": [], "time": time, "deviation": deviation, "wattage": wattage, "R": r }
	// } else {
	//     let deviation = $("#deviation2").val()
	//     let num_worker = $("#num_worker").val()
	//     data = { "NCCN": [], "RBTT": [], "deviation": deviation, "num_worker": num_worker }
	// }

	$("#tasks tbody tr").each(function() {
		if (parseInt($(this).attr("order")) > 0) {
			let task_id = $(this).attr("task_id");
			let task_order = $(this)
				.find("h6")
				.html();
			let name = $(this)
				.find(':input[name = "name"]')
				.val();
			let description = $(this)
				.find(':input[name = "description"]')
				.val();
			let device = $(this)
				.find(':input[name = "device"]')
				.val();
			let time = parseInt(
				$(this)
					.find(':input[name = "time"]')
					.val()
			);
			let task_type = parseInt(
				$(this)
					.find(':input[name = "task_type"]')
					.val()
			);
			let level = parseInt(
				$(this)
					.find(':input[name = "level"]')
					.val()
			);
			let row = {
				task_id: task_id,
				task_order: task_order,
				name: name,
				description: description,
				device: device,
				time: time,
				level: level,
				task_type: task_type
			};

			product["tasks"].push(row);
		}
	});
	$("#precedence_relations tbody tr").each(function() {
		if (parseInt($(this).attr("order")) > 0) {
			let previous_task_id = $(this)
				.find(':input[name = "previous_task"]')
				.val();
			let posterior_task_id = $(this)
				.find(':input[name = "posterior_task"]')
				.val();
			let row = {
				previous_task_id: previous_task_id,
				posterior_task_id: posterior_task_id
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
	$("#pr0 td select").each(function() {
		$(this).html(" ");
		for (let t in tasks) {
			let task = tasks[t];

			let option = $("<option></option>", {
				value: task.task_id
			});
			option.html(task.name);
			$(this).append(option);
		}
		$(this).val("");
	});
}

function add_precedence_relations_option(task_id) {
	$("#precedence_relations select").each(function() {
		let option = $("<option></option>", {
			value: task_id
		});
		$(this).append(option);
	});
}

function delete_precedence_relations_option(task_id) {
	$("#precedence_relations tbody tr").each(function() {
		if ($(this).attr("order")) {
			let previous_task_id = $(this)
				.find(':input[name = "previous_task"]')
				.val();
			let posterior_task_id = $(this)
				.find(':input[name = "posterior_task"]')
				.val();
			if (posterior_task_id == task_id || previous_task_id == task_id) {
				// Delete relations have task just be deleted
				$(this).remove();
			}
			$("option", this).each(function() {
				if ($(this).val() == task_id){
					$(this).remove();
				}
			});
		}
	});
}

function update_precedence_relations_option(task_id, task_name) {
	alert(task_name + " " + task_id)
	$("#precedence_relations option").each(function() {
		if ($(this).val() == task_id) {
			$(this).html(task_name);
		}
	});
}
