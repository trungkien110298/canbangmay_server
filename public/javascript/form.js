import {draw_graph} from './draw.js';

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
                showDiagram(dataPoints, dataPoints_rmax, dataPoints_rmin)
                draw_graph(data)

            }
        })
    });

});



function showDiagram(data_points, data_points_rmax, data_points_rmin) {
    var label = [];
    var rmin = [];
    var rmax = [];
    for (let    i = 0; i < data_points.length; i++) {
        label.push(i + 1);
        rmin.push(data_points_rmin);
        rmax.push(data_points_rmax);
    }
    




    var theme = {
        color: [
            '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: { color: '#408829' },
                emphasis: { color: '#408829' }
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
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
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
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
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    var echartBar = echarts.init(document.getElementById('echarts'), theme);

    echartBar.setOption({
        title: {
            text: 'Nhịp sản xuất',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['sales', 'purchases']
        },
        toolbox: {
            show: false
        },
        calculable: false,
        xAxis: [{
            type: 'category',
            data: label
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: 'R',
            type: 'bar',
            data: data_points,
            markPoint: {
                data: [{
                    type: 'max',
                    name: 'max'
                }, {
                    type: 'min',
                    name: 'min'
                }]
            },
            markLine: {
                data: [{
                    yAxis: data_points_rmin,
                    name: 'rmin'
                }, {
                    yAxis: data_points_rmax,
                    name: 'rmax'
                }]
            }
        }]
    });
}