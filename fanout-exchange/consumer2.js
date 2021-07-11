const amqplib = require('amqplib');

process.on('unhandledRejection', (reason, promise) => {
    console.error('Failed', reason);
})
.on('uncaughtException', (error) => {
    console.error('Failed - ', error);
});

let channel;

const onMessageRecieved = (message) => {
    const { content } = message;
    if (!content) {
        console.log('No data recieved');
        return;
    }

    // Do something with payload
    const payload = JSON.parse(content.toString());
    console.log(payload);

    // Acknowledge the message to dequeue it from the queue
    channel.ack(message);
};

const consume = async () => {
    const exchangeName = 'fanout_exchange';
    const queueName = 'blue';
    const exchangeType = 'fanout';
    const routingKey = '';
    const prefetchCount = 2; // limit unacknowledged message to 2

    try {
        // Create connection
        const connection = await amqplib.connect('amqp://localhost:5672');

        // Create channel
        channel = await connection.createChannel();

        // create if exchange not exists
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });

        // create queue if not exists
        await channel.assertQueue(queueName);

        // Bind exchange to queue
        channel.bindQueue(queueName, exchangeName, routingKey);

        // Set prefetch count
        channel.prefetch(prefetchCount);

        console.log(`Waiting for items in queue - ${queueName}`);

        // Setting noAck to false, forces to acknowledge manually
        channel.consume(queueName, onMessageRecieved, { noAck: false });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

consume();