import random 
import sys
import math 

def read_file(filename):
    data = []
    with open(filename, 'r') as file:
        for line in file:
            x,y = map(int,line.split())
            data.append((x,y))
            print(data)
            return data