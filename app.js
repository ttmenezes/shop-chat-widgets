// Add Tailwind Styles
var linkElement = document.createElement("link");

linkElement.rel = "stylesheet";
linkElement.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

document.head.appendChild(linkElement);
// --------------------

const chatLogoSVG = `
    <svg width="100" height="87" viewBox="0 0 100 87" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M87.5 53.9474C87.5 55.8551 86.622 57.6846 85.0592 59.0336C83.4964 60.3825 81.3768 61.1403 79.1667 61.1403H29.1667L12.5 75.5263V17.9825C12.5 16.0748 13.378 14.2452 14.9408 12.8962C16.5036 11.5473 18.6232 10.7895 20.8333 10.7895H79.1667C81.3768 10.7895 83.4964 11.5473 85.0592 12.8962C86.622 14.2452 87.5 16.0748 87.5 17.9825V53.9474Z" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M33.3333 35.965H33.3745" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M50 35.965H50.0412" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M66.6666 35.965H66.7078" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

const exitLogoSVG = `
    <svg width="40" height="40" viewBox="0 0 59 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4.5L54 52" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M54 5L5 52" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

const chatSendSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" data-id="18">
        <path d="m5 12 7-7 7 7"></path>
        <path d="M12 19V5"></path>
    </svg>`

const chatEndpointURL = 'https://us-central1-teak-formula-418902.cloudfunctions.net/black-lotus-shilajit-chat'

// track conversation with array
const chatList = [{
    role: "bot",
    text: "Hi there! What do you want to know about Black Lotus Shilajit?"
}]

// render these at the bottom

function scrollToBottom(containerId) {
    var container = document.getElementById(containerId);
    container.scrollTop = container.scrollHeight;
    console.log('scrolling down', container.scrollHeight);
}

function pushNewUserChat(chatText) {

    chatList.push({
        role: "user",
        text: chatText
    })

    renderChats();

    scrollToBottom('conversation-scroll-container')
}

// function pushNewResponse(responseText) {
//     var convoContainer = document.getElementById("conversation-container");

//     var botResponse = document.createElement("div");
//     botResponse.className = "rounded-lg p-2 bg-gray-800 text-white dark:bg-gray-800"
//     botResponse.innerText = responseText;

//     convoContainer.appendChild(botResponse);
// }

function createNewResponse() {
    var convoContainer = document.getElementById("conversation-container");

    var botResponse = document.createElement("div");
    botResponse.className = "rounded-tl-lg rounded-tr-lg rounded-br-lg p-2 bg-gray-800 text-white dark:bg-gray-800"
    // botResponse.innerText = responseText;

    convoContainer.appendChild(botResponse);

    return botResponse;
}

// Function to handle receiving text stream data
async function handleStreamResponse(response) {
    const reader = response.body.getReader();
    const responseText = createNewResponse();

    while (true) {
        try {
            const { done, value } = await reader.read();
            if (done) {
                chatList.push({
                    role: "bot",
                    text: responseText.innerText
                })
                renderChats();
                scrollToBottom('conversation-scroll-container');
                break; // Exit the loop if stream is done
            }
            const text = new TextDecoder().decode(value);
            console.log('Received text:', text);
            // Process the received text here
            // pushNewResponse(text);

            responseText.innerText += text;

        } catch (error) {
            console.error('Error reading stream:', error);
            // Handle errors here
        }
    }
}

// Function to initiate connection and handle stream
async function initiateStreamConnection(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await handleStreamResponse(response);
    } catch (error) {
        console.error('Error initiating stream:', error);
        // Handle errors here
    }
}

// Function to submit a chat message and initiate stream connection
function submitChat(text) {
    initiateStreamConnection(chatEndpointURL, { query: text });
}

// Function to create and append the chat widget
function createChatWidget() {
    // Create chat widget element
    var chatWidget = document.createElement("div");
    chatWidget.setAttribute("id", "chat-widget");

    // Add styling classes for responsiveness 
    chatWidget.className = "rounded-lg border bg-card text-card-foreground shadow-sm justify-between flex-col bg-white h-full ml-4 lg:w-[400px] lg:h-[664px] md:ml-0";


    // Style chat widget
    chatWidget.style.position = "fixed";
    chatWidget.style.bottom = "84px";
    chatWidget.style.right = "20px";
    chatWidget.style.maxWidth = "400px";
    chatWidget.style.maxHeight = "664px";
    chatWidget.style.zIndex = "1000";
    // chatWidget.style.backgroundColor = "#fff";
    // chatWidget.style.border = "1px solid #ccc";
    chatWidget.style.display = "none"; // Hide initially

    // Append chat widget to the body
    document.body.appendChild(chatWidget);

    chatWidget.innerHTML = `
        <div class="flex flex-col space-y-1.5 p-6 border-b" data-id="8">
            <div class="flex-1" data-id="9">
                <h2 class="text-lg font-bold leading-none mb-2" data-id="10">Shila - your Shilajit assistant</h2>
                <p class="text-sm leading-none text-gray-500 dark:text-gray-400" data-id="11">
                    Ask me anything about Shilajit! 
                    <span id="tooltip-medical" class="tooltip">
                        &#9432
                    </span>
                </p>
            </div>
        </div>
        <div id="conversation-scroll-container" class="flex-grow p-4 grid gap-4 justify-self-end overflow-y-scroll" data-id="10">
            <div id="conversation-container" class="space-y-2" data-id="11">
                <div class="rounded-tl-lg rounded-tr-lg rounded-br-lg p-2 bg-gray-800 text-white dark:bg-gray-800" data-id="12">
                    Hi there! What do you want to know about Black Lotus Shilajit?
                </div>
            </div>
        </div>`

    // Style tooltip for medical disclaimer
    const tooltip = document.getElementById('tooltip-medical');
    tooltip.style.position = 'relative';
    tooltip.style.display = 'inline-block';

    const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.innerText = 'Black Lotus does not provide medical advice. Please consult a doctor for the benefits and risks of adding any supplement to your diet.';

        tooltipText.style.visibility = 'hidden';
        tooltipText.style.position = 'absolute';
        tooltipText.style.display = "flex";
        tooltipText.style.justifyContent = "center";
        tooltipText.style.alignItems = "center";
        tooltipText.style.width = '15rem';
        tooltipText.style.backgroundColor = '#d3d3d3';
        tooltipText.style.color = '#36454F';
        tooltipText.style.textAlign = 'center';
        tooltipText.style.borderRadius = '3px';
        tooltipText.style.padding = '5px 0';
        tooltipText.style.zIndex = '1';
        tooltipText.style.bottom = '95%';
        tooltipText.style.left = '50%';
        tooltipText.style.marginLeft = '-110px';
        tooltipText.style.opacity = '0';
        tooltipText.style.transition = 'opacity 0.2s';
        tooltipText.style.fontSize = '0.6rem'

    tooltip.appendChild(tooltipText);

    tooltip.addEventListener('mouseover', () => {
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
    });

    tooltip.addEventListener('mouseout', () => {
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
    });


    // chat chips
    var chatChipsContainer = document.createElement("div");
    chatChipsContainer.setAttribute("id", "chips-container");
    chatChipsContainer.className = "flex flex-row space-x-2 pl-2 pr-2 pt-2";

    const chipsText = ["What is it?", "How do I take it?", "Health benefits?"]
    chipsText.forEach((text) => {
        var chatChip = document.createElement("div");
        chatChip.className = "text-gray-800 px-3 py-1 rounded-full text-xs border-4 border-gray-600 hover:bg-gray-600 hover:text-white cursor-pointer";
        chatChip.innerText = text;
        chatChipsContainer.appendChild(chatChip);

        chatChip.addEventListener("click", () => {
            pushNewUserChat(text);
            submitChat(text);
        });
    })

    chatWidget.appendChild(chatChipsContainer);

    // chat input

    var chatInputContainer = document.createElement("div");
    chatInputContainer.setAttribute("id", "chat-container");
    chatInputContainer.className = "mt-auto p-4";

    var chatInputBar = document.createElement("div");
    chatInputBar.setAttribute("id", "chat-bar");
    chatInputBar.className = "flex space-x-2";

    var chatInputEl = document.createElement("input");
    chatInputEl.className = "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-w-0 rounded-full"
    chatInputEl.placeholder = "Type a message..."

    var chatSendBtn = document.createElement("button");
    chatSendBtn.className = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-full h-10"
    chatSendBtn.innerHTML = chatSendSVG;

    function processChat() {
        const chatText = chatInputEl.value;
        pushNewUserChat(chatText);
        submitChat(chatText);
        chatInputEl.value = "";
    }

    chatSendBtn.addEventListener("click", processChat);
    chatInputEl.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            processChat();
        }
    })

    chatInputBar.appendChild(chatInputEl);
    chatInputBar.appendChild(chatSendBtn);
    chatInputContainer.appendChild(chatInputBar);
    chatWidget.appendChild(chatInputContainer);
}

// Function to toggle the chat widget visibility
function toggleChatWidget() {
    var chatWidget = document.getElementById("chat-widget");
    var circleIcon = document.getElementById("circle-icon");
    if (chatWidget.style.display === "none") {
        chatWidget.style.display = "flex";
        circleIcon.innerHTML = exitLogoSVG;
    } else {
        chatWidget.style.display = "none";
        circleIcon.innerHTML = chatLogoSVG;
    }
}

// Function to create and append the circle icon button
function createCircleIcon() {
    // Create circle icon element
    var circleIcon = document.createElement("div");
    circleIcon.setAttribute("id", "circle-icon");

    circleIcon.className = "bg-gray-700 p-3"
    
    // Style circle icon
    circleIcon.style.position = "fixed";
    circleIcon.style.bottom = "20px";
    circleIcon.style.right = "20px";
    circleIcon.style.width = "50px";
    circleIcon.style.height = "50px";
    circleIcon.style.borderRadius = "50%";
    circleIcon.style.cursor = "pointer";
    circleIcon.style.display = "flex";
    circleIcon.style.justifyContent = "center";
    circleIcon.style.alignItems = "center";
    circleIcon.style.color = "#fff";
    circleIcon.style.fontSize = "24px";
    circleIcon.style.zIndex = "1000";

    // Set icon text
    // circleIcon.innerText = "+";
    circleIcon.innerHTML = chatLogoSVG;

    // Add click event listener to toggle chat widget visibility
    circleIcon.addEventListener("click", toggleChatWidget);

    // Append circle icon to the body
    document.body.appendChild(circleIcon);
}

function renderChats() {
    var convoContainer = document.getElementById("conversation-container");
    convoContainer.innerHTML = "";
    
    chatList.forEach((chat) => {
        var newChat = document.createElement("div");
        newChat.innerText = chat.text

        if (chat.role === "bot") {
            newChat.className = "rounded-tl-lg rounded-tr-lg rounded-br-lg p-2 bg-gray-800 text-white dark:bg-gray-800";
        } else {
            newChat.className = "rounded-tl-lg rounded-tr-lg rounded-bl-lg p-2 bg-gray-100 dark:bg-gray-800";
        }
        convoContainer.appendChild(newChat);
    })
}

// Call functions to create and append elements
createChatWidget();
createCircleIcon();

renderChats();


// deprecated - non-streaming chat response
// async function postData(url = '', data = {}) {
//     // Default options are marked with *
//     const response = await fetch(url, {
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         headers: {
//         'Content-Type': 'application/json'
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });

//     console.log('response',response);
    
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
    
//     return response.text(); // Return response text
// }

// function submitChat(text) {
//     postData(chatEndpointURL, { query: text })
//         .then(data => {
//             console.log('Success:', data);
//             pushNewResponse(data);
//             // Handle the response data here (data is the text response)
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             // Handle errors here
//         });
// }
