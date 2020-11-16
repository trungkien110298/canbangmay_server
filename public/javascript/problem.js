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
		hideMethod: "fadeOut"
	};
	$.ajaxSetup({
		headers: {
			'Authorization': Cookies.get('token')
		}
	})

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
				// window.location.href = "/home";
			}
		})
	});

	$("#optimize").click(function () {
		var tab = $("#problem_tab li a.active").attr("href");
		if (tab == "#tab-0") {
			let time = parseFloat($("#p1_time").val()) * 3600;
			let deviation = $("#p1_deviation").val();
			let wattage = $("#p1_wattage").val();
			let cycle_time = $("#p1_cycle_time").val();
			let product = JSON.parse(sessionStorage.getItem("product"));
			let product_id = product.product_id;

			let problem = {
				time: time,
				deviation: deviation,
				wattage: wattage,
				cycle_time: cycle_time
			};
			let req = {
				product: product,
				problem: problem
			};
			sessionStorage.setItem("problem_1", problem);
			let progress = '<div class="progress mt-2"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>'
			toastr.info(progress, "Đang tối ưu", { timeOut: 720000 });
			$.ajax({
				url: "/api-problem_1",
				contentType: "application/json",
				method: "POST",
				data: JSON.stringify(req),
				dataType: "json",
				success: function (data) {
					toastr.remove()
					toastr.success("Tối ưu thành công", "Success!");
					display_result(data, 1);
				}
			});
		} else if (tab == "#tab-1") {
			let deviation = $("#p2_deviation").val();
			let num_workers = $("#p2_num_workers").val();
			let product = JSON.parse(sessionStorage.getItem("product"));
			let product_id = product.product_id;
			let problem = {
				deviation: deviation,
				num_workers: num_workers
			};
			let req = {
				product: product,
				problem: problem
			};
			sessionStorage.setItem("problem_2", problem);
			let progress = '<div class="progress mt-2"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>'
			toastr.info(progress, "Đang tối ưu", { timeOut: 720000 });
			$.ajax({
				url: "/api-problem_2",
				contentType: "application/json",

				method: "POST",
				data: JSON.stringify(req),
				dataType: "json",
				success: function (data) {
					toastr.remove()
					toastr.success("Tối ưu thành công", "Success!");
					display_result(data, 2);
				}
			});
		} else {
			let time = parseFloat($("#p3_time").val()) * 3600;
			let deviation = $("#p3_deviation").val();
			let product = JSON.parse(sessionStorage.getItem("product"));

			let product_id = product.product_id;
			let problem = {
				time: time,
				deviation: deviation,
			};
			let req = {
				product: product,
				problem: problem
			};
			sessionStorage.setItem("problem_3", problem);
			let progress = '<div class="progress mt-2"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>'
			toastr.info(progress, "Đang tối ưu", { timeOut: 720000 });
			$.ajax({
				url: "/api-problem_3",
				contentType: "application/json",

				method: "POST",
				data: JSON.stringify(req),
				dataType: "json",
				success: function (data) {
					toastr.remove()
					toastr.success("Tối ưu thành công", "Success!");
					display_result(data, 3);
				}
			});
		}
	});
});

