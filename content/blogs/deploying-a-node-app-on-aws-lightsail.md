---
layout: layouts/blog.njk
tags:
  - blogPost
permalink: blogs/deploying-a-node-app-on-aws-lightsail.html
title: Deploying a Node App on AWS Lightsail
description: Learn how to deploy a Node.js application on AWS Lightsail — from
  provisioning the instance to configuring Nginx, PM2, and a custom domain with
  HTTPS.
keywords:
  - Node.js
  - AWS Lightsail
  - Deployment
  - Nginx
  - PM2
  - DevOps
  - Cloud Hosting
  - AWS
date: 2026-09-20
dateDisplay: 20th September 2026
articleSection: DevOps
articleTags:
  - Node.js
  - AWS
  - Lightsail
heroImage: https://smallworkshop.co.uk/content/images/size/w1200/2021/12/aws.jpeg
heroAlt: AWS Lightsail dashboard showing a running Node.js instance
excerpt: A step-by-step guide to deploying a Node.js app on AWS Lightsail — from
  provisioning the instance to configuring Nginx, PM2, and HTTPS.
howTo:
  totalTime: ""
faq: []
---
# Deploying a Node App on AWS Lightsail

AWS can feel overwhelming when all you want to do is put a Node.js app on the internet. EC2, VPCs, security groups, load balancers: it's a lot. **AWS Lightsail** strips that away. You get a simple virtual server with a fixed monthly price, a static IP, and a firewall you can configure in a few clicks.

In this guide, you'll deploy a Node.js app to Lightsail, keep it running with **PM2**, put **Nginx** in front of it as a reverse proxy, and secure it with a free **HTTPS certificate**.

## What You'll Need

* An AWS account
* A Node.js app in a Git repository (Express, Fastify, or anything that listens on a port)
* A domain name (optional, but required for HTTPS)
* Basic comfort with the terminal

## Step 1: Create a Lightsail Instance

1. Open the [Lightsail console](https://lightsail.aws.amazon.com/) and click **Create instance**.
2. Choose an AWS Region close to your users.
3. Under **Pick your instance image**, select **Linux/Unix** and then **OS Only → Ubuntu 22.04 LTS**.
4. Pick a plan. The smallest plan works for small apps and side projects; you can upgrade later.
5. Give the instance a name, such as `node-app-server`, and click **Create instance**.

![](https://smallworkshop.co.uk/content/images/size/w1200/2021/12/aws.jpeg)

Wait a minute or two until the status shows **Running**.

## Step 2: Attach a Static IP

By default, a Lightsail instance's public IP changes if you stop and start it. A static IP fixes that.

1. Go to the **Networking** tab and click **Create static IP**.
2. Attach it to your instance and give it a name.
3. Note the IP address. You'll use it for SSH and for your DNS record.

## Step 3: Open the Firewall Ports

In the instance's **Networking** tab, under **IPv4 Firewall**, make sure these rules exist:

| Application | Protocol | Port |
| ----------- | -------- | ---- |
| SSH         | TCP      | 22   |
| HTTP        | TCP      | 80   |
| HTTPS       | TCP      | 443  |

You do **not** need to open your app's internal port (for example 3000). Nginx will handle public traffic and forward it internally.

## Step 4: Connect to the Server

Click the **Connect using SSH** button in the console for a browser-based terminal, or connect from your own machine:

```bash
ssh -i ~/path/to/LightsailDefaultKey.pem ubuntu@YOUR_STATIC_IP
```

You can download the default key from **Account → SSH keys** in the Lightsail console. Remember to restrict its permissions first:

```bash
chmod 400 ~/path/to/LightsailDefaultKey.pem
```

## Step 5: Install Node.js

Update the system, then install Node.js using NodeSource:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Confirm the install:

```bash
node -v
npm -v
```

## Step 6: Deploy Your Code

Install Git and clone your repository:

```bash
sudo apt install -y git
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install --omit=dev
```

Create an environment file for your secrets and configuration:

```bash
nano .env
```

```env
NODE_ENV=production
PORT=3000
```

Test that the app starts:

```bash
node index.js
```

If it runs without errors, stop it with `Ctrl + C`. Next, we'll make sure it stays running.

## Step 7: Keep the App Alive with PM2

If you close your SSH session, a plain `node index.js` process dies with it. **PM2** is a process manager that restarts your app if it crashes and starts it again after a reboot.

```bash
sudo npm install -g pm2
pm2 start index.js --name node-app
pm2 save
pm2 startup
```

The `pm2 startup` command prints a line starting with `sudo env PATH=...`. Copy and run that exact line, then run `pm2 save` once more.

Useful PM2 commands:

```bash
pm2 status          # see running processes
pm2 logs node-app   # view live logs
pm2 restart node-app
```

## Step 8: Set Up Nginx as a Reverse Proxy

Nginx will accept requests on port 80 and pass them to your Node app.

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/node-app
```

Paste in this configuration, replacing the domain with your own (or use your static IP if you don't have a domain yet):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site, test the config, and reload:

```bash
sudo ln -s /etc/nginx/sites-available/node-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Visit `http://YOUR_STATIC_IP` in your browser. You should see your app.

## Step 9: Point Your Domain to the Server

In your DNS provider (or Lightsail's own DNS zone under **Networking → Create DNS zone**), add:

| Type | Name | Value          |
| ---- | ---- | -------------- |
| A    | @    | YOUR_STATIC_IP |
| A    | www  | YOUR_STATIC_IP |

DNS changes can take anywhere from a few minutes to a few hours to propagate.

## Step 10: Enable HTTPS with Let's Encrypt

Once your domain resolves to your server, install Certbot and request a certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits your Nginx config automatically and sets up HTTP-to-HTTPS redirects. Certificates renew on their own, and you can confirm the renewal job works with:

```bash
sudo certbot renew --dry-run
```

## Deploying Updates

When you push new code, deploying is just a few commands:

```bash
cd ~/your-repo
git pull origin main
npm install --omit=dev
pm2 restart node-app
```

## Troubleshooting

**502 Bad Gateway:** Nginx can't reach your app. Check that it's running with `pm2 status` and that the port in your Nginx config matches your app's `PORT`.

**Site not loading at all:** Check the Lightsail firewall rules and confirm Nginx is running with `sudo systemctl status nginx`.

**App crashes on startup:** Read the logs with `pm2 logs node-app`. Missing environment variables are a common cause.

**Certbot fails:** Your domain probably isn't pointing to the static IP yet. Verify with `nslookup yourdomain.com`.

## Wrapping Up

You now have a Node.js app running on Lightsail with a static IP, process management through PM2, Nginx as a reverse proxy, and HTTPS. It's a solid, low-cost setup for side projects, small APIs, and prototypes.

From here, consider adding:

* **Automated backups** with Lightsail snapshots
* **A CI/CD pipeline** (GitHub Actions can SSH in and run the deploy commands)
* **Monitoring** through Lightsail's built-in metrics and alarms
* **A managed database** if your app needs persistent storage

Happy deploying!
