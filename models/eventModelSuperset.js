const mongoose = require('mongoose');

const eventModelSuperset = new mongoose.Schema({
	//event id in other DBs
	hubID: { type: String, required: false },
	compassID: { type: String, required: false },

    // Superset of Study Compass and Event Hub
    //eventID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    typeOfEvent: { type: String, required: true },
    likes: { type: Number, default: 0 },
    creationTimestamp: { type: Date, default: Date.now },
    eventCreator: { type: String, required: true },
    eventHost: { type: String, 
		required: function() {
		  return !this.club;
		} 
	},
    attendees: { type: Array, default:[] },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, required: true },
    classroomID: {type: String},
    image: { type: String },
    tags: {type: [String] },
    club: { type: String, 
		required: function() {
		  return !this.eventHost;
		} 
	},
    rsvpMethod: { type: String },
    externalRef: { type: mongoose.Schema.ObjectId },

    // Edureka specific

    // Attendees
    requestForPresident: { type: Boolean, default: false },
    presidentRequestReason: { type: String },
    featuredSpeakers: { type: Array, default: [] },

    // Event timeline
    timeline: {
		required: false,
		type: {
			title: { type: String},
			time: { type: Date, required: true },
		}
    },

    // Media
    // ?? Press release
    socialMedia: {
        // Social media platform; Instagram, email, Discord, ETC
        platform: { type: String },
        // Social media handle or link
        contact: { type: String },
    },

    // Catering & Vendors
    catering: {
        contact: {
            name: { type: String },
            phone: { type: String },
            email: { type: String },
            address: { type: String },
        },
        menu: [
            {
                item: { type: String }, // e.g., "Grilled Chicken"
                category: { type: String }, // e.g., "Main Course", "Dessert"
                price: { type: Number }, // optional price per item
                dietaryRestrictions: [String] // e.g., ["Vegetarian", "Gluten-Free"]
            }
        ]
    },

    // Budget
    budget: {
        totalBudget: { type: Number}, // total allocated budget
        expenses: [
            {
                category: { type: String }, // e.g., "Catering", "Venue"
                amount: { type: Number },
                description: String
            }
        ]
    },

    // Staffing
    staffing: [
        {
            role: { type: String }, // e.g., "Mentor", "Volunteer"
            personName: { type: String },
            hoursScheduled: { type: Number }, // total hours for the role
        }
    ],

    // Transportation information
    transportation: {
        providers: [
            {
                providerName: { type: String },
                contact: {
                    phone: String,
                    email: String
                },
                vehicles: [
                    {
                        type: { type: String }, // e.g., "Bus", "Van"
                        capacity: { type: Number }, // capacity per vehicle
                        cost: { type: Number }, // cost per vehicle
                        schedule: {
                            pickUpTime: { type: Date },
                            dropOffTime: { type: Date },
                            location: String
                        }
                    }
                ]
            }
        ]
    },

    // Event performance metrics
    metrics: [
        {
            metricName: { type: String }, // e.g., "attendance", "social media views"
            value: { type: Number }, // e.g., number of attendees
            recordedAt: { type: Date, default: Date.now }, // timestamp of the metric recording
            additionalInfo: { type: String }
        }
    ],

    // Other event details
    attendanceIncentives: { type: Array, default: [] },
    executiveBriefing: { type: String},
    postmortemNotes: { type: String},



}, { versionKey: false });

const Event = mongoose.model('Event', eventModelSuperset);

module.exports = Event;
