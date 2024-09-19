/**
 * This facilitates communication from the content script to the UI Script
 * all it really should do is add a listener for the content script, 
 * send out an event to the popup script after persisting the data to chrome storage
 */

let matchingPath = "mainIssueAggQuery";
let tabId = 0;
const filter =  { urls: ['https://autocrib.atlassian.net/gateway/api/graphql/*'] };

console.log('service workers')

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    tabId = details.tabId;
    currentUrl = details.url;
});

// 1. Add event listener for content message
chrome.webRequest.onCompleted.addListener(
    (details) => { 
       console.log(details)
       if(details.url.indexOf(matchingPath) > -1 && tabId) {
        chrome.tabs.sendMessage(tabId, {type: 'page-rendered'});
       }
    }
    , filter);


// 2. save data from the content message

// 3. send message with that same data to the popup js (emit event)