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
mongo
> use prod
db.createUser({
    user: "username", 
    pwd: "password", 
    roles: [{role: "readWrite", db: "prod"}, 
]})
install node via [2] ---> 
remember to exit out of the shell after installing nvm
substitute two commands to these 
nvm install 12.17.0 
and 
nvm alias default 12.17.0
git clone https://github.com/donnyzanger-developers/back.git
cd back
npm install
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
change DNS records to point to this instance's ip address
run certbot process [3] to get certificate for serving over https
change google oauth to point to the new url https://websitehere
change stripe to point to the new url https://websitehere
exit
```

## Subsequent Deployments
```
screen -x tab

```

## Reboot
```
sudo systemctl start mongod
```

## References
```
[1] https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
[2] https://cloud.google.com/nodejs/docs/setup
```