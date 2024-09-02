import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';

dotenv.config();

let diasRestantes = 102 ; 

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

async function diasCounter() {
  try {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });

    if (diasRestantes > 0) {
      diasRestantes--; 
      await agent.post({
        text: `Faltam ${diasRestantes} dias para as férias da USP!`  
      });
      console.log(`Postado: Faltam ${diasRestantes} dias para as férias da USP!`);
    } else {
      console.log("As férias começaram?!");
    }
  } catch (error) {
    console.error("Erro ao tentar postar a contagem de dias:", error, "número de dias: ", diasRestantes);
  }
}


const scheduleExpressionDaily = '0 0 * * *'; 

const job = new CronJob(scheduleExpressionDaily, diasCounter);
diasCounter()
console.log("BOT iniciado. Postando a cada 24 horas...");
job.start();
