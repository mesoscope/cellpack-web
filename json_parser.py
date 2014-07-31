"""
Python Utility File to Convert into Cellpack JSON format

"""
import sys
import json


if __name__ == "__main__":
    print "Parser called on", sys.argv[1]
    with open(sys.argv[1]) as originalFile:
        fileData = json.load(originalFile)
        for key in fileData:
            print key
