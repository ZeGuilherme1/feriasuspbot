import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { createRestAPIClient} from 'masto';
import cron from 'node-cron';
import express from 'express';

dotenv.config();


const agent = new BskyAgent({
  service: 'https://bsky.social',
});

const masto = createRestAPIClient({
  url: process.env.URL!,
  accessToken: process.env.TOKEN!
});

function getDiasRestantes(): number { 
  const hoje = new Date();
  const dataAlvo = new Date('2024-12-12');
  const diffTime = dataAlvo.getTime() - hoje.getTime()
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
      const status = await masto.v1.statuses.create({
        status: `Faltam ${diasRestantes} dias para as férias da USP`,
      });
      console.log("Post feito no mastodon! ", status.url);
      console.log(`Postado: Faltam ${diasRestantes} dias para as férias da USP!`);
    } else {
      console.log("As férias começaram?!");
    }
  } catch (error) {
    console.error("Erro ao tentar postar a contagem de dias:", error);
  }
}

cron.schedule('0 12 * * *', diasCounter,{
  timezone: 'America/Sao_Paulo'
});

console.log("Bot iniciado. Postando a cada 24 horas!");

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
