const router = require('express').Router();

// Models
const User = require('../models/user');
const Club = require('../models/club')

// GET
router.get('/posts/:postId', (req, res, next) => {

	let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.json({post})
	}).catch(next)

});


// GET ALL
router.get('/posts', (req, res, next) => {

	return Promise.all([
		Post.find({})
			.sort({date: -1}),
		Post.count()
	]).then(([posts, count]) => {
		res.json({posts, count})
	}).catch(next)

});


// POST
router.post('/posts', User.canManage, (req, res, next) => {

	Promise.all[new Post({
		title: req.body.title,
		content: req.body.content,
		lastEditBy: req.user._id,
		sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
	}).save(),
	Club.findById(clubId)
	]
	.then(([post, club]) => {
		club.posts.push(post._id)
		return club.save()
	}).then(() => {
		res.sendStatus(201) // Created new resource
	})
	.catch(next)

});


// PUT
router.put('/posts/:postId', User.canManage, (req, res, next) => {
	let postId = req.params.postId
	console.log(req.body)
	Post.findByIdAndUpdate(postId, {
		title: req.body.title,
		content: req.body.content,
		lastEditDate: Date.now,
		lastEditBy: req.user._id,
		sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
	}).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/posts/:postId', User.canManage, (req, res, next) => {

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