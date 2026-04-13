import socket

host = "aws-1-eu-north-1.pooler.supabase.com"
port = 6543
try:
    with socket.create_connection((host, port), timeout=5):
        print(f"Port {port} on {host} is open.")
except Exception as e:
    print(f"Could not connect to {host}:{port}: {e}")
