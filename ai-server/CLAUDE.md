# Project Context

## Environment
- H200 server (IP: <SERVER_IP>) with remote access via MobaXterm
- Browser access from another computer at <CLIENT_IP>
- Always use IP-based URLs, NOT localhost (remote access breaks with localhost)
- sudo commands require MobaXterm terminal (direct input) - Claude cannot run sudo

## Architecture
- AI Server (FastAPI): port 8000 on 0.0.0.0
- Caregiver API (Express): port 5000
- Caregiver App (Expo Web): port 8081

## Important
- Two computers are used for development - use git branches per feature
- Node.js and pnpm are installed on this server
