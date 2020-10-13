import urllib.request
import os
import json
import uuid 
import json
import time

url = "https://www.amazon.com/s?rh=n%3A6427831011%2Cp_72%3A4-&pf_rd_i=6427831011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=a562b929-b4ea-4717-818a-4e4c6d092e2e&pf_rd_r=GW3KMBT2S0D2MJ00BS7H&pf_rd_s=merchandised-search-1&pf_rd_t=101&ref=s9_acsd_otopr_hd_bw_b710WTj_c2_x_c2cl"

url2 = "https://www.amazon.com/s?i=videogames&rh=n%3A6427831011%2Cp_72%3A1248885011&page=2&pf_rd_i=6427831011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=a562b929-b4ea-4717-818a-4e4c6d092e2e&pf_rd_r=GW3KMBT2S0D2MJ00BS7H&pf_rd_s=merchandised-search-1&pf_rd_t=101&qid=1601989136&ref=sr_pg_2"

url3 = "https://www.amazon.com/s?i=videogames&rh=n%3A6427831011%2Cp_72%3A1248885011&page={pageNum}&pf_rd_i=6427831011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=a562b929-b4ea-4717-818a-4e4c6d092e2e&pf_rd_r=GW3KMBT2S0D2MJ00BS7H&pf_rd_s=merchandised-search-1&pf_rd_t=101&qid=1601989307&ref=sr_pg_{pageNum}"


PhotoSavePath = "C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\bemygamer\\bemygamerfrontreact\\public\\images\\videogames\\"
DbSavePath = "C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\bemygamer\\bemygamerfrontreact\\public\\ps4.json"
if not os.path.isdir(PhotoSavePath):
    os.mkdir(PhotoSavePath)


gameList = []

def getData(url):
    req = urllib.request.Request(url)
    req.add_header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
    req.add_header("Accept-Language","en-US,en;q=0.9")
    req.add_header("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36")
    resp = urllib.request.urlopen(req)
    return resp.read()

def Ps4GamesAmazon(page):
    print("getting games from amazon...")
    url = url3.format(pageNum=page)
    print("Getting ["+url+"]")
    html = str(getData(url))

    index = 0
    count = 0
    while True:
        needle = "<div class=\"a-section aok-relative s-image-fixed-height\">"
        index = html.find(needle, index)
        if index == -1:
            break

        index = index + len(needle)
        needle = "<img src=\""
        index = html.find(needle, index)
        if index == -1:
            print("corrupted html ["+needle+"] not found")
            return
        
        index = index + len(needle)
        beginExtract = index

        needle = "\""
        index = html.find(needle, index)
        if index == -1:
            print("corrupted html ["+needle+"] not found")
            return

        url = html[beginExtract:(beginExtract+(index-beginExtract))]
        pNameIndex = url.rfind(".")
        if pNameIndex == -1:
            print("corrupted url["+url+"]")
            return

        path = ""
        picName = ""
        while True:
            picName = uuid.uuid4().hex+"."+url[pNameIndex+1:]
            path = PhotoSavePath+picName
            print("checking if path["+path+"] exists...")
            if not os.path.isfile(path):
                break
        print("saving pic from: "+url)
        saveImg(url, path)

        needle = "alt=\""
        index = html.find(needle, index)
        if index == -1:
            print("corrupted html ["+needle+"] not found")
            return

        index = index + len(needle)
        beginExtract = index

        needle = "\""
        index = html.find(needle, index)
        if index == -1:
            print("corrupted html ["+needle+"] not found")
            return

        gameName = html[beginExtract:beginExtract+(index - beginExtract)]
        print("name ["+gameName+"]")
        gameList.append({"name":gameName, "pic":picName})
        count = count + 1
        
    return count


def saveImg(url, path):
    data = getData(url)
    print("Saving pic...")
    pic = open(path, "wb")
    pic.write(data)
    pic.close()

def wj(data):
    with open(DbSavePath, 'w') as outfile:
        json.dump(data, outfile)

num = 1
while True:
    count = Ps4GamesAmazon(num)
    if not count:
        break
    wj(gameList)
    num = num + 1