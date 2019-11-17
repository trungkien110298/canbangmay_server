$(document).ready(function () {
    $("#add_NCCN").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
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


    });

    $("#add_RBTT").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
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
    });



    // Sortable Code
    var fixHelperModified = function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();

        $helper.children().each(function (index) {
            $(this).width($originals.eq(index).width())
        });

        return $helper;
    };

    // Add new row when open site
    $("#add_NCCN").trigger("click");
    $("#add_RBTT").trigger("click");


    $("#submit").click(function () {
        time = $("#time").val()
        deviation = $("#deviation").val()
        wattage = $("#wattage").val()
        r = $("#R").val()
        data = { "NCCN": [], "RBTT": [], "time": time, "deviation": deviation, "wattage": wattage, "R": r }
        $("#table_NCCN tbody tr").each(function () {
            if (parseInt($(this).data("id")) > 0) {
                name = $(this).find(':input[name = "name"]').val()
                time = $(this).find(':input[name = "time"]').val()
                device = $(this).find(':input[name = "device"]').val()
                kind = $(this).find(':input[name = "kind"]').val()
                level = $(this).find(':input[name = "level"]').val()
                row = {
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
                NCCN_1 = $(this).find(':input[name = "NCCN-1"]').val()
                NCCN_2 = $(this).find(':input[name = "NCCN-2"]').val()
                row = {
                    "nccn_1": NCCN_1,
                    "nccn_2": NCCN_2
                }
                data["RBTT"].push(row)
            }
        });
        $.ajax({
            url: '/api/api-worker',
            contentType: "application/json",
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                // alert(JSON.stringify(data))
                $("#result-NCCN").css("display","")
                num_group = data.Numgroups;
                groups = data.Groups;
                for (i in groups){
                    group = groups[i];
                    num_nccn = group.tasks.length;
                    rows = [];
                    for (j = 0; j < num_nccn; j++){
                        tr = $("<tr></tr>");
                        rows.push(tr);
                    }
                    
                   
                    td_id = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle"})
                        .append($("<p></p>", { class: "text-center"}).html(group.id));
                    rows[0].append(td_id)

                
                    for (task in group.tasks){
                        nccn = group.tasks[task];

                        td_task = $("<td></td>").append($("<p></p>", { class: "text-center"}).html(nccn.task));
                        td_task.appendTo(rows[task]);
                        
                        td_NCCN = $("<td></td>").append($("<p></p>", { class: "text-center"}).html(nccn.NCCN));
                        td_NCCN.appendTo(rows[task]);

                        
                        td_machine = $("<td></td>").append($("<p></p>", { class: "text-center"}).html(nccn.machine));
                        td_machine.appendTo(rows[task]);

                        
                        td_ti = $("<td></td>").append($("<p></p>", { class: "text-center"}).html(nccn.ti));
                        td_ti.appendTo(rows[task]);
                        
                    }

                    td_time = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle"})
                        .append($("<p></p>", { class: "text-center"}).html(group.total_time));
                    rows[0].append(td_time);

                    td_level = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle"})
                        .append($("<p></p>", { class: "text-center"}).html(group.level));
                    rows[0].append(td_level);

                    td_workers = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle"})
                        .append($("<p></p>", { class: "text-center"}).html(group.workers));
                    rows[0].append(td_workers);

                    td_Rj = $("<td></td>", { rowspan: num_nccn, style: "vertical-align: middle"})
                        .append($("<p></p>", { class: "text-center"}).html(group.Rj));
                    rows[0].append(td_Rj)


                    for (j in rows){
                        $("#table-result tbody").append(rows[j])

                    }
                    // alert(rows.length);
                    
                }

            }
        })
    });


});



window.onload = function () {

    // Dữ liệu đầu vào là các Rj của các Group
    var data_points = [{
        y: 71
    }, {
        y: 55
    }, {
        y: 50
    }, {
        y: 65
    }, {
        y: 92
    }, {
        y: 68
    }, {
        y: 38
    }, {
        y: 71
    }, {
        y: 54
    }, {
        y: 60
    }, {
        y: 36
    }, {
        y: 49
    }, {
        y: 21
    }]


    // Đường thể hiện Rmax
    var data_points_rmax = [{
        x: 0,
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }, {
        y: 60
    }]

    // Đường thể hiện Rmin
    var data_points_rmin = [{
        x: 0,
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }, {
        y: 40
    }]

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Simple Column Chart with Index Labels"
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: data_points
        }, {
            type: "line",
            name: "Rmax",
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: data_points_rmax
        }, {
            type: "line",
            name: "Rmin",
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: data_points_rmin
        },]
    });
    chart.render();

}