function display_result(data, problem) {
	// Reset display
	$("#workstations-table tbody").html(" ");
	$("#information-table tbody").html(" ")
	$("#information-table thead tr").html(" ")
	$("#chart").html(" ");
	$("#chart").append($('<div></div>', { id: "cycle_time-chart", style: "height:600px;" }));
	$("#assembly_line-graph").html(" ");
	$("#workstations").css("display", "");
	$("#cycle_time").css("display", "");
	$("#assembly_line").css("display", "");


	//Get data output
	let num_workstations = data.num_workstations;
	let workstations = data.workstations;
	var dataPoints = [];
	var dataPoints_rmax = data.rmax;
	var dataPoints_rmin = data.rmin;
	var tasks = data.tasks;



	let total_time = 0
	for (let i in tasks) {
		total_time += tasks[i].time
	}


	if (problem == 1) {
		let balance_efficiency = data.balance_efficiency;
		let num_workers = data.total_worker;
		let tr = $('<tr></tr>');
		tr.append($('<td></td>', { class: "text-center" }).html(balance_efficiency));
		tr.append($('<td></td>', { class: "text-center" }).html(num_workers));
		tr.append($('<td></td>', { class: "text-center" }).html(total_time));
		$("#information-table tbody").append(tr);
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Hiệu quả cân bằng H"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Tổng số công nhân"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Tổng thời gian"));
	}
	else if (problem == 2) {
		let balance_efficiency = data.balance_efficiency;
		let r = data.R;
		let tr = $('<tr></tr>');
		tr.append($('<td></td>', { class: "text-center" }).html(balance_efficiency));
		tr.append($('<td></td>', { class: "text-center" }).html(r));
		tr.append($('<td></td>', { class: "text-center" }).html(total_time));
		$("#information-table tbody").append(tr);
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Hiệu quả cân bằng H"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Nhịp dây chuyền"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Tổng thời gian"));
	} else {
		let balance_efficiency = data.balance_efficiency;
		let num_workers = data.total_worker;
		let r = data.R;
		let tr = $('<tr></tr>');
		tr.append($('<td></td>', { class: "text-center" }).html(balance_efficiency));
		tr.append($('<td></td>', { class: "text-center" }).html(r));
		tr.append($('<td></td>', { class: "text-center" }).html(num_workers));
		tr.append($('<td></td>', { class: "text-center" }).html(total_time));
		$("#information-table tbody").append(tr);
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Hiệu quả cân bằng H"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Nhịp dây chuyền"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Tổng số công nhân"));
		$("#information-table thead tr").append($('<th></th>', { class: "text-center" }).html("Tổng thời gian"));
	}




	for (let i in workstations) {
		let workstation = workstations[i];
		let num_tasks = workstation.tasks.length;
		let rows = [];
		dataPoints.push(workstation.rj);

		for (let j = 0; j < num_tasks; j++) {
			let tr = $("<tr></tr>");
			rows.push(tr);
		}

		let td_id = $("<td></td>", {
			rowspan: num_tasks,
			style: "vertical-align: middle"
		}).append($("<p></p>", { class: "text-center" }).html(workstation.workstation_id));
		rows[0].append(td_id);

		for (let t in workstation.tasks) {
			let task = workstation.tasks[t];

			let td_task_id = $("<td></td>").append(
				$("<p></p>", { class: "text-center" }).html(task.task_id)
			);
			td_task_id.appendTo(rows[t]);

			let td_task = $("<td></td>").append(
				$("<p></p>", { class: "text-center" }).html(
					tasks[parseInt(task.task_id) - 1].name
				)
			);
			td_task.appendTo(rows[t]);

			let td_device = $("<td></td>").append(
				$("<p></p>", { class: "text-center" }).html(task.device)
			);
			td_device.appendTo(rows[t]);

			let td_ti = $("<td></td>").append(
				$("<p></p>", { class: "text-center" }).html(task.cycle_time)
			);
			td_ti.appendTo(rows[t]);
		}

		let td_time = $("<td></td>", {
			rowspan: num_tasks,
			style: "vertical-align: middle"
		}).append($("<p></p>", { class: "text-center" }).html(workstation.total_time));
		rows[0].append(td_time);

		let td_level = $("<td></td>", {
			rowspan: num_tasks,
			style: "vertical-align: middle"
		}).append($("<p></p>", { class: "text-center" }).html(workstation.level));
		rows[0].append(td_level);

		let td_workers = $("<td></td>", {
			rowspan: num_tasks,
			style: "vertical-align: middle"
		}).append($("<p></p>", { class: "text-center" }).html(workstation.num_workers));
		rows[0].append(td_workers);

		let td_rj = $("<td></td>", {
			rowspan: num_tasks,
			style: "vertical-align: middle"
		}).append($("<p></p>", { class: "text-center" }).html(workstation.rj));
		rows[0].append(td_rj);

		for (let j in rows) {
			$("#workstations-table tbody").append(rows[j]);
		}
	}

	//Display
	//display_table(groups, num_groups, task);
	display_chart(dataPoints, dataPoints_rmax, dataPoints_rmin);
	display_graph(data);

	var wb = XLSX.utils.table_to_book(document.getElementById('workstations-table'), { sheet: "Sheet JS" });
	var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	$("#download").click(function () {
		saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'ALBS.xlsx');
		// html2canvas($("#echarts"), {
		//     onrendered: function(canvas) {
		//       Canvas2Image.saveAsPNG(canvas);
		//     }
		// });
	});
}



