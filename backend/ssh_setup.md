# SSH Setup Guide for TuneFault Server

## Overview
Enable SSH so you can remotely manage the TuneFault server, run commands, and transfer files.

---

## Windows (Development / Server)

### 1. Install OpenSSH Server
```powershell
# Check if already installed
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Install OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

### 2. Start & Enable the SSH Service
```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

### 3. Allow SSH through Windows Firewall
```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' `
  -Enabled True -Direction Inbound -Protocol TCP `
  -Action Allow -LocalPort 22
```

### 4. Verify the Service is Running
```powershell
Get-Service sshd
```

---

## Linux (Production)

```bash
# Install (Ubuntu/Debian)
sudo apt update && sudo apt install -y openssh-server

# Enable and start
sudo systemctl enable --now ssh

# Allow in UFW firewall
sudo ufw allow ssh
sudo ufw enable
```

---

## Key-Based Authentication (Recommended)

### Generate a key pair (on your LOCAL machine)
```bash
ssh-keygen -t ed25519 -C "tunefault-deploy" -f ~/.ssh/tunefault_key
```

### Copy public key to server
```bash
# Linux
ssh-copy-id -i ~/.ssh/tunefault_key.pub user@SERVER_IP

# Windows (run on server as admin)
# Copy the public key content to: C:\Users\<user>\.ssh\authorized_keys
```

### Disable password auth (Linux — harden after key auth works)
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart ssh
```

---

## Connecting to the Server

```bash
ssh -i ~/.ssh/tunefault_key babul@SERVER_IP
```

---

## Running TuneFault Over SSH

```bash
# Start backend in background (stays alive after SSH disconnect)
cd ~/TuneFault/backend
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Or use screen
screen -S tunefault-backend
uvicorn main:app --host 0.0.0.0 --port 8000
# Detach: Ctrl+A then D
```

---

## Port Reference

| Service | Port | Notes |
|---|---|---|
| SSH | 22 | Remote access |
| FastAPI | 8000 | Backend API |
| Vite dev | 5173 | Frontend dev server |
| MySQL | 3306 | Database (internal only) |
