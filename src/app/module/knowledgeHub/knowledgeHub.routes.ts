import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../utils/constant';
import { knowledgeHubController } from './knowledgeHub.controller';
import { Router } from "express";

const router=Router();

// add knowledgeHub

router.post('/add-knowledge-hub-video',auth(USER_ROLE.admin),knowledgeHubController.addKnowledgeHubVideo);
// delete video

router.delete('/delete-video',auth(USER_ROLE.admin), knowledgeHubController.deleteKnowledgeHubVideo);
// gel video 

router.get('/get-video',auth(USER_ROLE.admin), knowledgeHubController.getKnowledgeHubVideo);
// update video

router.patch('/update-video/:id',auth(USER_ROLE.admin), knowledgeHubController.updateKnowledgeHubVideo);


export const KnowledgeHubRouter = router