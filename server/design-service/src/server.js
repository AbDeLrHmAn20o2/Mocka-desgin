require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const designRoutes = require("./routes/design-routes");

const app = express();
const PORT = process.env.PORT || 1337;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB Error", error));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'design-service',
    timestamp: new Date().toISOString(),
    port: PORT,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Mocka Design Service',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.use("/api/designs", designRoutes);

async function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎨 DESIGN Service running on port ${PORT}`);
      console.log(`🏥 Health check available at: http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to connected to server", error);
    process.exit(1);
  }
}

startServer();
