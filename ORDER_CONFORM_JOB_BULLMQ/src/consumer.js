import { Worker } from 'bullmq';
import {connection} from './queue.js';

const emailWorker = new Worker(
    'email',
    async (job) => {
        console.log('Email worker is running and processing jobs...', job.id, job.name, job.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Email job ${job.id} completed successfully`)
    },
    {connection}
)

emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} has been completed`)
});

emailWorker.on('failed', (job, err) => {
    console.error(`Email job ${job.id} has failed with error: ${err.message}`)
});
