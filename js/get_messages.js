var new_div_ele2_width = 550;

function process_messages(results) {
    if (!results) { return; }
    // console.log(results);
    let message_div = document.querySelector("#load_more_messages_result");
    message_div.querySelectorAll("div").forEach(e => e.remove() );
    let nresults = results.reverse();
    for (let m of nresults) {
        let new_div_ele = document.createElement("div");
        let new_div_ele_1 = document.createElement("div");
        let new_div_ele_2 = document.createElement("div");
        new_div_ele_1.textContent = new Date(m.time*1000).toLocaleString();
        new_div_ele_2.textContent = `${m.content}`;
        new_div_ele.append(new_div_ele_1);
        new_div_ele.append(new_div_ele_2);
        let margin = `margin: 2px auto 5px 3px`;
        if (m.dir == 0) {
        } else {
            margin = `margin: 2px 3px 5px auto`;
        }
        new_div_ele.style = `${margin}; position: relative; max-width: ${new_div_ele2_width/1.5}px; border: 1px solid grey; border-radius: 3px; padding: 2px; overflow-wrap: anywhere; overflow-x: auto; width: fit-content;`;
        message_div.append(new_div_ele);
    }
    message_div.scrollTo(0, message_div.scrollHeight);
}

function get_message(user, count) {
    fetch(
        "ajax/get_messages.php",
        {
            body: `with=${user}&num=${count}`,
            method: 'post',
            credentials: 'same-origin',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            type: "json",
        },
    ).then(function (response) {
        response.json().then(function (e) {
            return process_messages(e.success ? e.result : !1);
        })
    }).catch(function (error) {
        console.log("加载历史消息失败：" + error);
        return process_messages(!1)
    })
}

function inject_more_message() {
    let body_div = document.querySelector("#page-content");
    let nav_div = document.querySelector("#top-nav");
    let chatting_div = document.querySelector("#bdwm-chatting");

    let new_div_ele = document.createElement("div");
    let className = "load_more_messages";
    new_div_ele.className = className + " bdwm-chatting";
    new_div_ele.style = `width: ${chatting_div.clientWidth}px; height: ${chatting_div.clientHeight}px; position: relatively; right: 5px; top: ${nav_div.clientHeight+5}px;`;
    let a_ele = document.createElement("a");
    a_ele.className="bdwm-chatting-toggle";
    let i_ele = document.createElement("i");
    i_ele.className="reverse-color bdwm-chatting-iconfont";
    i_ele.textContent = " ";
    a_ele.append(i_ele);
    let t_ele = document.createElement("span");
    t_ele.className = "bdwm-chatting-toggle-text";
    t_ele.textContent = "历史消息";
    a_ele.append(t_ele);
    new_div_ele.append(a_ele);
    body_div.append(new_div_ele);

    let new_div_ele2_height = 350;

    let new_div_ele2 = document.createElement("div");
    new_div_ele2.className = className + " bdwm-chatting open";
    new_div_ele2.style = `width: ${new_div_ele2_width}px; height: ${new_div_ele2_height}px; position: relatively; right: 5px; top: ${nav_div.clientHeight+5}px; display: none;`;
    let btn = document.createElement("button");
    btn.textContent = "×";
    btn.style = "margin: 0px; padding: 0px; font-size: 20px; position: absolute; top: 0px; right: 0px; width: 24px; height: 24px;";
    btn.onclick = function (event) {
        new_div_ele2.style.display = 'none';
        // event.stopPropagation();
        event.preventDefault();
    }
    new_div_ele2.append(btn);
    let btn2 = document.createElement("button");
    btn2.textContent = "Go";
    btn2.style = "margin: 0px; padding: 0px; font-size: 10px; position: absolute; top: 0px; right: 28px; width: 24px; height: 24px;";
    btn2.onclick = function (event) {
        let user = input1.value.trim();
        let count = parseInt(input2.value.trim());
        get_message(user, count);
    }
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.style = "margin: 0px; padding: 2px; font-size: 14px; position: absolute; top: 0px; left: 4px; width: 124px; height: 24px;";
    input1.placeholder = "ID";
    let input2 = document.createElement("input");
    input2.type = "text";
    input2.style = "margin: 0px; padding: 2px; font-size: 14px; position: absolute; top: 0px; left: 136px; width: 34px; height: 24px;";
    input2.placeholder = "count";
    let new_div_ele2_1 = document.createElement("div");
    new_div_ele2_1.style = `margin: 0px; padding: 0px; font-size: 14px; position: relative; top: 30px; left: 2px; width: ${new_div_ele2_width-6}px; height: ${new_div_ele2_height-35}px; border: 1px solid; overflow: auto;`;
    new_div_ele2_1.id = "load_more_messages_result"
    new_div_ele2.append(btn);
    new_div_ele2.append(btn2);
    new_div_ele2.append(input1);
    new_div_ele2.append(input2);
    new_div_ele2.append(new_div_ele2_1);
    body_div.append(new_div_ele2);

    a_ele.onclick = function(event) {
        if (new_div_ele2.style.display == 'none') {
            new_div_ele2.style.display = '';
        } else {
            new_div_ele2.style.display = 'none';
        }
    }
}

inject_more_message()