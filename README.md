# back


## Installation
```
sudo apt install ghostscript
sudo apt install graphicsmagick
```

## Initial Deployment
```
create ubuntu 20.04 server
make ip address static
sudo apt update
sudo apt install ghostscript
sudo apt install graphicsmagick
install mongodb via [1]
install node via [2] ---> 
remember to exit out of the shell after installing nvm
substitute two commands to these 
nvm install 12.17.0 
and 
nvm alias default 12.17.0
git clone https://github.com/donnyzanger-developers/back.git
cd back
npm install
sudo apt install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
from [3]
vim .env
STRIPE_PUBLISHABLE_KEY=stripepublishablekeyhere
STRIPE_SECRET_KEY=
dDOMAIN=
STRIPE_WEBHOOK_SECRET=
PRICE=
PAYMENT_METHODS=
DB_HOST=
DB_USER=
DB_PASSWORD=
GOOGLE_CLIENT_ID=
screen
npm start
ctrl a d
sudo apt install apache2
port forwarding to 3000 from 80:
add these two lines to existing 
/etc/apache2/sites-available/000-default.conf
sites-enabled follows sites-available, sites-available seems to be the important one
<virtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        ProxyPass / http://127.0.0.1:3000/ <------------------------------ new
        ProxyPassReverse / http://127.0.0.1:3000/ <----------------------- new 
</virtualHost>
now enable proxy mode also
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_balancer
sudo a2enmod proxy_http
sudo service apache2 restart
change DNS records to point to this instance's ip address in google cloud DNS only
wait for DNS to propagate
run certbot process [4] to get certificate for serving over https
change google oauth to point to the new url https://websitehere
change stripe to point to the new url https://websitehere
screen
enter
npm start
ctrl a d
exit
```

## Subsequent Deployments
```
screen -x tab
ctrl c
git pull
npm start
```

## Reboot
```
sudo systemctl start mongod
```

## References
```
[1] https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
[2] https://cloud.google.com/nodejs/docs/setup
[3] https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix 
[4] https://certbot.eff.org/lets-encrypt/ubuntufocal-apache
```