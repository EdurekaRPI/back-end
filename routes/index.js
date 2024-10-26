require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User');
const Event = require('./models/Event');
const PlanningTool = require('./models/PlanningTool');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/EventApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
        const { eventId, createdBy } = req.body;
        const planningTool = new PlanningTool({
            event: eventId,
            createdBy
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
        const { adminId } = req.body;
        const planningTool = await PlanningTool.findById(req.params.id);

        if (!planningTool) {
            return res.status(404).json({ error: 'PlanningTool entry not found' });
        }

        // Find the admin user and verify role
        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== 'Admin') {
            return res.status(403).json({ error: 'Only admins can approve events' });
        }

        planningTool.isApproved = true;
        planningTool.approvedBy = adminUser._id;
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
