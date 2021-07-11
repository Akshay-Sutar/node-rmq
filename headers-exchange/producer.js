const amqplib = require('amqplib');
const { v4: uuid } = require('uuid');

function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000 * ms);
	});
}

const publish = async () => {
    const exchangeName = 'headers_exchange';
    const exchangeType = 'headers';
    const routingKey = '';
    const payload = {
        'Request-Id': uuid(),
        message: 'Headers exchange',
        date: Date.now()
    };

    const options = {
        headers: {
            continent: 'Asia',
            country: 'India',
            state: 'Maharashtra'
        }
    };
    
    try {
        // Create connection
        const connection = await amqplib.connect('amqp://localhost:5672');

        // Create channel
        const channel = await connection.createChannel();

        // create if exchange not exists
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        
        // Send message to exchange
        const messagePublished = channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(payload, null, 4)), options); // Set headers in publish()

        if (!messagePublished) {
            console.error('Failed to publish message!');
        }

        await sleep(2);
        console.log('published!');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

publish();