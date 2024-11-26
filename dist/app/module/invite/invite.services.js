"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteService = void 0;
const auth_utils_1 = require("../auth/auth.utils");
const config_1 = __importDefault(require("../../config"));
const getInvitationLink = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email, role } = user;
    // generate token 
    const token = (0, auth_utils_1.createToken)({ userId, email, role }, config_1.default.jwt_access_secret, "365d");
    const link = `${config_1.default.front_end_base_url}/register?token=${token}`;
    return link;
});
exports.inviteService = {
    getInvitationLink,
};
