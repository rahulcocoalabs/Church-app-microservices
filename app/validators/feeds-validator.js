const {check, validationResult} = require('express-validator');

exports.validator = (method) => {
    switch (method) {
        case 'createFeed': {
            return [
                check('feedContent', 'Content is required').notEmpty(),
                (req, res, next) => {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(422).json({
                            success: 0,
                            errors: errors.array()
                        })
                    }
                    next()
                }
            ]
        }
    }
}