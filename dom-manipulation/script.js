const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const createAddQuoteForm = document.getElementById("createAddQuoteForm");
const quoteTextInput = document.getElementById("quoteText");
const quoteAuthorInput = document.getElementById("quoteAuthor");
const quoteCategoryInput = document.getElementById("quoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Initial quote list from localStorage or mock
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Simulated API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// === UTILITIES ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function notify(msg, type = "info") {
  notification.style.display = "block";
  notification.textContent = msg;
  notification.style.backgroundColor = type === "error" ? "#dc3545" : "#28a745";
  setTimeout(() => (notification.style.display = "none"), 4000);
}

// === POPULATE DROPDOWN ===
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const savedFilter = localStorage.getItem("lastSelectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// === FILTERING ===
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes found in this category.";
    return;
  }

  const showRandomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `"${showR.text}" — <strong>${showRandomQuote.author}</strong> <em>(${showR.category})</em>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(showRandomQuote));
}

function restoreLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    quoteDisplay.innerHTML = `"${q.text}" — <strong>${q.author}</strong> <em>(${q.category})</em>`;
  }
}

// === ADD QUOTE ===
createAddQuoteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newQuote = {
    text: quoteTextInput.value.trim(),
    author: quoteAuthorInput.value.trim(),
    category: quoteCategoryInput.value.trim()
  };

  if (newQuote.text && newQuote.author && newQuote.category) {
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    createAddQuoteForm.reset();
    notify("Quote added!");
  }
});

// === FETCH FROM MOCK SERVER ===
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      author: "API User",
      category: "Server"
    }));

    let updated = false;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(
        q => q.text === serverQuote.text && q.author === serverQuote.author
      );
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      notify("New quotes synced from server.");
    }
  } catch (err) {
    notify("Failed to sync from server.", "error");
  }
}

//Import and Export Quotes
 function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }



// === PERIODIC SYNC ===
setInterval(fetchQuotesFromServer, 15000); // every 15s

// === INIT ===
newQuoteBtn.addEventListener("click", filterQuotes);
categoryFilter.addEventListener("change", filterQuotes);

populateCategories();
restoreLastQuote();
filterQuotes();
fetchQuotesFromServer(); // Initial fetch
