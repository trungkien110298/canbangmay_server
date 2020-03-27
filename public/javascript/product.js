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

		$("#add_task").trigger("click");
		$("#add_relation").trigger("click");
	} else {
		display_data(product);
	}

	
	// $("#tasks").on("update", function(){
	// 	alert("Table change!")
	// })
});

function add_task_row() {
	var newid = 0;

	$.each($("#tasks tr"), function() {
		if (parseInt($(this).data("id")) > newid) {
			newid = parseInt($(this).data("id"));
		}
	});
	newid++;

	var tr = $("<tr></tr>", {
		id: "addr" + newid,
		"data-id": newid,
		task_id: Date.now()
	});

	// loop through each td and create new elements with name of newid
	$.each($("#tasks tbody tr:nth(0) td"), function() {
		var td;
		var cur_td = $(this);

		var children = cur_td.children();

		// add new td and element if it has a nane
		if ($(this).data("name") !== undefined) {
			td = $("<td></td>", {
				"data-name": $(cur_td).data("name")
			});

			var c = $(cur_td)
				.find($(children[0]).prop("tagName"))
				.clone()
				.val("");
			c.attr("name", $(cur_td).data("name"));
			c.appendTo($(td));
			td.appendTo($(tr));
		} else {
			td = $("<td></td>", {
				text: $("#tasks tr").length
			}).appendTo($(tr));
		}
	});

	// add the new row
	let num_row = $("#tasks tr").length - 2;
	let insertPost = "#tasks tbody tr:nth(" + num_row + ")";
	$(tr).insertBefore($(insertPost));

	$(tr)
		.find("td button.row-remove")
		.on("click", function() {
			$(this)
				.closest("tr")
				.remove();
			reorder_tasks();
			update_precedence_relations_option();
		});
	$(tr).find("td h6").html(num_row)
	$(".task_name").change(function() {
		let product = get_data();
		sessionStorage.setItem("product", JSON.stringify(product));
		update_precedence_relations_option();
	});
}

function add_relation_row() {
	var newid = 0;
	$.each($("#precedence_relations tr"), function() {
		if (parseInt($(this).data("id")) > newid) {
			newid = parseInt($(this).data("id"));
		}
	});
	newid++;

	var tr = $("<tr></tr>", {
		id: "addr" + newid,
		"data-id": newid
	});

	// loop through each td and create new elements with name of newid
	$.each($("#precedence_relations tbody tr:nth(0) td"), function() {
		var td;
		var cur_td = $(this);

		var children = cur_td.children();

		// add new td and element if it has a nane
		if ($(this).data("name") !== undefined) {
			td = $("<td></td>", {
				"data-name": $(cur_td).data("name")
			});

			var c = $(cur_td)
				.find($(children[0]).prop("tagName"))
				.clone()
				.val("");
			c.attr("name", $(cur_td).data("name"));
			c.appendTo($(td));
			td.appendTo($(tr));
		} else {
			td = $("<td></td>", {
				text: $("#precedence_relations tr").length
			}).appendTo($(tr));
		}
	});

	// add the new row
	let num_row = $("#precedence_relations tr").length - 2;
	let insertPost = "#precedence_relations tbody tr:nth(" + num_row + ")";
	$(tr).insertBefore($(insertPost));

	$(tr)
		.find("td button.row-remove")
		.on("click", function() {
			$(this)
				.closest("tr")
				.remove();
		});
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
			if (parseInt($(this).data("id")) > 0) {
				let i = parseInt($(this).data("id")) - 1;
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
		reorder_tasks();
		// update_precedence_relations_option();
	} else {
		add_task_row();
	}

	if (product.precedence_relations && product.tasks) {
		let precedence_relations = product.precedence_relations;
		let tasks = product.tasks;
		$("#pr0 td select").each(function() {
			for (let t in tasks) {
				let task = tasks[t];

				let option = $("<option></option>", {
					value: task.task_id
				});
				option.html(task.name);
				$(this).append(option);
			}
		});
		for (let i in precedence_relations) {
			add_relation_row();
		}
		$("#precedence_relations tbody tr").each(function() {
			if (parseInt($(this).data("id")) > 0) {
				let i = parseInt($(this).data("id")) - 1;
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
		if (parseInt($(this).data("id")) > 0) {
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
		if (parseInt($(this).data("id")) > 0) {
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

function reorder_tasks() {
	var count = 0;
	var id_order = {};
	$.each($("#tasks tbody tr"), function() {
		let task_id = $(this).attr("task_id");
		if (task_id) {
			id_order[task_id] = count;	
			$(this)
				.find("td h6")
				.html(count);
			count++;
		}
	});
	sessionStorage.setItem("id_order", JSON.stringify(id_order));
}

function update_precedence_relations_option() {
	// $("#precedence_relations tbody").html(" ");
	let product = JSON.parse(sessionStorage.getItem("product"));
	let tasks = product.tasks;
	let id_order = JSON.parse(sessionStorage.getItem("id_order"));
	$("#precedence_relations tbody td select option").each(function() {
		let task_id = $(this).attr("value");
		let task_order = id_order[task_id];
		if (!task_order) {
			$(this).remove();
		} else {
			$(this).html(tasks[task_order - 1].name);
		}
	});
}
