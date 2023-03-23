function genFormData(data) {
    let s = "";
    for (let k in data) {
        s += `${k}=${JSON.stringify(data[k])}`;
    }
    return s;
}

async function searchUser(userName) {
    const userInfoUrl = "https://bbs.pku.edu.cn/v2/ajax/get_userinfo_by_names.php";
    let data = genFormData({names: [userName]});
    let res = await fetch(userInfoUrl, {
        method: "POST",
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    });
    return res.json();
}

function travelP(postContentDom) {
    let pDoms = postContentDom.childNodes;
    for (let pDom of pDoms) {
        if (pDom.nodeType == pDom.TEXT_NODE) {
            let textContent = new String(pDom.textContent);
            textContent = textContent.replaceAll("\u00a0", " ");
            let aMatches = textContent.matchAll("@[a-zA-Z_]+");
            let validMentions = [];
            for (let aMatch of aMatches) {
                let index = aMatch.index ?? -1;
                if (index < 0) { continue; }
                let content = aMatch[0];
                let eIndex = index + content.length;
                if ((index == 0) || (textContent[index-1]==' ')) {
                    if ((eIndex == textContent.length) || (textContent[eIndex]==" ")) {
                        // console.log(aMatch);
                        validMentions.push({
                            s: index,
                            e: eIndex,
                            id: content,
                        });
                    }
                }
            }
            if (validMentions.length == 0) { continue; }
            let spanDom = document.createElement("span");
            let lastIndex = 0;
            for (let validMention of validMentions) {
                spanDom.append(textContent.slice(lastIndex, validMention.s));
                lastIndex = validMention.e;
                let aDom = document.createElement("span");
                aDom.textContent = validMention.id;
                aDom.style.color = "#e97c62";
                aDom.style.cursor = "pointer";
                aDom.onclick = async function () {
                    let userName = validMention.id.slice(1);
                    let res = await searchUser(userName);
                    if ((res.success === true) && (res.result.length > 0)) {
                        let userInfo = res.result[0];
                        window.location.href = `https://bbs.pku.edu.cn/v2/user.php?uid=${userInfo.id}`;
                    }
                }
                spanDom.appendChild(aDom);
            }
            spanDom.append(textContent.slice(lastIndex));
            pDom.parentNode.replaceChild(spanDom, pDom);
        } else if (pDom.nodeType == pDom.ELEMENT_NODE) {
            travelP(pDom);
        }
    }
}

function highLightUsers() {
    let postContentDoms = document.querySelectorAll(".body.file-read");
    // console.log(postContentDoms);
    for (let postContentDom of postContentDoms) {
        travelP(postContentDom);
    }
}

highLightUsers();
