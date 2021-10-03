chrome.runtime.onInstalled.addListener(() => {
    console.log('hello baby.');
    
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id, allFrames: true },
            files: ['app.js']
        }, () => { });
});