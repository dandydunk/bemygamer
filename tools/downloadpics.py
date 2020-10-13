from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import urllib.request
import os

def DownloadFile(url):
    response = urllib.request.urlopen(url)
    data = response.read()
    print("data len:", len(data))

    path, dirs, files = next(os.walk("C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\photos\\"))
    file_count = len(files)+1

    f = open('C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\photos\\'+str(file_count)+".png", 'wb')
    f.write(data)
    f.close()

def a():
    listHref = []

    c = webdriver.Chrome()

    for pageIndex in range(3, 7):
        print("page ", pageIndex)
        c.get("https://freepngimg.com/cartoon/page/"+str(pageIndex))

        listLi = WebDriverWait(c, 30).until(EC.presence_of_all_elements_located((By.XPATH, "/html/body/div/div[3]/div/div/div[1]/section/div/ul[1]/li")))
        for li in listLi:
            a = li.find_element_by_tag_name("a")
            href = a.get_attribute("href")
            listHref.append(href)
        
    for href in listHref:
        print("getting the download link: ", href)
        while True:
            try:
                c.get(href)
                break
            except:
                print("retrying ", href)
                pass

        e = WebDriverWait(c, 30).until(EC.presence_of_element_located((By.XPATH, "/html/body/div/div[1]/div/div[2]/div[1]/section/div/div[2]/div[3]/div[1]/a")))
        downloadHref = e.get_attribute("href")
        print("downloading ", downloadHref)
        DownloadFile(downloadHref)

    c.quit()

a()