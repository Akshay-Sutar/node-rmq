const amqplib = require('amqplib');
const { v4: uuid } = require('uuid');

const publish = async () => {
    const exchangeName = 'direct_exchange';
    const exchangeType = 'direct';
    const routingKey = 'blue-key';
    const payload = {
        'Request-Id': uuid(),
        message: 'Direct exchange',
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
            console.error('Failed to publish message!');
        }
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

publish();