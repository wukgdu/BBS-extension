function hide_me_helper(selector, content) {
    let that_dom = document.querySelector(selector);
    if (that_dom != null) {
        that_dom.textContent = content;
    }
}

function hide_me() {
    let portrait_avatar_dom = document.querySelector(".portrait-container .portrait.pic");
    if (portrait_avatar_dom != null) {
        portrait_avatar_dom.src = "https://bbs.pku.edu.cn/v2/images/user/portrait-neu.png";
    }
    hide_me_helper(".username span[data-role=login-username]", "guest");
    hide_me_helper("#detail-list li[data-role=login-nickname]", "昵称：游客");
    hide_me_helper("#detail-list li[data-role=login-rankname]", "等级：初级站友");
    hide_me_helper("#detail-list li[data-role=login-numposts]", "文章：0");
}

hide_me();
