import magic
import os

def get_mime_type(file):
    """
    Get MIME by reading the header of the file
    """
    initial_pos = file.tell()
    file.seek(0)
    mime_type = magic.from_buffer(file.read(1024), mime=True)
    file.seek(initial_pos)
    return mime_type


f = open("C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\bemygamer\\static\\images\\background.png")
print(get_mime_type(f))