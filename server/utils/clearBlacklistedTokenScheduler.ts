import cron from 'node-cron';
import { clearBlacklist } from '../controllers/quizController/blacklistedToken';

// Schedule a daily cleanup task
const clearBlacklistedTokenScheduler =   cron.schedule('0 0 * * *', () => {
    clearBlacklist();
});

export default clearBlacklistedTokenScheduler ;