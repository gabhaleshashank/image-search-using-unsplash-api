# Image Search Using Unsplash API

## 📌 Project Overview
A simple web application that allows users to search, view, and download images using the [Unsplash API](https://unsplash.com/developers).  
Users can enter a keyword and get a responsive grid of images related to their search. Clicking an image opens a modal with download options.

## 🚀 Features
- Search images by keyword
- Fetch images dynamically from Unsplash API
- Responsive grid layout with masonry effect
- Image preview in a modal
- Download images in small, medium, or large sizes directly to device
- Smooth modal open/close animations
- Infinite scrolling for more images
- Browser back/forward support to retain search results

## 🛠️ Technologies Used
- HTML5
- CSS3
- JavaScript (Fetch API, History API)
- Unsplash Developer API

## ⚙️ Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/gabhaleshashank/image-search-using-unsplash-api.git

2. Open the project folder:
   ```bash
   cd image-search-using-unsplash-api

3. Get an Access Key from Unsplash API

4. Open script.js and replace:
    ```js
    const accessKey = "YOUR_ACCESS_KEY";
    //with your own key

5. Open index.html in a browser

## 📷 Usage

1. Enter a keyword (e.g., "mountains", "cars") in the search bar.
2. Click search or press enter.
3. Browse images fetched from Unsplash.
4. Click any image to open the modal window.
5. Click the Small, Medium, or Large buttons to view the image.
6. Right-click on the image to save it.

## 📂 Project Structure
├── background-image.jpg
├── LICENSE
├── index.html
├── style.css
├── script.js
└── README.md

## ⚠️ Notes

- The Unsplash API has a free limit of 50 requests per hour.
- Ensure your API key is kept safe and not exposed in public repositories.
- Downloaded images respect Unsplash API guidelines.

## 📜 License

- This project is licensed under the MIT License.
- Images are provided by Unsplash under their API Guidelines.