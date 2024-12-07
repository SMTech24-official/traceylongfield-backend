import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import { deleteUnverifiedUsers } from './app/utils/deleteUnverifiedUser';
import { CreateAdmin } from './app/db/seedAdmin';
import server from './app';


async function main() {
  try {
    await mongoose.connect(config.dataBaseUrl as string);

   
     server.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });

  } catch (err) {
    console.log(err);
  }
}

main();
CreateAdmin()
process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});