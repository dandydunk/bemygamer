import mysql.connector
import random
import os
import shutil

PhotoSavePath = "C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\bemygamer\\media\\"

def GenerateName():
    name = ""
    for i in range(random.randint(4, 7)):
        name += chr(random.randint(ord('a'), ord('z')))
    return name


def RandGender():
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="pass@123",
    database="bemygamer"
    )

    mycursor = mydb.cursor()
    mycursor.execute("SELECT id FROM bemygamersite_gender ORDER BY RAND() LIMIT 1")
    
    result = mycursor.fetchone()
    return result[0]

def RandSexualOrientation():
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="pass@123",
    database="bemygamer"
    )

    mycursor = mydb.cursor()
    mycursor.execute("SELECT id FROM bemygamersite_sexualorientation ORDER BY RAND() LIMIT 1")
    
    result = mycursor.fetchone()
    return result[0]

def MemberPhotos(memberId, mycursor, filePath):
    p = PhotoSavePath+str(memberId)+"\\"
    print("p = ",p)
    print("fp ", filePath)
    if not os.path.isdir(p):
        os.mkdir(path=p)

    shutil.copy(filePath, p)
    
    mycursor.execute("INSERT INTO bemygamersite_memberphoto(member_id, path, priority, isEnabled)"+
                    "VALUES(%s, %s, %s, %s)",
                    (memberId, os.path.basename(filePath), 1, 1))
    
def Save():
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="pass@123",
    database="bemygamer"
    )

    mycursor = mydb.cursor()

    pIndex = 0
    files = os.listdir(path="C:\\Users\\macol\\OneDrive\\clients\\photos\\")
    while pIndex < len(files):
        mycursor.execute("INSERT INTO bemygamersite_member (email, password, lastActivity) VALUES (%s, %s, NOW())", 
                        (GenerateName()+"@gmail.com", GenerateName()))

        memberId = mycursor.lastrowid

        mycursor.execute("INSERT INTO bemygamersite_memberprofile (name, member_id, birthDay, birthYear, birthMonth, gender_id, heightFeet, heightInches, sexualOrientation_id) "+
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                        (GenerateName(), memberId, 
                        random.randint(1, 28), random.randint(1970, 1990), random.randint(1, 12),RandGender(),
                        random.randint(4, 6), random.randint(0, 11),
                        RandSexualOrientation())
        )

        MemberPhotos(memberId, mycursor, "C:\\Users\\macol\\OneDrive\\clients\\photos\\"+files[pIndex])
        if pIndex+1 >= len(files):
            break
        MemberPhotos(memberId, mycursor, "C:\\Users\\macol\\OneDrive\\clients\\photos\\"+files[pIndex+1])
        pIndex += 2

    mydb.commit()

Save()