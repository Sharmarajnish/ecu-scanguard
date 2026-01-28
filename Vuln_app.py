"""
Vulnerable Python Application - FOR SECURITY SCANNER TESTING ONLY
DO NOT USE IN PRODUCTION

This file contains intentional security vulnerabilities for testing purposes.
"""

import os
import pickle
import sqlite3
import subprocess
from flask import Flask, request, render_template_string

app = Flask(__name__)

# Vulnerability 1: SQL Injection
def get_user_data(username):
    """Vulnerable to SQL injection"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # BAD: String concatenation in SQL query
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)
    return cursor.fetchall()

# Vulnerability 2: Command Injection
def ping_host(hostname):
    """Vulnerable to command injection"""
    # BAD: User input directly in shell command
    result = subprocess.run(f"ping -c 4 {hostname}", shell=True, capture_output=True)
    return result.stdout

# Vulnerability 3: Path Traversal
@app.route('/read_file')
def read_file():
    """Vulnerable to path traversal"""
    filename = request.args.get('file')
    # BAD: No validation of file path
    with open(f"/var/data/{filename}", 'r') as f:
        return f.read()

# Vulnerability 4: Insecure Deserialization
def load_user_session(session_data):
    """Vulnerable to insecure deserialization"""
    # BAD: Unpickling untrusted data
    return pickle.loads(session_data)

# Vulnerability 5: Server-Side Template Injection (SSTI)
@app.route('/greet')
def greet():
    """Vulnerable to SSTI"""
    name = request.args.get('name', 'Guest')
    # BAD: User input directly in template
    template = f"<h1>Hello {name}!</h1>"
    return render_template_string(template)

# Vulnerability 6: Hard-coded Credentials
DATABASE_PASSWORD = "admin123"
API_KEY = "sk_live_1234567890abcdef"
SECRET_TOKEN = "my_secret_token_12345"

# Vulnerability 7: Weak Cryptography
def encrypt_password(password):
    """Vulnerable - uses weak hashing"""
    import hashlib
    # BAD: MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()

# Vulnerability 8: Eval with User Input
def calculate(expression):
    """Vulnerable to code injection"""
    # BAD: eval() with user input
    return eval(expression)

# Vulnerability 9: XML External Entity (XXE)
def parse_xml(xml_string):
    """Vulnerable to XXE attacks"""
    import xml.etree.ElementTree as ET
    # BAD: No protection against XXE
    root = ET.fromstring(xml_string)
    return root

# Vulnerability 10: Insecure Random Number Generation
def generate_token():
    """Vulnerable - uses predictable random"""
    import random
    # BAD: random module is not cryptographically secure
    return random.randint(1000, 9999)

# Vulnerability 11: Debug Mode Enabled
if __name__ == '__main__':
    # BAD: Debug mode in production exposes sensitive info
    app.run(debug=True, host='0.0.0.0')

# Vulnerability 12: No Input Validation
@app.route('/transfer')
def transfer_money():
    """Vulnerable to various attacks due to no validation"""
    amount = request.args.get('amount')
    account = request.args.get('account')
    # BAD: No validation, type checking, or sanitization
    return f"Transferring ${amount} to account {account}"

# Vulnerability 13: Race Condition
balance = 1000

def withdraw(amount):
    """Vulnerable to race condition"""
    global balance
    # BAD: No locking mechanism
    if balance >= amount:
        # Race condition window here
        balance -= amount
        return True
    return False

# Vulnerability 14: Information Disclosure
@app.route('/error')
def trigger_error():
    """Exposes sensitive information in error messages"""
    try:
        result = 1 / 0
    except Exception as e:
        # BAD: Exposing full error details to users
        return f"Error: {str(e)}, Stack: {e.__traceback__}"
