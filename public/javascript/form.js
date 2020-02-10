import { display_graph, display_chart } from './display.js';


$(document).ready(function () {
    $("#add_NCCN").on("click", function () {
        add_NCCN_row()
    });

    $("#add_RBTT").on("click", function () {
        add_RBTT_row()
    });

    $("#save").click(function () {
        let req = get_data()

        $.ajax({
            url: '/api-save_product',
            contentType: "application/json",
            method: 'POST',
            data: JSON.stringify(req),
            dataType: 'json',
            success: function (data) {
                alert(JSON.stringify(data))
            }
        })
    });

    $("#save_as").click(function () {
        bootbox.prompt({
            size: "small",
            title: "Nhập mã sản phẩm mới",
            callback: function (result) {
                // TODO: Check product id in database 
                $("#product_id").val(result)
                let req = get_data()
                $.ajax({
                    url: '/api-save_product',
                    contentType: "application/json",
                    method: 'POST',
                    data: JSON.stringify(req),
                    dataType: 'json',
                    success: function (data) {
                        //bootbox.alert(data)
                        if (data.code == "1010"){
                            bootbox.alert("Mã sản phẩm đã tồn tại");
                            $("#save_as").trigger("click");
                        } else {
                            bootbox.alert("Lưu thành công");
                        }
                    }
                })
            }
        });

    });

    $("#run").click(function () {
        var tab_id = $("#problem li.active").attr('id');
        // alert(tab_id);
        if (tab_id == "p1"){
            let req = get_data("problem1")
            $.ajax({
                url: '/api-problem_1',
                contentType: "application/json",
                method: 'POST',
                data: JSON.stringify(req),
                dataType: 'json',
                success: function (data) {
                    display_result(data)
                }
            })
        } else {
            let req = get_data("problem2")
            $.ajax({
                url: '/api-problem_2',
                contentType: "application/json",
                method: 'POST',
                data: JSON.stringify(req),
                dataType: 'json',
                success: function (data) {
                    display_result(data)
                }
            })
        }

        
    });

    let data = JSON.parse(localStorage.getItem('data'))
    if (data) {
        // alert(JSON.stringify(data))
        localStorage.removeItem('data')

        //Display data
        for (let i in data.input.NCCN) {
            $("#add_NCCN").trigger("click");
        }
        for (let i in data.input.RBTT) {
            $("#add_RBTT").trigger("click");
        }
        display_data(data)

        //Display result
        if (data.output) {
            display_result(data.output)
        }

    }
    else {
        // Add new row when open site
        $("#add_NCCN").trigger("click");
        $("#add_RBTT").trigger("click");
    }





});


