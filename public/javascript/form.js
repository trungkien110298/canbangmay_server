import {draw_graph, showDiagram} from './draw.js';


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
        let time = parseInt($("#time").val()) * 3600
        let deviation = $("#deviation").val()
        let wattage = $("#wattage").val()
        let r = $("#R").val()
        let data = { "NCCN": [], "RBTT": [], "time": time, "deviation": deviation, "wattage": wattage, "R": r }
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
        $.ajax({
            url: '/api/api-worker',
            contentType: "application/json",
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                // alert(data)
                $("#table-result tbody").html(" ");
                $("#myChart").html(" ");
                $("#graph").html(" ");
                $("#result-NCCN").css("display", "");
                $("#diagram-result").css("display", "");
                $("#graph-result").css("display", "");
                let num_group = data.Numgroups;
                // alert(JSON.stringify(data))
                let groups = data.Groups;
                var dataPoints = []
                var dataPoints_rmax = data.rmax;
                var dataPoints_rmin = data.rmin;
                // alert(dataPoints_rmax);
                // alert(dataPoints_rmin);
                var list_NCCN = data.NCCN;
                // alert(list_NCCN)
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
                    // alert(rows.length);

                }

                $("#table-result").DataTable({
                    dom: "Blfrtip",
                    buttons: [
                        {
                            extend: "copy",
                            className: "btn-sm"
                        },
                        {
                            extend: "csv",
                            className: "btn-sm"
                        },
                        {
                            extend: "excel",
                            className: "btn-sm"
                        },
                        {
                            extend: "pdfHtml5",
                            className: "btn-sm"
                        },
                        {
                            extend: "print",
                            className: "btn-sm"
                        },
                    ],
                    responsive: true
                });
                showDiagram(dataPoints, dataPoints_rmax, dataPoints_rmin)
                draw_graph(data)

            }
        })
    });

});



