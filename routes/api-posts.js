const router = require('express').Router();
// util
const utils = require('../utils.js')
// Models
const User = require('../models/user')
const Club = require('../models/club')
const Post = require('../models/post')

// Attach 'role' in this club to the 'req.user' object
router.param('clubId', User.getRoleFromParam)
router.use(User.getRoleFromQuery)

// GET
router.get('/:clubId/posts/:postId', async (req, res, next) => {
	let {postId} = req.params;
	try {
		let post = await Post.findById(postId).exec()
		if (!post) {
			// return res.status(404).send(`Error finding post with id: ${postId}`);
			return res.sendStatus(404);
		}
		res.json({post})
	}catch(err){next(err)}

});


// GET ALL posts
router.get('/:clubId/posts', async (req, res, next) => {
	let {clubId} = req.params
	// Offset & Limit
	let offset = parseInt(req.query.offset) || 0;
	let limit  = parseInt(req.query.limit)  || 0;
	try {
		// Date range
		let startDate = (req.query.startDate)? new Date(req.query.startDate) : null;
		let endDate   = (req.query.endDate)?   new Date(req.query.endDate)   : null;
		let match = {}
		if (startDate) {
			if (!match.publishDate) {
				match.publishDate = {}
			}
			match.publishDate.$gte = startDate
		}
		if (endDate) {
			if (!match.publishDate) {
				match.publishDate = {}
			}
			match.publishDate.$lte = endDate
		}
		let {posts} = await Club.findById(clubId).select('posts').populate({
			path: 'posts',
			match: match,
			options: { offset, limit },
			populate: { path: 'lastEditBy', select: 'username'}
		}).sort({date: -1}).exec()
		res.json({posts})
	}catch(err){next(err)}
});


// POST
router.post('/:clubId/posts', User.canManage, async (req, res, next) => {
	let {clubId} = req.query

	req.checkBody('title',   "can't be empty").notEmpty()
	req.checkBody('content', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

	let sentAsEmail = (req.body.sentAsEmail == 'true') ? true : false
	try{
		let post = new Post({
			title: req.body.title,
			content: req.body.content,
			lastEditBy: req.user._id,
			lastEditDate: new Date(),
			sentAsEmail: sentAsEmail
		})
		await post.save()
		
		let club = await Club.findById(clubId).populate('members', 'email').exec()
		club.posts.push(post._id)
		await club.save()
		if (sentAsEmail) {
			await sendEmailsToMembers(club, post)
		}
		res.json(post)
		return;
	}
	catch(err){next(err)}

});

async function sendEmailsToMembers(club, post) {
	let recepients = club.members.map(member => member.email)
	let fromName = club.name.replace(/\sclub\s/i, "").trim() + " Club"
	let html = utils.markdownToHTML(post.content)
	console.log("recepients:", recepients)
	let body = {
		"apikey": process.env.EMAIL_API_KEY,
		"from": process.env.EMAIL_FROM,
		"fromName": fromName,
		"to": recepients.join(';'),
		"subject": post.title,
		"bodyHtml": `
			${html}
			<h4><a href="${process.env.DOMAIN}/clubs/${club._id}/posts/${post._id}">Click to read more...</a></h4>
		`,
		"isTransactional": false // True, if email is transactional (non-bulk, non-marketing, non-commercial). Otherwise, false
	}
	if (!utils.sendEmail(body)) {
		throw new Error("Couldn't Send Email")
	}
}


// PUT
router.put('/:clubId/posts/:postId', User.canManage, async (req, res, next) => {
	
	req.checkBody('title',   "can't be empty").notEmpty()
	req.checkBody('content', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

	let postId = req.params.postId
	try {
		let post = await Post.findByIdAndUpdate(postId, {
			title: req.body.title,
			content: req.body.content,
			lastEditBy: req.user._id,
			lastEditDate: new Date(),
			sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
		}).exec()
		res.json({_id: post._id})
	}
	catch(err){next(err)}
});


// DELETE
router.delete('/:clubId/posts/:postId', User.canManage, (req, res, next) => {

	let postId = req.params.postId
	Promise.all([
		Post.findByIdAndRemove(postId),
		Club.findOneAndUpdate({ posts: postId }, {$pull: { posts: postId }})
		// Using Pull [https://docs.mongodb.com/manual/reference/operator/update/pull/]
	]).then(([post, club]) => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

})


module.exports = router;
