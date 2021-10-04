function findByTextContent(needle, haystack, precise) {
    // needle: String, the string to be found within the elements.
    // haystack: String, a selector to be passed to document.querySelectorAll(),
    //           NodeList, Array - to be iterated over within the function:
    // precise: Boolean, true - searches for that precise string, surrounded by
    //                          word-breaks,
    //                   false - searches for the string occurring anywhere
    let elems;

    // no haystack we quit here, to avoid having to search
    // the entire document:
    if (!haystack) {
        return false;
    }
    // if haystack is a string, we pass it to document.querySelectorAll(),
    // and turn the results into an Array:
    else if ('string' == typeof haystack) {
        elems = [].slice.call(document.querySelectorAll(haystack), 0);
    }
    // if haystack has a length property, we convert it to an Array
    // (if it's already an array, this is pointless, but not harmful):
    else if (haystack.length) {
        elems = [].slice.call(haystack, 0);
    }

    // work out whether we're looking at innerText (IE), or textContent 
    // (in most other browsers)
    let textProp = 'textContent' in document ? 'textContent' : 'innerText',
        // creating a regex depending on whether we want a precise match, or not:
        reg = precise === true ? new RegExp('\\b' + needle + '\\b') : new RegExp(needle),
        // iterating over the elems array:
        found = elems.filter(function (el) {
            // returning the elements in which the text is, or includes,
            // the needle to be found:
            return reg.test(el[textProp]);
        });
    return found.length ? found : false;;
}

function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


async function run() {
    let totalPageRegex = /\d+/g;
    let totalPageMatch,totalPageVal,currPage ,currPageVal;
    
    try {
        totalPageMatch = document.querySelectorAll("span[class='z-paging-text']")[1].textContent.match(totalPageRegex);
        totalPageVal = totalPageMatch ? totalPageMatch[0] : 1;
        currPage = document.querySelector("input[class='z-paging-inp']");
        currPageVal = currPage ? currPage.value : 1;
    } catch(e) {
        return;
    }
    for (let i = currPageVal; i <= totalPageVal; i++) {
        let currIdx = 0;
        let pageSize = findByTextContent('.pdf', document.querySelectorAll('a'), false).length;
        while (currIdx < pageSize) {
            await sleep(3000)
            let list = findByTextContent('.pdf', document.querySelectorAll('a'), false);
            list[currIdx].click();
            await waitForElm("div[class='z-window-modal-icon z-window-modal-close']");
            await sleep(3000)
            document.getElementsByClassName('z-window-modal-icon z-window-modal-close')[0].click();
            currIdx++;
        }
        document.getElementsByClassName('z-paging-next')[0].click();
        console.log("go to next page")
        await sleep(3000);
    }
    console.log('end auto read.');
    alert('VO auto finished');
}

run();
