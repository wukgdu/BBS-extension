function shortNum(d) {
    var array = ['', 'K', 'M', 'G', 'T', 'P'];
    var i = 0;
    while (d >= 1000) {
        i++;
        d = d / 1000;
    }
    d = d + '' + array[i];
    return d;
}
function shortNum2(d) {
    var array = ['', 'K', 'M', 'G', 'T', 'P'];
    var i = 0;
    while (d >= 1000) {
        i++;
        d = d / 1000;
    }
    return [d, array[i]];
}
function genTickInfo(minvalue, maxvalue, count, add1=false) {
    minvalue = 0;
    let maxdata = maxvalue;
    // console.log(maxvalue)
    let tickValues = {
        tickValues: [],
        unit: 1,
        tickValuesSmall: [],
        maxV: 10,
    }
    if (maxvalue > 0) {
        let temp = 10**Math.trunc(Math.log10(maxvalue));
        let temp2 = maxvalue/temp;
        if (add1) {
            temp2 += 1;
        }
        maxdata = Math.ceil(temp2)*temp;
        let maxdatasmall = Math.ceil(temp2);
        if (Math.round(temp2) != Math.ceil(temp2)) {
            maxdata = (Math.floor(temp2) + 0.5) * temp;
            maxdatasmall = Math.floor(temp2) + 0.5;
        }
        // console.log(maxdata, maxdatasmall)
        let delta = (maxdatasmall - minvalue) / count;
        let [shortUnit1, shortUnit2] = shortNum2(temp);
        let divinum = 100;
        for (let i=minvalue; i<=maxdatasmall; i+=delta) {
            // toFixed(1), temp>5: only for count=5
            let cv = parseFloat((i).toFixed(1));
            let v = cv*temp;
            if (temp > 5) {
                v = Math.round(v);
            } else {
                v = cv;
            }
            tickValues.tickValues.push(v);
            if (temp <= divinum) {
                let v = cv*temp;
                if (temp > 5) {
                    v = Math.round(v);
                } else {
                    v = cv;
                }
                tickValues.tickValuesSmall.push(v);
            } else {
                let v = cv*shortUnit1;
                if (shortUnit1 > 5) {
                    v = Math.round(v);
                }
                tickValues.tickValuesSmall.push(v);
            }
        }
        if (temp <= divinum) {
            tickValues.unit = 1;
        } else {
            tickValues.unit = temp / shortUnit1;
        }
        tickValues.maxV = maxdata;
    } else {
        maxdata = 10*count;
        for (let i=0; i<=count; ++i) {
            tickValues.tickValues.push(i*10);
            tickValues.tickValuesSmall.push(i*10);
        }
        tickValues.maxV = maxdata;
    }
    return [maxdata, tickValues];
}

function get_one_table(table_node) {
    let table = d3.select(table_node);
    let thead = table.select("thead");
    let tbody = table.select("tbody");
    let trows = tbody.selectAll("tr");
    let tseek = tbody.select("tr").select("th").attr("rowspan");
    if (tseek) {
        tseek =+ tseek;
    } else {
        tseek = 1;
    }
    let tr_nodes = trows.nodes();
    let tr_nodes_years = [];
    for (let i=0; i<tr_nodes.length; i+=tseek) {
        let tr_nodes_year = tr_nodes.slice(i, i+tseek);
        tr_nodes_years.push(tr_nodes_year);
    }
    let data = new Array(tseek);
    for (let i=0; i<tseek; ++i) {
        data[i] = {
            "title": "",
            "value": [],
        }
    }
    for (let y=0; y<tr_nodes_years.length; ++y) {
        let year_nodes = tr_nodes_years[y];
        let datum_year = parseInt(year_nodes[0].children[0].textContent);
        for (let i=0; i<tseek; ++i) {
            let m_start = (i==0)?1:0;
            if (y==0) {
                data[i]['title'] = year_nodes[i].children[m_start].textContent;
            }
            for (let m=1; m<=12; ++m) {
                data[i]['value'].push({
                    'year': datum_year,
                    'month': m,
                    'value': year_nodes[i].children[m+m_start].textContent,
                });
            }
        }
    }
    for (let i=0; i<tseek; ++i) {
        data[i]['value'] = data[i]['value'].filter(d => d.value != '-');
        data[i]['value'].forEach(d => d.value = +d.value);
    }
    return data;
}

