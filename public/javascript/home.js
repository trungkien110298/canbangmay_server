$(document).ready(function() {
	// Setting Toastr option
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

	// Load list products
	$.ajax({
		url: "/api-get_list_product",
		contentType: "application/json",
		headers: { "Authorization": localStorage.getItem('token') },
		method: "GET",
		success: function(data) {
			var list_product = data.list_product;
			$("#num_product").html(list_product.length);

			for (let i in list_product) {
				let product = list_product[i];
				let tr = $("<tr></tr>", { id: "tr" + product._id });
				let center = { class: "text-center" };

				let td_id = $("<td></td>", center).html(product.product_id);
				td_id.appendTo(tr);
				let td_name = $("<td></td>").html(product.product_name);
				td_name.appendTo(tr);
				let td_dcp = $("<td></td>").html(product.description);
				td_dcp.appendTo(tr);

				let button = $("<button></button>", {
					type: "button",
					class: "btn btn-primary btn-sm",
					id: product._id
				}).html("Chi tiết");
				$(button).on("click", function() {
					$.ajax({
						url: "/api-get_product",
						contentType: "application/json",
						headers: { "Authorization": localStorage.getItem('token') },
						method: "POST",
						data: JSON.stringify({ product: { _id: product._id } }),
						dataType: "json",
						success: function(product) {
							sessionStorage.setItem("product", JSON.stringify(product));
							window.location.href = "/api-get_product";
						}
					});
				});

				let td_button = $("<td></td>", center).append(button);
				td_button.appendTo(tr);

				let del_button = $("<button></button>", {
					type: "button",
					class: "btn btn-danger btn-sm",
					id: product._id
				}).html("Xóa");
				$(del_button).on("click", function() {
					bootbox.confirm({
						message: "Bạn có muốn xóa mã hàng này?",
						size: "small",
						callback: function(result) {
							if (result) {
								$.ajax({
									url: "/api-delete_product",
									contentType: "application/json",
									headers: { "Authorization": localStorage.getItem('token') },
									method: "POST",
									data: JSON.stringify({ product: { _id: product._id } }),
									dataType: "json",
									success: function(data) {
										if (parseInt(data.code) == 200) {
											toastr.success("Xóa mã hàng thành công", "Success!");
											let del_tr = document.getElementById("tr" + product._id);
											del_tr.remove();
											renumber();
										}
									}
								});
							}
						}
					});
				});
				let td_del_button = $("<td></td>", center).append(del_button);
				td_del_button.appendTo(tr);

				$("#table_product tbody").append(tr);
			}
		}
	});

	$("#new_product").click(function() {
		bootbox.prompt({
			size: "small",
			title: "Nhập mã hàng",
			required: true,
			callback: function(result) {
				if (result != null) {
					$.ajax({
						url: "/api-check_product_id",
						contentType: "application/json",
						headers: { "Authorization": localStorage.getItem('token') },
						method: "POST",
						data: JSON.stringify({ product_id: result }),
						dataType: "json",
						success: function(data) {
							//bootbox.alert(data)
							if (data.code == "2") {
								toastr.error("Mã hàng đã tồn tại", "Error!");
								$("#new_product").trigger("click");
							} else {
								let product = { product_id: result };
								sessionStorage.setItem("product", JSON.stringify(product));
								toastr.success("Tạo mã hàng mới thành công", "Success!");
								window.location.href = "/api-get_product";
								// bootbox.alert("Lưu thành công");
							}
						}
					});
				}
			}
		});
	});
});

function renumber() {
	var count = 0;
	$.each($("#table_product tr td h4"), function() {
		count++;
		$(this).html(count);
	});
}
