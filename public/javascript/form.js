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
        function renumber(){
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
            success: function(data){
                alert(data["Numgroups"])
            } 
        })
    });


});