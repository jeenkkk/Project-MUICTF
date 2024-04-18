import json
import re
import time
import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup

url = "https://www.vulnhub.com/"
base_download_url = "https://download.vulnhub.com/"

data_list = []

driver = webdriver.Chrome() # Start Selenium WebDriver

# Extract data from a card
def extract_data(card):
    try:
        card.click()
        #print("Clicked on a card.")
        #print("Extracting...")
        start_time = time.time()
        elapsed_time = 0

        while elapsed_time < 1:
            try:
                item_details = WebDriverWait(driver, 0.1).until(EC.presence_of_element_located((By.CLASS_NAME, 'item-description')))
                if item_details:
                    #print("Details are visible.")
                    break
            except TimeoutException:
                elapsed_time = time.time() - start_time
                #print(f"Time elapsed: {elapsed_time:.2f} seconds. Still waiting for details...")
                continue

        # Parse the HTML using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Extracting info
        item_details = soup.find('div', class_='item-details')

        # Extract author and series
        author_element = soup.find('b', string=re.compile(r'Author', re.IGNORECASE))
        author = author_element.find_next('a').text if author_element else None

        # Remove "~ VulnHub" from author's name
        author = author.replace('~ VulnHub', '').strip() if author else None

        series_element = soup.find('b', string=re.compile(r'Series', re.IGNORECASE))
        series = series_element.find_next('a').text if series_element else None

        # Look for difficulty
        description_element = soup.find('div', id='description')
        difficulty_text = description_element.text if description_element else ""
        description_text = difficulty_text
        difficulty_text = difficulty_text.lower()

        # description part
        remove_text = "Description\nBack to the Top"
        description_text = description_text.replace(remove_text, "").strip()
        print(f"Difficulty Text: {description_text}")

        # Extract difficulty from description
        if 'medium-hard' in difficulty_text:
            difficulty = 'Medium-Hard'
        elif 'easy-medium' in difficulty_text:
            difficulty = 'Easy-Medium'
        elif 'beginner' in difficulty_text:
            difficulty = 'Beginner'
        elif 'easy' in difficulty_text:
            difficulty = 'Easy'
        elif 'medium' in difficulty_text or 'intermediate' in difficulty_text:
            difficulty = 'Medium'
        elif 'hard' in difficulty_text:
            difficulty = 'Hard'
        else:
            difficulty = 'Unknown'

        # Extract size
        download_element = soup.find('div', id='download')
        size_match = re.search(r'\(Size:\s*([^\)]+)\)', download_element.text) if download_element else None
        size = size_match.group(1).strip() if size_match else None

        # Extract download link
        download_link = None
        download_links = soup.find_all('a', href=True)
        for link in download_links:
            if base_download_url in link['href']:
                # Ignore checksum links
                if 'checksum.txt' in link['href']:
                    continue
                download_link = link['href']
                break
            elif '#http' in link['href']:
                download_link = link['href'].split('#')[1]  # Extract the link after the '#'
                break

        # Append extracted data to the list
        data_list.append({
            'Name': driver.title.replace(' ~ VulnHub', ''),  # Name can be extracted from the page title
            'Author': author,
            'Series': series,
            'Size': size,
            'Difficulty': difficulty,
            'Download_Link': download_link,
            'Description': description_text,
        })

        ##print('Extracted Data:')
        ##print(json.dumps(data_list[-1], indent=4))

    except TimeoutException:
        print("Timeout waiting for details to load.")
    except Exception as e:
        print(f"An exception occurred: {str(e)}")

    finally:
        # Back to the main page
        driver.back()
        time.sleep(2)

# Iterate through each page
page_number = 1
while True:
    print(f"Processing page {page_number}.")
    driver.get(f"{url}?page={page_number}")
    wait = WebDriverWait(driver, 5)
    try:
        print("Waiting for cards to load.")
        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'card')))
        print("Cards loaded successfully.")
    except TimeoutException:
        print("No more cards found. Exiting.")
        break

    cards = driver.find_elements(By.CLASS_NAME, 'card')

    for i, card in enumerate(cards, start=1):
        print(f"Processing card {i}.")
        extract_data(card)

    try:
        next_button = driver.find_element(By.CSS_SELECTOR, '.next-page-link')
        next_button.click()
        page_number += 1
    except NoSuchElementException:
        print("No more pages. Exiting.")
        break

    page_number += 1

#print('Final Extracted Data List:')
#print(json.dumps(data_list, indent=4))

json_data = json.dumps(data_list, indent=4)
timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
filename = f'vulnhub_data.json'

# JSON data to a file
with open(filename, 'w') as json_file:
    json_file.write(json_data)

driver.quit() # Close the WebDriver

#print('Data extracted and saved to vulnhub_data.json.')