function add_NCCN_row() {
    var newid = 0;

    $.each($("#table_NCCN tr"), function () {
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
    $.each($("#table_NCCN tbody tr:nth(0) td"), function () {
        var td;
        var cur_td = $(this);

        var children = cur_td.children();

        // add new td and element if it has a nane
        if ($(this).data("name") !== undefined) {
            td = $("<td></td>", {
                "data-name": $(cur_td).data("name")
            });

            var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
            c.attr("name", $(cur_td).data("name"));
            c.appendTo($(td));
            td.appendTo($(tr));
        } else {
            td = $("<td></td>", {
                'text': $('#table_NCCN tr').length
            }).appendTo($(tr));
        }
    });

    // add the new row
    $(tr).appendTo($('#table_NCCN'));
    renumber();

    $(tr).find("td button.row-remove").on("click", function () {
        $(this).closest("tr").remove();
        renumber();
    });
    function renumber() {
        var count = 0;
        $.each($("#table_NCCN tr td h4"), function () {
            $(this).html(count);
            count++;
        });
    }

}


function add_RBTT_row() {
    var newid = 0;
    $.each($("#table_RBTT tr"), function () {
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
    $.each($("#table_RBTT tbody tr:nth(0) td"), function () {
        var td;
        var cur_td = $(this);

        var children = cur_td.children();

        // add new td and element if it has a nane
        if ($(this).data("name") !== undefined) {
            td = $("<td></td>", {
                "data-name": $(cur_td).data("name")
            });

            var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
            c.attr("name", $(cur_td).data("name"));
            c.appendTo($(td));
            td.appendTo($(tr));
        } else {
            td = $("<td></td>", {
                'text': $('#table_RBTT tr').length
            }).appendTo($(tr));
        }
    });


    // add the new row
    $(tr).appendTo($('#table_RBTT'));

    $(tr).find("td button.row-remove").on("click", function () {
        $(this).closest("tr").remove();
    });
}


function display_data(data) {
    if (data.input.time) {
        $("#time").val(parseInt(data.input.time) / 3600)
    }

    $("#deviation").val(data.input.deviation)
    $("#wattage").val(data.input.wattage)
    $("#R").val(data.input.R)

    let NCCN = data.input.NCCN
    $("#table_NCCN tbody tr").each(function () {
        if (parseInt($(this).data("id")) > 0) {
            let i = parseInt($(this).data("id")) - 1
            $(this).find(':input[name = "name"]').val(NCCN[i].name)
            $(this).find(':input[name = "time"]').val(NCCN[i].time)
            $(this).find(':input[name = "device"]').val(NCCN[i].device)
            $(this).find(':input[name = "kind"]').val(NCCN[i].kind)
            $(this).find(':input[name = "level"]').val(NCCN[i].level)
        }
    });

    let RBTT = data.input.RBTT
    $("#table_RBTT tbody tr").each(function () {
        if (parseInt($(this).data("id")) > 0) {
            let i = parseInt($(this).data("id")) - 1
            $(this).find(':input[name = "NCCN-1"]').val(RBTT[i].nccn_1)
            $(this).find(':input[name = "NCCN-2"]').val(RBTT[i].nccn_2)
        }
    });

    $("#product_id").val(data.product_id)
    $("#product_id").prop('disabled', true);

    $("#product_name").val(data.product_name)
    $("#description").val(data.description)


}

function get_data(problem) {
    let data = {};
    if (problem == "problem1"){
        let time = parseInt($("#time").val()) * 3600
        let deviation = $("#deviation").val()
        let wattage = $("#wattage").val()
        let r = $("#R").val()
        data = { "NCCN": [], "RBTT": [], "time": time, "deviation": deviation, "wattage": wattage, "R": r }
    } else {
        let deviation = $("#deviation2").val()
        let num_worker = $("#num_worker").val()
        data = { "NCCN": [], "RBTT": [], "deviation": deviation, "num_worker": num_worker }
    }
    
    
    
    
    $("#table_NCCN tbody tr").each(function () {
        if (parseInt($(this).data("id")) > 0) {
            let name = $(this).find(':input[name = "name"]').val()
            let time = $(this).find(':input[name = "time"]').val()
            let device = $(this).find(':input[name = "device"]').val()
            let kind = $(this).find(':input[name = "kind"]').val()
            let level = $(this).find(':input[name = "level"]').val()
            let row = {
                "name": name,
                "time": time,
                "device": device,
                "kind": kind,
                "level": level
            }
            data["NCCN"].push(row)
        }
    });
    $("#table_RBTT tbody tr").each(function () {
        if (parseInt($(this).data("id")) > 0) {
            let NCCN_1 = $(this).find(':input[name = "NCCN-1"]').val()
            let NCCN_2 = $(this).find(':input[name = "NCCN-2"]').val()
            let row = {
                "nccn_1": NCCN_1,
                "nccn_2": NCCN_2
            }
            data["RBTT"].push(row)
        }
    });

    let product_id = $("#product_id").val()
    let product_name = $("#product_name").val()
    let description = $("#description").val()

    let req = { "product_id": product_id, "product_name": product_name, "description": description, "data": data }
    return req;
}

function display_result(data) {
    // Reset display
    $("#table-result tbody").html(" ");
    $("#myChart").html(" ");
    $("#graph").html(" ");
    $("#result-NCCN").css("display", "");
    $("#diagram-result").css("display", "");
    $("#graph-result").css("display", "");

    //Get data output
    let num_group = data.Numgroups;
    let groups = data.Groups;
    var dataPoints = []
    var dataPoints_rmax = data.rmax;
    var dataPoints_rmin = data.rmin;
    var list_NCCN = data.NCCN;

    //Display table
    for (let i in groups) {
        let group = groups[i];
        let num_nccn = group.tasks.length;
        let rows = [];
        dataPoints.push(group.Rj)

        for (let j = 0; j < num_nccn; j++) {
            let tr = $("<tr></tr>");
            rows.push(tr);
        }


        let td_id = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle" })
            .append($("<p></p>", { class: "text-center" }).html(group.id));
        rows[0].append(td_id)


        for (let task in group.tasks) {
            let nccn = group.tasks[task];

            let td_task = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(nccn.task));
            td_task.appendTo(rows[task]);

            let td_NCCN = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(list_NCCN[parseInt(nccn.task) - 1].name));
            td_NCCN.appendTo(rows[task]);


            let td_machine = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(nccn.machine));
            td_machine.appendTo(rows[task]);


            let td_ti = $("<td></td>").append($("<p></p>", { class: "text-center" }).html(nccn.ti));
            td_ti.appendTo(rows[task]);

        }

        let td_time = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle" })
            .append($("<p></p>", { class: "text-center" }).html(group.total_time));
        rows[0].append(td_time);

        let td_level = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle" })
            .append($("<p></p>", { class: "text-center" }).html(group.level));
        rows[0].append(td_level);

        let td_workers = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle" })
            .append($("<p></p>", { class: "text-center" }).html(group.workers));
        rows[0].append(td_workers);

        let td_Rj = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle" })
            .append($("<p></p>", { class: "text-center" }).html(group.Rj));
        rows[0].append(td_Rj)


        for (let j in rows) {
            $("#table-result tbody").append(rows[j])

        }
    }


    display_chart(dataPoints, dataPoints_rmax, dataPoints_rmin)
    display_graph(data)

    var wb = XLSX.utils.table_to_book(document.getElementById('table-result'), { sheet: "Sheet JS" });
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
