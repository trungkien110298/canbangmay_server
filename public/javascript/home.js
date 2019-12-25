$(document).ready(function () {
    $.ajax({
        url: '/api-get_list_product',
        contentType: "application/json",
        method: 'GET',
        success: function (data) {
            var list_product = data.list_product;
            for (let i in list_product){
                
                let product = list_product[i];
                // alert(JSON.stringify(product))
                let tr = $("<tr></tr>");

                let stt = parseInt(i) + 1
                let td_stt = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(stt));
                td_stt.appendTo(tr);
                let td_id = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(product.product_id));
                td_id.appendTo(tr);
                let td_name = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(product.product_name));
                td_name.appendTo(tr);
                let td_dcp = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(product.description));
                td_dcp.appendTo(tr);

                let button = $("<button></button>", { type:'button', class: "btn btn-primary", id: product._id }).html("Sửa");
                $(button).on('click', function() {
                    $.ajax({
                        url: '/api-get_product',
                        contentType: "application/json",
                        method: 'POST',
                        data: JSON.stringify({"product": {"_id": product._id}}),
                        dataType: 'json',
                        success: function (data) {
                            localStorage.setItem('data', JSON.stringify(data));
                            window.location.href = "/api-get_product"
                        }
                    })
                })
                let td_button = $("<td></td>").append(button);
                td_button.appendTo(tr);

                let del_button = $("<button></button>", { class: "btn btn-danger", id:  product._id }).html("Xóa");
                $(del_button).on('click', function() {
                    // $.ajax({
                    //     url: '/api-get_product',
                    //     contentType: "application/json",
                    //     method: 'POST',
                    //     data: JSON.stringify({"product": {"_id": product._id}}),
                    //     dataType: 'json',
                    //     success: function (data) {
                    //         alert("!!!")
                    //     }
                    // })
                })
                let td_del_button = $("<td></td>").append(del_button);
                td_del_button.appendTo(tr);


                $("#table_product tbody").append(tr);
                
                
            }
            
        }
    });
    
    
    

});



