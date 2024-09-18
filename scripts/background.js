/**
 * This facilitates communication from the content script to the UI Script
 * all it really should do is add a listener for the content script, 
 * send out an event to the popup script after persisting the data to chrome storage
 */


// 1. Add event listener for content message

// 2. save data from the content message

// 3. send message with that same data to the popup js (emit event)