const express = require('express');
const hubs = require('./hubs/hubs-model');
const hubsRouter = require('./hubs/hubs-router');
const welcomeRouter = require('./hubs/hubs-router');

const server = express();
const port = 4000;

server.use(express.json());
server.use('/api/hubs', hubsRouter);

server.put('/api/hubs/:id', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      message: 'Missing hub name'
    });
  }

  hubs
    .update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({
          message: 'The hub could not be found'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub'
      });
    });
});

server.delete('/api/hubs/:id', (req, res) => {
  hubs
    .remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: 'The hub has been nuked'
        });
      } else {
        res.status(404).json({
          message: 'The hub could not be found'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub'
      });
    });
});

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
