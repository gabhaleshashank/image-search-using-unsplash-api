// access key = "1PnPHAtv9aRZhKca-tlq2tU-xlA2sI_WE12e0uT-LvQ";
const accessKey = "1PnPHAtv9aRZhKca-tlq2tU-xlA2sI_WE12e0uT-LvQ";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");

let inputData = "";
let page = 1;
let loading = false;

// Fetch images from Unsplash API
async function searchImages() {
    if (loading) return;
    loading = true;

    inputData = inputEl.value.trim();
    if (!inputData) {
        loading = false;
        return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&per_page=12&client_id=${accessKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
        searchResults.innerHTML = ""; // Clear results for new search
    }

    results.forEach((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Unsplash image";

        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description || "View Image";

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResults.appendChild(imageWrapper);
    });

    page++;
    loading = false;
}

// Handle search form submit
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

// Infinite scroll listener
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading
    ) {
        searchImages();
    }
});
