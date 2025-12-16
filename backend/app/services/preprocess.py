import cv2
import numpy as np

def preprocess_image(bytes_data):
    npimg = np.frombuffer(bytes_data, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.bilateralFilter(img, 9, 75, 75)
    _, img = cv2.threshold(img, 150, 255, cv2.THRESH_BINARY)

    return cv2.imencode('.jpg', img)[1].tobytes()