function display_graph(group_data) {
	let line_1 = group_data.line_1;
	let line_2 = group_data.line_2;
	let w_edges = group_data.edges;

	const width = document.getElementById("assembly_line-graph").scrollWidth - 100;
	const height = Math.max(line_1.length, line_2.length) * 100 + 100;
	let edges = [];
	let nodes = [];
	for (let i in line_1) {
		let node = {
			id: line_1[i].id,
			x: width / 2 - 150,
			y: 100 + i * 100,
			type: "alps",
			name: line_1[i].label,
			conf: []
		};
		nodes.push(node);
	}

	for (let i in line_2) {
		let node = {
			id: line_2[i].id,
			x: width / 2 + 150,
			y: 100 + i * 100,
			type: "alps",
			name: line_2[i].label,
			conf: []
		};

		nodes.push(node);
	}

	for (let i in w_edges) {
		let u = w_edges[i].u.toString();
		let v = w_edges[i].v.toString();
		let edge = {
			source: u,
			target: v
		};

		edges.push(edge);
	}

	const data = {
		nodes: nodes,
		edges: edges
	};

	G6.registerNode(
		"sql",
		{
			drawShape(cfg, group) {
				const rect = group.addShape("rect", {
					attrs: {
						x: -75,
						y: -25,
						width: 150,
						height: 50,
						radius: 10,
						stroke: "#5B8FF9",
						fill: "#C6E5FF",
						lineWidth: 3
					}
				});
				if (cfg.name) {
					group.addShape("text", {
						attrs: {
							text: cfg.name,
							x: 0,
							y: 0,
							fill: "#00287E",
							fontSize: 14,
							textAlign: "center",
							textBaseline: "middle",
							fontWeight: "bold"
						}
					});
				}
				return rect;
			}
		},
		"single-shape"
	);
	G6.Global.nodeStateStyle.selected = {
		stroke: "#d9d9d9",
		fill: "#5394ef"
	};

	const graph = new G6.Graph({
		container: "assembly_line-graph",
		width,
		height,
		pixelRatio: 2,
		defaultNode: {
			shape: "sql"
		},
		defaultEdge: {
			shape: "line",
			style: {
				radius: 20,
				offset: 45,
				endArrow: true,
				lineWidth: 2,
				stroke: "#C2C8D5"
			}
		},
		modes: {
			default: [
				"drag-canvas",
				"zoom-canvas",
				"click-select",
				{
					type: "tooltip",
					formatText(model) {
						const cfg = model.conf;
						const text = [];
						cfg.forEach(row => {
							text.push(row.label + ":" + row.value + "<br>");
						});
						return text.join("\n");
					},
					shouldUpdate: e => {
						if (e.target.type !== "text") {
							return false;
						}
						return true;
					}
				}
			]
		}
		//         fitView: true
	});
	graph.data(data);
	graph.render();
	// let node = graph.findById('1');

}

