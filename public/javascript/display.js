
export function display_graph(group_data) {
    let array1 = group_data.array1;
    let array2 = group_data.array2;
    let list_edge = group_data.edge;
    
    const width = document.getElementById('graph').scrollWidth;
    const height = Math.max(array1.length, array2.length)*100 + 100;
    let  edges = [];
    let nodes = [];
    for (let i in array1){
        let node = {
            id: array1[i].id,
            x: width/2 - 150,
            y: 100 + i*100,
            type: 'alps',
            name: array1[i].label,
            conf: []
        }
        nodes.push(node)
    }

    for (let i in array2){
        let node = {
            id: array2[i].id,
            x: width/2 + 150,
            y: 100 + i*100,
            type: 'alps',
            name: array2[i].label,
            conf: []
        }
        
        nodes.push(node)
    }

    for (let i in list_edge){
        let u = list_edge[i].u.toString();
        let v = list_edge[i].v.toString();
        let edge = {
            source: u,
            target: v,
        }
      
        edges.push(edge)
    }

    const data = {
        nodes: nodes,
        edges: edges
    };
    
    G6.registerNode('sql', {
        drawShape(cfg, group) {
            const rect = group.addShape('rect', {
                attrs: {
                    x: -75,
                    y: -25,
                    width: 150,
                    height: 50,
                    radius: 10,
                    stroke: '#5B8FF9',
                    fill: '#C6E5FF',
                    lineWidth: 3
                }
            });
            if (cfg.name) {
                group.addShape('text', {
                    attrs: {
                        text: cfg.name,
                        x: 0,
                        y: 0,
                        fill: '#00287E',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontWeight: 'bold'
                    }
                });
            }
            return rect;
        }
    },
        'single-shape');
    G6.Global.nodeStateStyle.selected = {
        stroke: '#d9d9d9',
        fill: '#5394ef'
    };

    
    const graph = new G6.Graph({
        container: 'graph',
        width,
        height,
//         layout: {
//             type: 'grid'
// //             center: [200, 200], // The center of the graph by default
// //             linkDistance: 50, // The edge length
// //             preventOverlap: true, // nodeSize or size in data is required for preventOverlap: true
// //             nodeSize: 30,
// //             sweep: 10,
// //             equidistant: false,
// //             startAngle: 0,
// //             clockwise: false,
// //             maxLevelDiff: 10,
// //             sortBy: 'degree',
// //             workerEnabled: true, // Whether to activate web-worker
//         },
        pixelRatio: 2,
        defaultNode: {
            shape: 'sql'
        },
        defaultEdge: {
            shape: 'line',
            style: {
                radius: 20,
                offset: 45,
                endArrow: true,
                lineWidth: 2,
                stroke: '#C2C8D5'
            }
        },
        modes: {
            default: ['drag-canvas', 'zoom-canvas', 'click-select', {
                type: 'tooltip',
                formatText(model) {
                    const cfg = model.conf;
                    const text = [];
                    cfg.forEach(row => {
                        text.push(row.label + ':' + row.value + '<br>');
                    });
                    return text.join('\n');
                },
                shouldUpdate: e => {
                    if (e.target.type !== 'text') {
                        return false;
                    }
                    return true;
                }
            }]
        },
//         fitView: true
    });
    graph.data(data);
    graph.render();

}

export function display_chart(data_points, data_points_rmax, data_points_rmin) {
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
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
					title: "Save Image"
                }
            }
        },
        calculable: false,
        xAxis: [{
            type: 'category',
            data: label
        }],
        yAxis: [{
            type: 'value',
            max: Math.ceil(data_points_rmax/10)*10
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