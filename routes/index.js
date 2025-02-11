// require('dotenv').config({ path: '../.env' });
//
// const express = require('express');
// const mongoose = require('mongoose');
// const morgan = require('morgan');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('express-rate-limit');
// const Event = require('../models/eventModelSuperset');
//
// const { MongoURI, JWT_SECRET } = process.env;
//
// const app = express();
//
// // Middleware to log incoming requests
// app.use(morgan('dev'));
//
// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//
// // Rate limiting middleware (limits requests to 100 per 15 minutes per IP)
// const generalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests
//     message: "Too many requests from this IP, please try again later"
// });
//
// // Apply rate limit globally (for all routes)
// app.use(generalLimiter);
//
// // Authentication middleware to verify JWT token
// const authenticateUser = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//         return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }
//
//     const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized: Token not found' });
//     }
//
//     // Verify the JWT token
//     jwt.verify(token, JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//         }
//         req.user = decoded; // Attach decoded user info (including roles) to the request object
//         next();
//     });
// };
//
// // Middleware to check if the user has the required role
// const checkUserRole = (requiredRole) => {
//     return (req, res, next) => {
//         const roles = req.user.roles;  // The user's roles should be inside the JWT payload
//
//         if (!roles || !roles.includes(requiredRole)) {
//             return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//         }
//
//         next(); // Proceed to the next middleware or route handler
//     };
// };
//
// // Connect to MongoDB
// async function connectToDB() {
//     if (!MongoURI) {
//         console.error('MongoURI is not defined in the .env file');
//         return;
//     }
//
//     try {
//         await mongoose.connect(MongoURI);
//         console.log('Successfully connected to MongoDB');
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err);
//     }
// }
//
// // Connect to the database
// connectToDB();
//
// // POST route to add a new event
// app.post('/events', authenticateUser, checkUserRole('eventsReadWrite'), async (req, res) => {
//     try {
//         const eventData = req.body; // Event data from request body
//
//         // Create a new Event instance
//         const event = new Event(eventData);
//
//         // Save the event to the database
//         const savedEvent = await event.save();
//
//         // Respond with the saved event
//         res.status(201).json(savedEvent);
//     } catch (err) {
//         console.error('Error adding event:', err);
//         res.status(500).json({ error: 'Failed to add event. Please try again.' });
//     }
// });
//
// // GET route to fetch all events
// app.get('/events', authenticateUser, checkUserRole('eventsReadWrite'), async (req, res) => {
//     try {
//         // Fetch all events from the database
//         const events = await Event.find();
//
//         // Respond with the list of events
//         res.status(200).json(events);
//     } catch (err) {
//         console.error('Error fetching events:', err);
//         res.status(500).json({ error: 'Failed to fetch events. Please try again.' });
//     }
// });
//
// // GET route to fetch a specific event by ID
// app.get('/events/:id', authenticateUser, checkUserRole('eventsReadWrite'), async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         // Find the event by ID
//         const event = await Event.findById(id);
//
//         // If the event is not found, return a 404 error
//         if (!event) {
//             return res.status(404).json({ error: 'Event not found.' });
//         }
//
//         // Respond with the event details
//         res.status(200).json(event);
//     } catch (err) {
//         console.error('Error fetching event:', err);
//         res.status(500).json({ error: 'Failed to fetch event. Please try again.' });
//     }
// });
//
// // PUT route to edit (update) an event by ID
// app.put('/events/:id', authenticateUser, checkUserRole('eventsReadWrite'), async (req, res) => {
//     const { id } = req.params;
//     const updatedData = req.body;  // Data to update from the request body
//
//     try {
//         // Find the event by ID and update with the provided data
//         const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
//
//         // If event not found, return a 404 error
//         if (!updatedEvent) {
//             return res.status(404).json({ error: 'Event not found.' });
//         }
//
//         // Respond with the updated event
//         res.status(200).json(updatedEvent);
//     } catch (err) {
//         console.error('Error updating event:', err);
//         res.status(500).json({ error: 'Failed to update event. Please try again.' });
//     }
// });
//
// // DELETE route to delete an event by ID
// app.delete('/events/:id', authenticateUser, checkUserRole('eventsReadWrite'), async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         // Find and delete the event by ID
//         const deletedEvent = await Event.findByIdAndDelete(id);
//
//         if (!deletedEvent) {
//             return res.status(404).json({ error: 'Event not found.' });
//         }
//
//         // Respond with a success message
//         res.status(200).json({ message: 'Event deleted successfully.' });
//     } catch (err) {
//         console.error('Error deleting event:', err);
//         res.status(500).json({ error: 'Failed to delete event. Please try again.' });
//     }
// });
//
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const router = express.Router();
const Event = require('../models/eventModelSuperset');

/*
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
*/


router.post('/events', async (req, res) => {
    try {
        const event = new Event(req.body);
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }
});

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching events', error_details: err });
    }
});

router.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching event', error_details: err });
    }
});

router.put('/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: 'Error updating event', error_details: err });
    }
});

router.delete('/events/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting event', error_details: err });
    }
});
/*
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

*/
module.exports = router;
