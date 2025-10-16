import requests

API_KEY = "AIzaSyBzZiW0njEOfWPxABbyiDtQioMRUUor8tw"
models_list_url = "https://generativelanguage.googleapis.com/v1beta/models"
params = {"key": API_KEY}
resp = requests.get(models_list_url, params=params)
print(resp.json())
