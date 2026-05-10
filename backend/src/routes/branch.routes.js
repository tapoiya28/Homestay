const express = require('express');
const router = express.Router();
const branchDAO = require('../dao/BranchDAO');

// GET /branch - list all branches (no pagination limit)
router.get('/', async (req, res, next) => {
    try {
        const result = await branchDAO.findAll({ limit: 100 });
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});

// GET /branch/:id - get one branch
router.get('/:id', async (req, res, next) => {
    try {
        const data = await branchDAO.findById(req.params.id);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});

module.exports = router;
