import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import ElementClickInterceptedException, NoSuchElementException
from datetime import datetime


class TestEmpresa:
    def setup_method(self):
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.binary_location = "/usr/bin/google-chrome"
        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(1920, 1080)

    def teardown_method(self, method):
        self.driver.quit()

    def click_with_retry(self, by, selector, retries=5, delay=1):
        for _ in range(retries):
            try:
                element = self.driver.find_element(by, selector)
                element.click()
                return True
            except (ElementClickInterceptedException, NoSuchElementException):
                time.sleep(delay)
        return False

    def test_empresa(self):
        self.driver.get("https://grupo9-proyecto.eastus.cloudapp.azure.com/auth/login")
        self.driver.find_element(By.ID, "email").click()
        self.driver.find_element(By.ID, "email").send_keys("test_empresa@test.com")
        self.driver.find_element(By.ID, "password").send_keys("Tester123")
        self.driver.find_element(By.CSS_SELECTOR, ".bg-primary").click()

        dia_hora = datetime.now().strftime('%Y%m%d%H%M%S')
        time.sleep(10)

        self.driver.find_element(By.CSS_SELECTOR, ".bg-primary").click()
        self.driver.find_element(By.ID, "name").send_keys(f"Run Test {dia_hora}")
        self.driver.find_element(By.ID, "date").send_keys("2025-11-30")
        self.driver.find_element(By.ID, "location").send_keys("Valparaiso")
        self.driver.find_element(By.ID, "organizer").send_keys("USM")

        success = self.click_with_retry(By.CSS_SELECTOR, ".bg-primary:nth-child(1)", retries=5)
        assert success, "No se pudo hacer clic en el botón de creación del evento"

        time.sleep(2)
        self.driver.refresh()
        time.sleep(6)
        page_source = self.driver.page_source
        assert f"Run Test {dia_hora}" in page_source, "El evento no aparece en la página después de crearlo"
