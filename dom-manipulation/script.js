const quote = document.getElementById("newQuoteText");
const author = document.getElementById("author");
const category = document.getElementById("newQuoteCategory");
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter")
const addQuote = document.getElementById("addQuote")


showRandomQuote = function(){
    if (quote.value !== "" && author.value !== "" && category.value !== "")
     {
    const quoteObject = {quote:quote.value, author:author.value, category:category.value};
   

    category = document.createElement("option");
                category.innerHTML = category.value;
categoryFilter.appendChild(category)


    const quoteKey = generateQuoteKey();
    localStorage.setItem(quoteKey, JSON.stringify(quoteObject) );
       
    }
        
quote.value="";
author.value="";
category.value="";
createAddQuoteForm();

}

function generateQuoteKey(){
    return 'quote_' + new Date().getTime();
}


  function createAddQuoteForm() {
    quoteDisplay.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
      const quoteKey = localStorage.categoryKey(i);
      if (quoteKey.startsWith('quote_')) {
        const storedQuote = JSON.parse(localStorage.getItem(quoteKey));
        const div = document.createElement('div');
        div.className = 'quote-item';
        div.innerHTML = `
          "${storedQuote.quote}" - <strong>${storedQuote.author}</strong> -
          <button onclick="removeQuote('${quoteKey}')">Remove</button>
        `;
        quoteDisplay.appendChild(div);
      }
    }
  }

  function removeQuote(quoteKey) {
    localStorage.removeItem(quoteKey);
    createAddQuoteForm();
  }

  addQuote.addEventListener('click', showRandomQuote);

  // Initial display
  createAddQuoteForm();





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

function showRandomQuote(){}
