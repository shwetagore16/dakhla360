import urllib.request
import json
import sys

print("Testing Algorand connection...")

try:
    url = "https://testnet-api.algonode.cloud/v2/status"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read())
        print("✅ Connected to Algorand Testnet!")
        print("Last round:", data.get("last-round"))
except Exception as e:
    print("❌ Connection failed:", str(e))

print("Done.")
sys.stdout.flush()