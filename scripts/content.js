/**
 * This is the page responsible for reading the DOM, should be injected
 * on every page where that matches the urls in the manifest. For the early
 * iterations of this plugin I will start with reading headers and linked issues
 * probably. Later I may add optimizations that permit parsing an entire page
 * */

// 1. initialize buckets, should be a dictionary with dictionaries of associations
let associationContainer = {};
let associations = [];

document.addEventListener("DOMContentLoaded", pageLoadHandler);

function pageLoadHandler() {
  const isSprintBoard = window.location.href.indexOf(
    "autocrib.atlassian.net/jira/software/c/projects"
  );
  const isTicketInfo = window.location.href.indexOf(
    "autocrib.atlassian.net/browse/"
  );

  const isTfs = window.location.href.indexOf(
    "tfs.autocrib.local/tfs/AutoCrib%20Git%20Repository/autocrib/_git/"
  );

  if (!isTicketInfo && !isTfs && !isSprintBoard) {
    // This shouldnt be hit because of the manifest
    document.removeEventListener("DOMContentLoaded", pageLoadHandler);
    return;
  }

  if (isTicketInfo) {
    const currentTicket = getTicketInfoFromCloud();

    // associations.push(currentTicket);
    // associationContainer[Object.keys(currentTicket)[0]] = currentTicket;
  }

  // We'll add sprint board later, there's cards and links to consider (buttons with a classList length of 6)
  //   if (isSprintBoard) {
  //     [...document.querySelectorAll("a[href]:")]
  //       .filter((el) => {
  //         return el.getAttribute("href").indexOf("/browse/") !== -1;
  //       })
  //       .map((el) => {
  //         console.log(el);
  //         el.addEventListener("click", (event) => {
  //           //let association = getTicketInfoFromCloud();
  //           console.log(event);
  //         });
  //       });
  //   }
}

/**
 * Needed a function that works on both versions of ticket views we encounter
 * can also override functionality by just flatout passing ticket number
 */
function getTicketInfoFromCloud() {
  const parsedInfo = {};
  const token =
    window.location.href.indexOf("selectedIssue") === -1 ? "/" : "=";
  const ticketNumber = window.location.href.split(token).pop();
  const ticketTitle = [...document.querySelectorAll("h1[class]")].at(
    -1
  ).innerText;

  parsedInfo["number"] = ticketNumber;
  parsedInfo["title"] = ticketTitle;
  parsedInfo["link"] = `https://autocrib.atlassian.net/browse/${ticketNumber}`;

  // Need to add associated tickets via Linked Tickets and children

  return parsedInfo;
}

// Function to pull child/linked issues eventually

function computeAssociations(ticketFromJira) {
  let ticketCache = associationContainer[ticketFromJira.number];
  const tfsTickets = getTicketInfoFromTfs();

  if (!ticketCache) {
    ticketCache = {};
    tfsTickets.forEach((_, ticket) => {
      ticketCache.tfs = {};
      ticketCache.tfs["ticket"];
    });
  }
}

/**
 * This should grab the ticket number(s) present in the title of the PR, the title association
 * however will be determined by what's in JIRA, as a single source of truth
 */
function getTicketInfoFromTfs() {
  const pattern = /([a-zA-z]{2,4}[0-9]*)-\d*/g;

  const title = document.querySelector(".bolt-header-title-row").innerText;
  const parsedInfoContainer = title.match(pattern).map((ticket) => {
    const parsedInfo = {};
    parsedInfo["number"] = ticket;
    parsedInfo["title"] = title;
    parsedInfo["link"] = window.location.href;

    return parsedInfo;
  });

  return parsedInfoContainer;
}

// Example Cloud Response: {number: 'AW41-10573', title: 'Enforce permissions on email users entering a site as a distributor Super-User', link: 'https://autocrib.atlassian.net/browse/AW41-10573'}
// Example tfs Response: {number: 'AW41-10573', title: 'Merged PR 9921: AW41-10573/AW41-10574: Enforce permissions on email users ent...\nBrowse Files', link: 'https://tfs.autocrib.local/tfs/AutoCrib%20Git%20Re…f561797e5bb1f8f747?refName=refs%2Fheads%2Fdevelop'} link : "https://tfs.autocrib.local/tfs/AutoCrib%20Git%20Repository/autocrib/_git/ac-website/commit/cb054e12a8ed4fa6bd12fdf561797e5bb1f8f747?refName=refs%2Fheads%2Fdevelop" number : "AW41-10573" title : "Merged PR 9921: AW41-10573/AW41-10574: Enforce permissions on email users ent...\nBrowse Files"

// 2. Read relevant DOM objects and parse them into a usable format

// 3. Store the information in localStorage for persistance.
