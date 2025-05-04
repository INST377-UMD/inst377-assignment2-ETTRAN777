async function fetchQuote() {
    try {
        // Fetch a random quote from the ZenQuotes API
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();

        // Extract the quote and author from the API response
        const quote = data[0].q; // The quote text
        const author = data[0].a; // The author of the quote

        // Update the HTML elements with the fetched quote and author
        document.getElementById("quote").textContent = `"${quote}"`;
        document.getElementById("author").textContent = author;
    } catch (error) {
        console.error("Failed to fetch quote:", error);
        // Fallback in case of an error
        document.getElementById("quote").textContent = "An error occurred while fetching the quote.";
        document.getElementById("author").textContent = "Unknown";
    }
}

function setListening(){
    document.getElementById("stop").style.border = "3px solid #1493f1";
}


// Call the function to fetch and display the quote when the page loads
window.onload = () => {
    fetchQuote();
    setListening();
};