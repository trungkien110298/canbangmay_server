// import G6 from "@antv/g6";

export function draw_graph(group_data) {
    let array1 = group_data.array1;
    let array2 = group_data.array2;
    let list_edge = group_data.edge;
    
    const width = document.getElementById('graph').scrollWidth;
    const height = 500;
    
    let  edges = [];
    let nodes = [];
    for (let i in array1){
        let node = {
            id: array1[i].id,
            x: width/2 - 150,
            y: 100 + i*100,
            type: 'alps',
            name: array1[i].label + 1,
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
            name: array2[i].label + 1,
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