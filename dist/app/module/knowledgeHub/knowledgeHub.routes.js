"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeHubRouter = void 0;
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const knowledgeHub_controller_1 = require("./knowledgeHub.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
// add knowledgeHub
router.post('/add-knowledge-hub-video', (0, auth_1.default)(constant_1.USER_ROLE.admin), knowledgeHub_controller_1.knowledgeHubController.addKnowledgeHubVideo);
// delete video
router.delete('/delete-video', (0, auth_1.default)(constant_1.USER_ROLE.admin), knowledgeHub_controller_1.knowledgeHubController.deleteKnowledgeHubVideo);
// gel video 
router.get('/get-video', (0, auth_1.default)(constant_1.USER_ROLE.admin), knowledgeHub_controller_1.knowledgeHubController.getKnowledgeHubVideo);
// update video
router.patch('/update-video/:id', (0, auth_1.default)(constant_1.USER_ROLE.admin), knowledgeHub_controller_1.knowledgeHubController.updateKnowledgeHubVideo);
exports.KnowledgeHubRouter = router;
