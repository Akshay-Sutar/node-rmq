const amqplib = require('amqplib');

let channel;

const onMessageRecieved = (message) => {
    const { content } = message;
    if (!content) {
        console.log('No data recieved');
        return;
    }

    try {
        // Do something with payload
        const payload = JSON.parse(content.toString());
        console.log(payload);

        // Acknowledge the message to dequeue it from the queue
        channel.ack(message);
    } catch (err) {
        console.error(err.message);
        //channel.nack(message);
    }
};

const consume = async () => {
    const exchangeName = 'headers_exchange';
    const queueName = 'match-all-queue';
    const exchangeType = 'headers';
    const routingKey = '';
    const prefetchCount = 1; // limit unacknowledged message to 2
    const options = {
        continent: 'Asia',
        country: 'India',
        state: 'Maharashtra',
        'x-match': 'all'
    };

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
        channel.bindQueue(queueName, exchangeName, routingKey, options); // Set headers in bindQueue in consumer

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