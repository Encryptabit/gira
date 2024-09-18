/**
 * This is the page responsible for reading the DOM, should be injected
 * on every page where that matches the urls in the manifest. For the early
 * iterations of this plugin I will start with reading headers and linked issues
 * probably. Later I may add optimizations that permit parsing an entire pag
 * */


/**
 * Needed a function that works on both versions of ticket views we encounter
 */
function getTicketInfoFromCloud() {
    const parsedInfo = {};
    const token = (window.location.href.indexOf('selectedIssue') === -1) ? '/' : '=';
    const ticketNumber = window.location.href.split(token).pop();
    const ticketTitle = [...document.querySelectorAll('h1[class]')].at(-1).innerText;

    parsedInfo[ticketNumber] = ticketTitle;

    return parsedInfo;
}

function getTicketFromPR() {
    return 'Aw41-10579'
}

// 1. initialize buckets, should be a dictionary with dictionaries of associations
let associationContainer = {};
let association = {};
let associations = [];

// 2. Read relevant DOM objects and parse them into a usable format


// 3. Store the information in localStorage for persistance.