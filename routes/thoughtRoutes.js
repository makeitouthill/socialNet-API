const router = require('express').Router();
const {User, Thought} = require('../models');

// GET to get all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        if (!thoughts || thoughts.length === 0) {
            console.log('No thoughts found');
            res.status(404).json({ message: 'No thoughts found' });
            return;
        }
        res.json(thoughts);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET to get a single thought by its _id
router.get('/thoughts/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
    try {
        const {thoughtText, username, userId} = req.body;
        const thought = await Thought.create({thoughtText, username, userId});
        await User.findByIdAndUpdate(
            userId,
                {$push: {thoughts: thought._id}},
                {new: true}
            );
        res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

// PUT to update a thought by its _id
router.put('/thoughts/:thoughtId', async (req, res) => {
    try {
      const {thoughtText} = req.body;
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
            {thoughtText},
            {new: true}
        );
        if (!updatedThought) {
            res.status(404).json({message: 'No thought found with this id'});
            return;
        }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

// DELETE to remove a thought by its _id
router.delete('/thoughts/:thoughtId', async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!deletedThought) {
        return res.status(404).json({message: 'No thought found with this id'});
      }
        await User.findOneAndUpdate(
            {_id: deletedThought.userId},
            {$pull: {thoughts: deletedThought._id}}
        );
      res.json(deletedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
    const {thoughtId} = req.params;
    const {reactionBody, username} = req.body;
    try {
        const updatedThought = await Thought.findOneAndUpdate(
            {_id: thoughtId},
            {$push: {reactions: {reactionBody, username}}},
            {new: true, runValidators: true}
        );

        if (!updatedThought) {
            return res.status(404).json({message: 'No thought found with this id'});
        }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const {thoughtId, reactionId} = req.params;
  
    try {
        const updatedThought = await Thought.findOneAndUpdate(
            {_id: thoughtId},
            {$pull: {reactions: {reactionId}}},
            {new: true}
        );
        if (!updatedThought) {
            return res.status(404).json({message: 'No thought found with this id'});
        }
  
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

module.exports = router;