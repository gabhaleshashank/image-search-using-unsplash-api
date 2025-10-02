// access key = "1PnPHAtv9aRZhKca-tlq2tU-xlA2sI_WE12e0uT-LvQ";
const accessKey = "1PnPHAtv9aRZhKca-tlq2tU-xlA2sI_WE12e0uT-LvQ";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const demoImages = document.querySelector(".demo-images");

let inputData = "";
let page = 1;
let loading = false;
let fetchedImages = [];

// Masonry fix function
function resizeMasonryItem(item) {
    const grid = document.querySelector('.search-results');
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));
    const img = item.querySelector('img');
    if (img) {
        const itemHeight = img.getBoundingClientRect().height;
        const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = `span ${rowSpan}`;
    }
}

async function searchImages(reset = false) {
    if (loading) return;
    loading = true;

    inputData = inputEl.value.trim();
    if (!inputData) {
        alert("Please enter a search term");
        loading = false;
        return;
    }

    if (page === 1 && demoImages) {
        demoImages.style.display = "none";
    }

    if (reset) {
        fetchedImages = [];
        searchResults.innerHTML = "";
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&per_page=12&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        const results = data.results;

        results.forEach((result) => {
            if (!fetchedImages.some(img => img.id === result.id)) {
                fetchedImages.push(result);

                const imageWrapper = document.createElement("div");
                imageWrapper.classList.add("search-result");

                const image = document.createElement("img");
                image.src = result.urls.small;
                image.alt = result.alt_description || "Unsplash image";

                image.onload = () => resizeMasonryItem(imageWrapper);

                const imageLink = document.createElement("a");
                imageLink.href = result.links.html;
                imageLink.target = "_blank";
                imageLink.textContent = result.alt_description || "View Image";

                imageWrapper.appendChild(image);
                imageWrapper.appendChild(imageLink);
                searchResults.appendChild(imageWrapper);
            }
        });

        page++;
    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to fetch images. Check console for details.");
    } finally {
        loading = false;
    }
}

// Handle search form submit
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages(true);
});

// Infinite scroll listener
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading &&
        inputEl.value.trim() !== ""
    ) {
        searchImages();
    }
});
