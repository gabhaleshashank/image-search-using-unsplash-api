from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import unittest

class UnsplashImageSearchTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("D:/Lab/LPIV/MiniProject/STQA/image-search-using-unsplash-api/index.html")
        self.driver.maximize_window()

    def test_page_title(self):
        """Verify title of the page"""
        self.assertIn("Image Search", self.driver.title)

    def test_search_valid_keyword(self):
        """Search for a valid keyword and check results"""
        driver = self.driver
        search_box = driver.find_element(By.ID, "search-input")
        search_box.send_keys("nature")
        search_box.send_keys(Keys.ENTER)

        time.sleep(3)
        images = driver.find_elements(By.TAG_NAME, "img")
        self.assertTrue(len(images) > 0, "No images found for valid search")

    def test_search_empty(self):
        """Check behavior when search input is empty"""
        driver = self.driver
        search_box = driver.find_element(By.ID, "search-input")
        search_box.clear()
        search_box.send_keys(Keys.ENTER)
        time.sleep(1)
        alert = driver.switch_to.alert
        self.assertIn("Please enter", alert.text)
        alert.accept()

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()