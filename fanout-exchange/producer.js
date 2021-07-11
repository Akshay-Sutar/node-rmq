const amqplib = require('amqplib');
const { v4: uuid } = require('uuid');

process.on('unhandledRejection', (reason, promise) => {
    console.error('Failed', reason);
})
.on('uncaughtException', (error) => {
    console.error('Failed - ', error);
});

const publish = async () => {
    const exchangeName = 'fanout_exchange';
    const exchangeType = 'fanout';
    const routingKey = '';
    const payload = {
        'Request-Id': uuid(),
        message: 'Fanout exchange',
        date: Date.now()
    };

    try {
        // Create connection
        const connection = await amqplib.connect('amqp://localhost:5672');

        // Create channel
        const channel = await connection.createChannel();

        // create if exchange not exists
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });

        // Send message to exchange
        const messagePublished = channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(payload, null, 4)));
        if (!messagePublished) {
            console.error('Publish failed!');
        }

        
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

publish();