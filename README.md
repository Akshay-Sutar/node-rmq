# Exchange types Rabbit MQ using Node.js client

Pre-requisites -
```
# 1st time pull from dockerhub
docker pull rabbitmq

# From next time -
docker run -it --rm --name rmq-container -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```