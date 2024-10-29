require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user');
const Event = require('./models/event');
const PlanningTool = require('./models/planning');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.error('Connection error :(', err));

// Routes

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { userID, password, role } = req.body;
        const user = new User({ userID, password, role });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create a new event
app.post('/events', async (req, res) => {
    try {
        const { title, description, likes, poster, date, location, image, tags, time, club, rsvp } = req.body;
        const event = new Event({
            title,
            description,
            likes,
            poster,
            date,
            location,
            image,
            tags,
            time,
            club,
            rsvp,
            creationTimestamp: new Date()
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create a new planning tool entry linked to an event
app.post('/planningTools', async (req, res) => {
    try {
        const { eventId, createdByUserID } = req.body;

        // Find the user by userID
        const creator = await User.findOne({ userID: createdByUserID });
        if (!creator) {
            return res.status(404).json({ error: 'User not found' });
        }

        const planningTool = new PlanningTool({
            event: eventId,
            createdBy: creator.userID
        });
        await planningTool.save();
        res.status(201).json(planningTool);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Approve an event (Admin only)
app.post('/planningTools/:id/approve', async (req, res) => {
    try {
        const { adminUserID } = req.body;
        const planningTool = await PlanningTool.findById(req.params.id);

        if (!planningTool) {
            return res.status(404).json({ error: 'PlanningTool entry not found' });
        }

        // Find the admin user by userID and verify role
        const adminUser = await User.findOne({ userID: adminUserID });
        if (!adminUser || adminUser.role !== 'Admin') {
            return res.status(403).json({ error: 'Only admins can approve events' });
        }

        planningTool.isApproved = true;
        planningTool.approvedBy = adminUser.userID;
        await planningTool.save();

        res.status(200).json({ message: 'Event approved successfully', planningTool });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
