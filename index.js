document.onreadystatechange = updateClock()

function updateClock() {
    const date = new Date()
    document.getElementById("current-time-text").innerText = date.toLocaleTimeString([], { hourCycle: 'h23' })
    const hour = date.getHours()
    if (hour < 5 || hour >= 18) {
        document.getElementById("time-greeting-text").innerText = "Noswaith dda, Iolo."
    }
    else if (hour < 12) {
        document.getElementById("time-greeting-text").innerText = "Bore da, Iolo."
    }
    else {
        document.getElementById("time-greeting-text").innerText = "Prynhawn da, Iolo."
    }
}

setInterval(updateClock, 1000)

function doSearch() {
    const query = document.getElementById('search-input').value
    switch (document.getElementById("search-engine-select").value) {
        case 'google':
            window.location.href = `https://www.google.com/search?q=${query}`
            break;
        case 'bing':
            window.location.href = `https://www.bing.com/?q=${query}`
            break;
        case 'ddg':
            window.location.href = `https://www.duckduckgo.com/?q=${query}`
    }
}

const searchInput = document.getElementById("search-input")
searchInput.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
        document.getElementById("search-button").click();
    }
});


// DARK THEME TOGGLE MADE FROM https://lukelowrey.com/css-variable-theme-switcher/
var toggle = document.getElementById("theme-toggle");

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)


toggle.onclick = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
};