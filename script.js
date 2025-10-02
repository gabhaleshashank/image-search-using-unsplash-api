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

// Modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");
const downloadSmall = document.getElementById("download-small");
const downloadRegular = document.getElementById("download-regular");
const downloadFull = document.getElementById("download-full");

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

async function searchImages(reset = false, pushState = true) {
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
        if (pushState) {
            history.pushState({ search: inputData, page: 1, results: [] }, "", `?search=${encodeURIComponent(inputData)}`);
        }
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
                image.dataset.small = result.urls.small;
                image.dataset.regular = result.urls.regular;
                image.dataset.full = result.urls.full;

                image.onload = () => resizeMasonryItem(imageWrapper);

                const imageLink = document.createElement("a");
                imageLink.href = result.links.html;
                imageLink.target = "_blank";
                imageLink.textContent = result.alt_description || "View Image";

                imageWrapper.appendChild(image);
                imageWrapper.appendChild(imageLink);
                searchResults.appendChild(imageWrapper);

                // Image click event -> open modal
                image.addEventListener("click", () => openModal(image));
            }
        });

        page++;
        if (pushState) {
            history.replaceState({ search: inputData, page: page, results: fetchedImages }, "", `?search=${encodeURIComponent(inputData)}`);
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to fetch images. Check console for details.");
    } finally {
        loading = false;
    }
}

// Open modal with smooth transition
function openModal(img) {
    modal.style.display = "block";
    modal.style.opacity = 0;

    // Force reflow for transition
    requestAnimationFrame(() => {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = 1;
    });

    modalImg.src = img.dataset.full;

    // Update download links to open in new tab without affecting history
    [downloadSmall, downloadRegular, downloadFull].forEach((link, index) => {
        const sizes = [img.dataset.small, img.dataset.regular, img.dataset.full];
        link.href = sizes[index];
        link.target = "_blank";  // open in new tab
        link.setAttribute("download", ""); // force download
    });
}

// Close modal smoothly
function closeModal() {
    modal.style.transition = "opacity 0.3s ease";
    modal.style.opacity = 0;
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

closeBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

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

// Handle browser back/forward
window.addEventListener("popstate", (event) => {
    const state = event.state;
    if (state && state.search) {
        inputEl.value = state.search;
        fetchedImages = state.results || [];
        searchResults.innerHTML = "";
        demoImages.style.display = "none";

        // Re-render images
        fetchedImages.forEach(result => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("search-result");

            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.alt_description || "Unsplash image";
            image.dataset.small = result.urls.small;
            image.dataset.regular = result.urls.regular;
            image.dataset.full = result.urls.full;

            image.onload = () => resizeMasonryItem(imageWrapper);

            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.textContent = result.alt_description || "View Image";

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            searchResults.appendChild(imageWrapper);

            image.addEventListener("click", () => openModal(image));
        });
    } else {
        demoImages.style.display = "block";
        searchResults.innerHTML = "";
        fetchedImages = [];
        page = 1;
    }
});
