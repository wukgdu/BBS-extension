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

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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

function draw_one_table(table_node, table_name, which) {
    let table_data = get_one_table(table_node);
    let table_idx = which || 0;
    let data = table_data[table_idx];

    let date2idx = {};
    let idx2date = {};
    for (let i=0; i<data['value'].length; ++i) {
        let ymstr =gen_ym(data['value'][i]); 
        date2idx[ymstr] = i;
        idx2date[i] = [data['value'][i].year, data['value'][i].month];
    }

    let margin = ({top: 20, right: 30, bottom: 30, left: 40});

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
    let y = d3.scaleLinear()
        .domain(d3.extent(data['value'].map(d => d.value))).nice()
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
        .call(d3.axisLeft(y))
    
    svg.append("g").call(x_axis);
    svg.append("g").call(y_axis);
    svg.append("path")
        .datum(data['value'])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line)
}

function main() {
    let tables = d3.selectAll(".table-stat-normal");
    let [login_table, post_table, browse_table] = tables;
    if (!post_table) {
        return;
    }
    // let login_data = get_table(login_table);
    // console.log(login_data);
    // let post_data = get_one_table(post_table);
    // console.log(post_data);
    draw_one_table(login_table, "login-table", 1);
    draw_one_table(post_table, "post-table");
    draw_one_table(browse_table, "browse-table", 3);
}

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting === "hello")
//             sendResponse({ farewell: "goodbye" });
//     }
// );

main();
