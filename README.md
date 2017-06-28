Install instructions
============
ssh into desired server
make sure git is installed
# install docker 
Use the commands below or see [source tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
```
# check docker status
```bash
sudo systemctl status docker
```

# clone the node server repo
make the files accessible w/o super user access
```bash
sudo mkdir /var/www
sudo chmod 777 /var/www
git clone -b terrium_master https://github.com/NeuronSwarm/MultiGame-API.git /var/www/node_server
```

# build the docker image
first more permissions stuff
```bash
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```
```bash
docker build -t nodegameserver .
docker run -i -t -p 49160:3000 -d nodegameserver
```

# check for running image -- you should see one item in the list
```bash
docker ps
```

# check your browser for server dns or ip address on port 49160
You should see an unauthorized response from the server, so its working.

# Go inside the Docker container
get the <container_name> from docker ps
```bash
docker exec -it <container_name> /bin/bash
```