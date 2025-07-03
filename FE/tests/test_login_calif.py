# tests/test_login.py

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementClickInterceptedException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

class TestLogin:
    def setup_method(self):
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument(f"--user-data-dir=/tmp/chrome-user-data-{datetime.now().timestamp()}")
        options.binary_location = "/usr/bin/google-chrome"
        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(1920, 1080)

    def teardown_method(self):
        self.driver.quit()

    def test_login(self):
        self.driver.get("https://grupo9-proyecto.eastus.cloudapp.azure.com/auth/login")
        self.driver.find_element(By.ID, "email").send_keys("test_corredor@test.com")
        self.driver.find_element(By.ID, "password").send_keys("Tester123")
        self.driver.find_element(By.CSS_SELECTOR, ".bg-primary").click()
        time.sleep(10)
        assert "auth/login" not in self.driver.current_url, "Login fallido, seguimos en pantalla de login"

        self.driver.find_element(By.CSS_SELECTOR, ".border-b:nth-child(1) > .p-4:nth-child(6) .inline-flex:nth-child(2)").click()
        time.sleep(5)
        self.driver.find_element(By.CSS_SELECTOR, "a:nth-child(2) > .inline-flex").click()
        time.sleep(15)
        self.driver.find_element(By.CSS_SELECTOR, ".border-input:nth-child(1)").click()
        time.sleep(10)
        self.driver.find_element(By.CSS_SELECTOR, "a > .inline-flex").click()
        time.sleep(5)
        self.driver.find_element(By.CSS_SELECTOR, "a:nth-child(2) > .inline-flex").click()
        time.sleep(5)

        element = self.driver.find_element(By.CSS_SELECTOR, "a:nth-child(2) > .inline-flex")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()

        # Intentar hacer clic hasta 3 veces en "Retirar" si no desaparece
        for attempt in range(3):
            try:
                retirar_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Retirar')]")
                retirar_button.click()

                WebDriverWait(self.driver, 10).until_not(
                    EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Retirar')]"))
                )
                break  # éxito
            except (TimeoutException, ElementClickInterceptedException) as e:
                print(f"⚠️ Intento {attempt+1}: el botón 'Retirar' aún está presente o no se pudo hacer clic.")
                time.sleep(3)
        else:
            assert False, "❌ El botón 'Retirar' sigue visible después de 3 intentos. La desinscripción puede haber fallado."
