const passport = require("passport");
const AuthMiddleware = require("./AuthMiddleware")
const EventService = require("./../../services/EventService");
const {
    default: mongoose
} = require("mongoose");

const router = require("express").Router();

//create-event POST /createevent
router.post('/createevent', passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isAdmin, async (req, res, next) => {

    try {
        const user_id = req.user._id;
        const event_info = req.body;
        console.log(event_info);
        const event = await EventService.createAnEvent(user_id, event_info);
        res.json({
            event,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }

})

//update-info PUT /:event_id/update
router.put('/:event_id/update', passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const user_id = req.user._id;
        const event_info = req.body;
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const event = await EventService.updateEventInfo(event_id, user_id, event_info);
        res.json({
            event,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }
});

//register-event POST /:event_id/register
router.post("/:event_id/register", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), async (req, res) => {

    try {
        const user_id = req.user._id;
        const register_info = req.body;
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const ticket = await EventService.registerForEvent(user_id, event_id, register_info);
        res.json({
            ticket,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }

})

//edit-registeration PUT /:event_id/editregisteration
router.put("/:event_id/editregisteration", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), async (req, res) => {

    try {
        const user_id = req.user._id;
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const register_info = req.body;
        const ticket = await EventService.updateRegistration(user_id, event_id, register_info);
        res.json({
            ticket,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }

})


//get-registeration-ticket GET /:event_id/getregistration
router.get("/:event_id/getregistration", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const user_id = req.user._id;
        const ticket = await EventService.getRegistrationTicket(event_id, user_id);
        res.json({
            ticket,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
})

// set-event-registration-on PUT /:event_id/enableregistration
router.put("/:event_id/enableregistration", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const user_id = req.user._id;
        const updatedEvent = await EventService.enableRegistration(event_id);
        res.json({
            updatedEvent,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
});
// set-event-registration-off PUT /:event_id/disableregistration
router.put("/:event_id/disableregistration", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const user_id = req.user._id;
        const updatedEvent = await EventService.disableRegistration(event_id);
        res.json({
            updatedEvent,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
});
// set-event-active-on PUT /:event_id/enableeventactive
router.put("/:event_id/enableeventactive", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const user_id = req.user._id;
        const updatedEvent = await EventService.enableEventActive(event_id);
        res.json({
            updatedEvent,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
});
// set-event-active-off PUT /:event_id/disableeventactive
router.put("/:event_id/disableeventactive", passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const user_id = req.user._id;
        const updatedEvent = await EventService.disableEventActive(event_id);
        res.json({
            updatedEvent,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
});

router.get('/all', passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isAdmin, async (req, res) => {
    try {
        const events = await EventService.getAllEvents(0, 50000);
        res.json({
            events,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
})

// get all events 
router.get('getevents/:pge_no', async (req, res) => {
    try {

        const events = await EventService.getAllEvents(Number(req.params.pge_no), 20);
        res.json({
            events,
            success: true
        });


    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        })
    }
})

router.get('/:event_id/registeredusers', passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), AuthMiddleware.isModeratorOfTheEvent, async (req, res) => {
    try {
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        const registeredUsers = await EventService.getRegisteredUsers(event_id);
        res.json({
            registeredUsers,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: `Error: ${error}`
        })
    }
});
router.delete('/:event_id/:user_id/deleteregistration', passport.authenticate("jwt", {
    session: false,
    failWithError: true
}), async (req, res) => {
    try {
        const user_id = new mongoose.mongo.ObjectId(req.params.user_id);
        const event_id = new mongoose.mongo.ObjectId(req.params.event_id);
        await EventService.deleteRegistrationOfUser(event_id, user_id);
        res.json({
            success: true,
            message: 'successfully deleted user\'s registration'
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }
})

//get-event GET /:event_id
router.get('/:event_id', async (req, res) => {
    try {
        const event = await EventService.getAnEvent(new mongoose.mongo.ObjectId(req.params.event_id));
        res.json({
            event: event,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: `Error: ${error}`,
            success: false
        });
    }
})



module.exports = router;