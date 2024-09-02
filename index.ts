import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';

dotenv.config();

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

function getDiasRestantes(): number {
  const hoje = new Date();
  const dataAlvo = new Date('2024-12-12');
  const diffTime = dataAlvo.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function diasCounter() {  
  try {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });

    const diasRestantes = getDiasRestantes();

    if (diasRestantes > 0) {
      await agent.post({
        text: `Faltam ${diasRestantes} dias para as férias da USP!`
      });
      console.log(`Postado: Faltam ${diasRestantes} dias para as férias da USP!`);
    } else {
      console.log("As férias começaram?!");
    }
  } catch (error) {
    console.error("Erro ao tentar postar a contagem de dias:", error);
  }
}

const scheduleExpressionDaily = '0 0 * * *';

const job = new CronJob(scheduleExpressionDaily, diasCounter);
diasCounter();
console.log("BOT iniciado. Postando a cada 24 horas...");
console.log('Username:', process.env.BLUESKY_USERNAME);
console.log('Password:', process.env.BLUESKY_PASSWORD);
job.start();

