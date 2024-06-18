import { body, check, param, validationResult } from 'express-validator';
import { ErrorHandler } from '../utils/utility.js';

const validateHandler = () => {
    const errors = validationResult(req);

    const errorMessage = errors.array().map((error) => error.msg).join(", ");

    if (errors.isEmpty()) return next()
    else next(new ErrorHandler(errorMessage, 400))
};

const registerValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("bio", "Please Enter bio").notEmpty(),
    body("password", "Please Enter password").notEmpty(),
    check('avatar', "Please Upload Avatar")
];

const loginValidator = () => [
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter password").notEmpty()
];

const newGroupChatValidator = () => [
    body("name", "Please Enter name").notEmpty(),
    body("members").notEmpty().withMessage("Please enter members").isArray({ min: 2, max: 100 }).withMessage("Members must be 2-100")
];

const addMembersValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("members").notEmpty().withMessage("Please enter members").isArray({ min: 1, max: 97 }).withMessage("Members must be 1-97")
];

const removeMemberValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("userId", "Please Enter userId").notEmpty(),
];

const leaveGroupValidator = () => [
    param("id", "Please Enter Chat Id").notEmpty(),
]

const sendAttachmentsValidator = () => [
    body("id",).notEmpty().withMessage("Please Enter Chat Id"),
    check("files", "Please upload Attachments").notEmpty().isArray({ min: 1, max: 5 }).withMessage(" Attachments must be 1-5 ")
];

const chatIdValidator = () => [
    param("id", "Please Enter chatid").notEmpty()
];

const renameValidator = () => [
    param("id", "Please enter your chatId").notEmpty(),
    body("name", "Please enter name").notEmpty()
]

const sendrequestValidator = () => [
    body("userId", "Please enter User Id").notEmpty()
]

const acceptRequestValidator = () => {
    body("requestId", "Please enter request Id").notEmpty(),
        body("accept", "Please add accept").notEmpty().withMessage("Please add request").isBoolean().withMessage("Accept must be boolean")
}

const adminLoginValidator = () => {
    body("secretKey", "Please Enter Secret Key").notEmpty()
}

export { addMembersValidator, chatIdValidator, leaveGroupValidator, loginValidator, newGroupChatValidator, registerValidator, removeMemberValidator, sendAttachmentsValidator, validateHandler, renameValidator, sendrequestValidator, acceptRequestValidator, adminLoginValidator };