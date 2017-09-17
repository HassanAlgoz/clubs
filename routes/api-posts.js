const router = require('express').Router();
// util
const utils = require('../utils.js')
// Models
const User = require('../models/user')
const Club = require('../models/club')
const Post = require('../models/post')

// Attach 'role' in this club to the 'req.user' object
router.use(User.getRoleFromQuery)

// GET
router.get('/:postId', (req, res, next) => {

	let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.json({post})
	}).catch(next)

});


// GET ALL
router.get('/', (req, res, next) => {
	
	let clubId = req.query.clubId
	if (clubId) {
		// Get ALL Members of some Club
		Club.findById(clubId)
			.populate('posts')
			.then((club) => {
			res.json({posts: club.posts})
		}).catch(next)
	} else {
		return Promise.all([
			Post.find({})
				.sort({date: -1}),
			Post.count()
		]).then(([posts, count]) => {
			res.json({posts, count})
		}).catch(next)
	}

});


// POST
router.post('/', User.canManage, async (req, res, next) => {
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
router.put('/:postId', User.canManage, async (req, res, next) => {
	
	req.checkBody('title',   "can't be empty").notEmpty()
	req.checkBody('content', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

	let postId = req.params.postId
	console.log(req.body)
	Post.findByIdAndUpdate(postId, {
		title: req.body.title,
		content: req.body.content,
		lastEditBy: req.user._id,
		sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
	}).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/:postId', User.canManage, (req, res, next) => {

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
