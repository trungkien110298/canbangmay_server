$(document).ready(function () {
    $.ajax({
        url: '/api-get_list_product',
        contentType: "application/json",
        method: 'GET',
        success: function (data) {
            var list_product = data.list_product;
            $("#num_product").html(list_product.length)
            for (let i in list_product) {

                let product = list_product[i];
                // alert(JSON.stringify(product))
                let tr = $("<tr></tr>", { id: "tr" + product._id });

                let td_style = { style: "vertical-align: middle" }
                let p_style = { class: "text-center", style: "margin: 0px 0px 0px" }
                let center = {class: "text-center"};

                // let stt = parseInt(i) + 1
                // let td_stt = $("<td></td>").append($("<h4></h4>", { class: "text-center" }).html(stt));
                // td_stt.appendTo(tr);
                let td_id = $("<td></td>", center).html(product.product_id);
                td_id.appendTo(tr);
                let td_name = $("<td></td>").html(product.product_name);
                td_name.appendTo(tr);
                let td_dcp = $("<td></td>").html(product.description);
                td_dcp.appendTo(tr);

                let button = $("<button></button>", { type: "button", class: "btn btn-primary btn-sm", id: product._id }).html("Chi tiết");
                $(button).on('click', function () {
                    $.ajax({
                        url: '/api-get_product',
                        contentType: "application/json",
                        method: 'POST',
                        data: JSON.stringify({ "product": { "_id": product._id } }),
                        dataType: 'json',
                        success: function (data) {
                            localStorage.setItem('data', JSON.stringify(data));
                            window.location.href = "/api-get_product"
                        }
                    })
                })
                let td_button = $("<td></td>",center).append(button);
                td_button.appendTo(tr);

                let del_button = $("<button></button>", { type: "button", class: "btn btn-danger btn-sm", id: product._id }).html("Xóa");
                $(del_button).on('click', function () {
                    // alert("!1")

                    bootbox.confirm({
                        message: "Bạn có muốn xóa sản phẩm này?",
                        size: 'small',
                        centerVertical: true,
                        callback: function (result) {
                            if (result) {
                                $.ajax({
                                    url: '/api-delete_product',
                                    contentType: "application/json",
                                    method: 'POST',
                                    data: JSON.stringify({ "product": { "_id": product._id } }),
                                    dataType: 'json',
                                    success: function (data) {
                                        if (parseInt(data.code) == 200) {
                                            let del_tr = document.getElementById("tr" + product._id)
                                            del_tr.remove();
                                            renumber();
                                        }
                                    }
                                })
                            }
                        }
                    })


                })
                let td_del_button = $("<td></td>", center).append(del_button);
                td_del_button.appendTo(tr);


                $("#table_product tbody").append(tr);


            }

        }
    });

});


function renumber() {
    var count = 0;
    $.each($("#table_product tr td h4"), function () {
        count++;
        $(this).html(count);
    });
}



