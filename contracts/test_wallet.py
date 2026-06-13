import sys
print("Starting...", flush=True)

from algosdk import mnemonic, account
import urllib.request
import json

my_mnemonic = "casino drive amateur shock blanket surface alone struggle device hole artefact inflict armor nurse joke climb web knock network clown romance amateur elder about general"

try:
    private_key = mnemonic.to_private_key(my_mnemonic)
    address = account.address_from_private_key(private_key)
    print("Wallet Address:", address, flush=True)
except Exception as e:
    print("Wallet error:", str(e), flush=True)
    sys.exit(1)

try:
    url = f"https://testnet-api.algonode.cloud/v2/accounts/{address}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read())
        balance = data.get("amount", 0) / 1_000_000
        print(f"Balance: {balance} ALGO", flush=True)
except Exception as e:
    print("Balance check error:", str(e), flush=True)

print("✅ Wallet ready!", flush=True)