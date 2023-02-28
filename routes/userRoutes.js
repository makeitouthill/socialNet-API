const router = require('express').Router();
const {User, Thought} = require('../models');

//GET all users
router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        .populate('thoughts')
        .populate('friends');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get a single user
router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        .populate('thoughts')
        .populate('friends');

        if(!user){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Post a new user
router.post('/', async (req, res) =>{
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!user){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE to remove user by its _id
router.delete('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        // BONUS: Remove a user's associated thoughts when deleted.
        await Thought.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        
        res.json({message: 'User and associated thoughts deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// POST to add a new friend to a user's friend list
router.post('/friends', async (req, res) => {
    const { userId, friendId } = req.body;
    try{
        const user = await User.findByIdAndUpdate(
            userId,
            {$addToSet: { friends: friendId }},
            {new: true, runValidators: true}
        );
        if (!user) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(user); 
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
      const {userId, friendId} = req.params;
      const updatedUser = await User.findOneAndUpdate(
            {_id: userId},
            {$pull: {friends: friendId }},
            {new: true}
        );
        if (!updatedUser) {
            return res.status(404).json({message: 'No user found with this id'});
        }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

module.exports = router;