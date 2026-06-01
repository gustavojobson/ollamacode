import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Event Bus & WebSockets
const eventBus = {
  emit: (event: string, payload: any) => {
    console.log(`[Event] ${event}:`, payload);
    wss.clients.forEach(client => {
      if (client.readyState === 1 /* WebSocket.OPEN */) {
        client.send(JSON.stringify({ type: event, payload }));
      }
    });
  }
};

// Internal State: Job Queue & Resource Scheduler
const jobQueue: any[] = [];
let activeContainers = 0;
const MAX_CONTAINERS = 3;

function processQueue() {
  if (jobQueue.length === 0) return;
  if (activeContainers >= MAX_CONTAINERS) {
    eventBus.emit('scheduler.status', { message: 'Max containers reached. Job is queued.' });
    return;
  }

  const job = jobQueue.shift();
  activeContainers++;
  
  eventBus.emit('job.started', { jobId: job.id, project: job.project });
  
  // Simulate orchestration execution time
  setTimeout(async () => {
    eventBus.emit('container.spawned', { message: `Allocated Node Runtime Worker for ${job.project}` });
    
    setTimeout(() => {
      eventBus.emit('agent.executed', { agent: 'Planner (Qwen3)', message: 'Generating infrastructure and architecture code...' });
      
      setTimeout(() => {
        eventBus.emit('worker.status', { message: 'Running npm install && npm run build...' });
        
        setTimeout(() => {
          eventBus.emit('build.success', { jobId: job.id });
          eventBus.emit('container.stopped', { message: `Idling container for ${job.project}` });
          
          activeContainers--;
          eventBus.emit('job.completed', { jobId: job.id });
          processQueue(); // Check for next job
        }, 3000);
      }, 2000);
    }, 2000);
  }, 1000);
}

// API Routes
app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { name } = req.body;
  const project = await prisma.project.create({ data: { name } });
  eventBus.emit('project.created', project);
  res.json(project);
});

// Orchestrator Execution Endpoint
app.post('/api/orchestrator/dispatch', async (req, res) => {
  const { prompt, projectId, project } = req.body;
  
  const jobId = crypto.randomUUID();
  const job = { id: jobId, type: 'build', project: project || 'app-name', status: 'queued', priority: 'high' };
  
  eventBus.emit('job.created', job);
  jobQueue.push(job);
  
  processQueue();

  res.json({ jobId, status: 'queued' });
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket stream');
  ws.send(JSON.stringify({ type: 'connected', payload: { message: 'OllamaCode Orchestrator Stream ready' }}));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