function display_chart(data_points, data_points_rmax, data_points_rmin) {
	var label = [];
	var rmin = [];
	var rmax = [];
	for (let i = 0; i < data_points.length; i++) {
		label.push(i + 1);
		rmin.push(data_points_rmin);
		rmax.push(data_points_rmax);
	}

	var theme = {
		color: [
			"#26B99A",
			"#34495E",
			"#BDC3C7",
			"#3498DB",
			"#9B59B6",
			"#8abb6f",
			"#759c6a",
			"#bfd3b7"
		],

		title: {
			itemGap: 8,
			textStyle: {
				fontWeight: "normal",
				color: "#408829"
			}
		},

		dataRange: {
			color: ["#1f610a", "#97b58d"]
		},

		toolbox: {
			color: ["#408829", "#408829", "#408829", "#408829"]
		},

		tooltip: {
			backgroundColor: "rgba(0,0,0,0.5)",
			axisPointer: {
				type: "line",
				lineStyle: {
					color: "#408829",
					type: "dashed"
				},
				crossStyle: {
					color: "#408829"
				},
				shadowStyle: {
					color: "rgba(200,200,200,0.3)"
				}
			}
		},

		dataZoom: {
			dataBackgroundColor: "#eee",
			fillerColor: "rgba(64,136,41,0.2)",
			handleColor: "#408829"
		},
		grid: {
			borderWidth: 0
		},

		categoryAxis: {
			axisLine: {
				lineStyle: {
					color: "#408829"
				}
			},
			splitLine: {
				lineStyle: {
					color: ["#eee"]
				}
			}
		},

		valueAxis: {
			axisLine: {
				lineStyle: {
					color: "#408829"
				}
			},
			splitArea: {
				show: true,
				areaStyle: {
					color: ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"]
				}
			},
			splitLine: {
				lineStyle: {
					color: ["#eee"]
				}
			}
		},
		timeline: {
			lineStyle: {
				color: "#408829"
			},
			controlStyle: {
				normal: { color: "#408829" },
				emphasis: { color: "#408829" }
			}
		},

		k: {
			itemStyle: {
				normal: {
					color: "#68a54a",
					color0: "#a9cba2",
					lineStyle: {
						width: 1,
						color: "#408829",
						color0: "#86b379"
					}
				}
			}
		},
		map: {
			itemStyle: {
				normal: {
					areaStyle: {
						color: "#ddd"
					},
					label: {
						textStyle: {
							color: "#c12e34"
						}
					}
				},
				emphasis: {
					areaStyle: {
						color: "#99d2dd"
					},
					label: {
						textStyle: {
							color: "#c12e34"
						}
					}
				}
			}
		},
		force: {
			itemStyle: {
				normal: {
					linkStyle: {
						strokeColor: "#408829"
					}
				}
			}
		},
		chord: {
			padding: 4,
			itemStyle: {
				normal: {
					lineStyle: {
						width: 1,
						color: "rgba(128, 128, 128, 0.5)"
					},
					chordStyle: {
						lineStyle: {
							width: 1,
							color: "rgba(128, 128, 128, 0.5)"
						}
					}
				},
				emphasis: {
					lineStyle: {
						width: 1,
						color: "rgba(128, 128, 128, 0.5)"
					},
					chordStyle: {
						lineStyle: {
							width: 1,
							color: "rgba(128, 128, 128, 0.5)"
						}
					}
				}
			}
		},
		gauge: {
			startAngle: 225,
			endAngle: -45,
			axisLine: {
				show: true,
				lineStyle: {
					color: [
						[0.2, "#86b379"],
						[0.8, "#68a54a"],
						[1, "#408829"]
					],
					width: 8
				}
			},
			axisTick: {
				splitNumber: 10,
				length: 12,
				lineStyle: {
					color: "auto"
				}
			},
			axisLabel: {
				textStyle: {
					color: "auto"
				}
			},
			splitLine: {
				length: 18,
				lineStyle: {
					color: "auto"
				}
			},
			pointer: {
				length: "90%",
				color: "auto"
			},
			title: {
				textStyle: {
					color: "#333"
				}
			},
			detail: {
				textStyle: {
					color: "auto"
				}
			}
		},
		textStyle: {
			fontFamily: "Arial, Verdana, sans-serif"
		}
	};

	var echartBar = echarts.init(
		document.getElementById("cycle_time-chart"),
		theme
	);

	echartBar.setOption({
		title: {
			text: "Nhịp sản xuất",
			subtext: ""
		},
		tooltip: {
			trigger: "axis"
		},
		legend: {
			data: ["sales", "purchases"]
		},
		toolbox: {
			show: true,
			feature: {
				saveAsImage: {
					show: true,
					title: "Save Image"
				}
			}
		},
		calculable: false,
		xAxis: [
			{
				type: "category",
				data: label
			}
		],
		yAxis: [
			{
				type: "value",
				max: Math.ceil(data_points_rmax / 10) * 10
			}
		],
		series: [
			{
				name: "Rj",
				type: "bar",
				data: data_points,
				markPoint: {
					data: [
						{
							type: "max",
							name: "max"
						},
						{
							type: "min",
							name: "min"
						}
					]
				},
				markLine: {
					data: [
						{
							yAxis: data_points_rmin,
							name: "rmin"
						},
						{
							yAxis: data_points_rmax,
							name: "rmax"
						}
					]
				}
			}
		]
	});
}
