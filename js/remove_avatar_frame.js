function remove_avatar_frame() {
    let portrait_container_dom = document.querySelectorAll(".portrait-container");
    portrait_container_dom.forEach(function (node) {
        let className = "remove_avatar_frame_button";
        if (node.querySelector(`.${className}`)) { return; }
        let avatar_frame = node.querySelector(".avatar-frame");
        if (!avatar_frame) { return; }
        let btn = document.createElement("button");
        btn.textContent = "×";
        btn.style = "margin: 0px; padding: 0px; font-size: 10px; position: absolute; top: 0px; left: 0px; width: 14px; height: 14px;";
        btn.className = className;
        btn.onclick = function (event) {
            avatar_frame.remove();
            // event.stopPropagation();
            event.preventDefault();
        }
        node.append(btn);
    });
}

remove_avatar_frame();
