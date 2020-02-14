const express = require('express');
const hubs = require('./hubs-model');

const router = express.Router();
// this handles the route of /api/hubs
router.get('/', (req, res) => {
  const opts = {
    sortBy: req.query.sortBy,
    limit: req.query.limit
  };
  hubs
    .find(opts)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hubs'
      });
    });
});

router.get('/:id', (req, res) => {
  hubs
    .findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({
          message: 'Hub not found'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hub'
      });
    });
});

router.post('/api/hubs', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      message: 'Missing hub name'
    });
  }

  hubs
    .add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub'
      });
    });
});

// A route for listing out a hub's message
// What should our endpoint be for the route?
router.get('/:id/messages', (req, res) => {
  // this will return a promise
  hubs
    .findHubMessages(req.params.id)
    .then(messages => {
      // will send res.status(200) by default
      res.json(messages);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Could not get hub messages'
      });
    });
});

// to get a specific message by ID
router.get('/:hubId/messages/:messageId', (req, res) => {
  hubs
    .findHubMessageById(req.params.hubId, req.params.messageId)
    .then(message => {
      if (message) {
        res.json(message);
      } else {
        res.status(404).json({ message: 'Message was not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Could not get hub message'
      });
    });
});

// endpoint for creating a hub message
router.post('/:id/messages', (req, res) => {
  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ message: 'need sender and text values' });
  }

  hubs
    .addHubMessage(req.params.id, req.body)
    .then(newMessage => {
      res.status(201).json(newMessage);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Could not create hub message'
      });
    });
});
module.exports = router;