function gen_ym(d) {
    return `${d.year}-${d.month}`;
}

function gen_fake_idx2date(delta, y, m) {
    let dy = Math.trunc(delta/12);
    let dm = Math.trunc(delta%12);
    let resy = y+dy;
    let resm = m+dm;
    let mm = 0;
    if (resm > 12) {
        mm = 1;
    } else if (resm < 1) {
        mm = -1;
    }
    if (mm != 0) {
        resy += mm;
        resm -= mm * 12;
    }
    return [resy, resm];
}

function draw_single_table(data, table_name, table_node) {
    let date2idx = {};
    let idx2date = {};
    for (let i=0; i<data['value'].length; ++i) {
        let ymstr =gen_ym(data['value'][i]); 
        date2idx[ymstr] = i;
        idx2date[i] = [data['value'][i].year, data['value'][i].month];
    }

    let margin = ({top: 25, right: 30, bottom: 30, left: 40});

    d3.select(`.new_div.${table_name}`).remove();
    let new_div_ele = document.createElement("div");
    new_div_ele.className = "new_div" + " " + table_name;
    insertAfter(table_node, new_div_ele);
    let new_div = d3.select(`.new_div.${table_name}`);
    // new_div.style("width", "100%");
    new_div.style("height", parseFloat(new_div.style("width"))*0.3+"px");
    let svg = new_div.append("svg")
        .style("width", "100%")
        .style("height", "100%")
    let width = parseFloat(new_div.style("width"));
    let height = parseFloat(new_div.style("height"));

    let x = d3.scaleLinear()
        .domain([0, data['value'].length-1]).nice()
        .range([margin.left, width-margin.right]);
    let [vmin, vmax] = d3.extent(data['value'].map(d => d.value));
    let [maxV, tickValues] = genTickInfo(0, vmax, 5);
    // console.log(tickValues)
    let y = d3.scaleLinear()
        .domain([vmin, maxV])
        .range([height-margin.bottom, margin.top]);
    
    let line = d3.line()
        .x(d => x(date2idx[gen_ym(d)]))
        .y(d => y(d.value));
    
    let x_axis = g => g
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d => {
            let y = null, m = null;
            if (idx2date[d]) {
                [y, m] = idx2date[d];
            } else {
                let maxk = Math.max(...Object.keys(idx2date).map(d => +d));
                let [tempy, tempm] = idx2date[maxk];
                [y, m] = gen_fake_idx2date(+d-maxk, tempy, tempm);
            }
            return `${y}-${m}`;
        }))

    let y_axis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).tickValues(tickValues.tickValues).tickFormat(shortNum));
    
    svg.append("g").call(x_axis);
    svg.append("g").call(y_axis);
    svg.append("g").append("text")
        .style("alignment-baseline", "text-before-edge")
        .text(table_name);
    svg.append("path")
        .datum(data['value'])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line)
}

function draw_one_table(table_node) {
    let table_data = get_one_table(table_node);
    for (let data of table_data.reverse()) {
        let table_single_title = data['title'];
        table_single_title = table_single_title.split(" ")[0].split("(")[0].split("（")[0];
        draw_single_table(data, table_single_title, table_node);
    }
}

function show_stat() {
    // console.log("42", Date(Date.now()));
    let tables = d3.selectAll(".table-stat-normal");
    let [login_table, post_table, browse_table] = tables;
    if (!post_table) {
        return;
    }
    // console.log("43", Date(Date.now()));
    // let login_data = get_table(login_table);
    // console.log(login_data);
    // let post_data = get_one_table(post_table);
    // console.log(post_data);
    draw_one_table(login_table);
    draw_one_table(post_table);
    draw_one_table(browse_table);
}

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender);
//         console.log(request);
//         if (request.action === "userstat") {
//             main();
//             // sendResponse({ farewell: "goodbye" });
//         }
//     }
// );

show_stat();
