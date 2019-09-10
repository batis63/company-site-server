const express = require('express');
const requestIp = require('request-ip');
const router = express.Router();

const {
    Blog,
    validate,
    validateSections,
    validateLinks,
    validateComments
} = require('../model/blog');
const { User } = require('../model/user');

//#region addBlog
router.post('/addblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const ip = requestIp.getClientIp(req);
        const model = {
            title: req.body.title,
            userName: user.first_name + ' ' + user.last_name,
            userIp: ip
        };
        const { error } = validate(model);
        if (error) return res.status(400).send(error.details[0].message);
        let blog = new Blog(model);
        blog.save()
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(error => {
                console.log(error);
                res.status(400).send('خطا در ذخیره اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion addBlog

//#region editBlog
router.post('/editblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        const ip = requestIp.getClientIp(req);
        const model = {
            title: req.body.title,
            userName: user.first_name + ' ' + user.last_name,
            userIp: ip,
            tags: req.body.tags,
            downloadLink: req.body.downloadLink,
            shortLink: req.body.shortLink,
            isPublished: req.body.isPublished
        };
        const { error } = validate(model);
        if (error) return res.status(400).send(error.details[0].message);
        await Blog.findByIdAndUpdate(req.query.id, model)
            .then(() => {
                res.status(200).send('ویرایش با موفقیت انجام شد');
            })
            .catch(() => {
                res.status(400).send('خطا در ویرایش اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion editBlog

//#region removeBlog
router.post('/removeblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        await Blog.findByIdAndRemove(req.query.id)
            .then(() => {
                res.status(200).send('حذف با موفقیت انجام شد');
            })
            .catch(() => {
                res.status(400).send('خطا در حذف اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion removeBlog

//#region getoneblog
router.get('/getoneblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = await Blog.findById(req.query.id);
        if (!blog) return res.status(400).send('اطلاعات یافت نشد');

        res.status(200).send(blog);
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getOneBlog

//#region getoneSectionblog
router.get('/getonesectionblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = await Blog.findOne({
            _id: req.query.id,
            'sections._id': req.query.sectionid
        });
        if (!blog) return res.status(400).send('اطلاعات یافت نشد');

        res.status(200).send(blog.sections.id(req.query.sectionid));
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getoneSectionblog

//#region getoneLinkBlog
router.get('/getonelinkblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = await Blog.findOne({
            _id: req.query.id,
            'links._id': req.query.linkid
        });
        if (!blog) return res.status(400).send('اطلاعات یافت نشد');

        res.status(200).send(blog.links.id(req.query.linkid));
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getoneLinkBlog

//#region getoneCommentBlog
router.get('/getonecommentblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = await Blog.findOne({
            _id: req.query.id,
            'comments._id': req.query.commentid
        });
        if (!blog) return res.status(400).send('اطلاعات یافت نشد');

        res.status(200).send(blog.comments.id(req.query.commentid));
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getoneCommentBlog

//#region addBlogSection
router.post('/addblogsection', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateSections(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = await Blog.findById(req.query.id);
        blog.sections.push(req.body);
        blog.save()
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send('خطا در ویرایش اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion addBlogSection

//#region addbloglink
router.post('/addbloglink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateLinks(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = await Blog.findById(req.query.id);
        blog.links.push(req.body);
        blog.save()
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(error => {
                return res.status(400).send('خطا در ویرایش اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion addbloglink

//#region addblogcomment
router.post('/addblogcomment', async (req, res) => {
    const { error } = validateComments(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let blog = await Blog.findById(req.query.id);
        blog.comments.push(req.body);
        blog.save()
            .then(() => {
                res.status(200).send('ثبت کامنت با موفقیت انجام شد');
            })
            .catch(error => {
                return res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion addblogcomment

//#region editBlogSection
router.post('/editblogsection', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateSections(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        await Blog.updateOne(
            { _id: req.query.id, 'sections._id': req.query.sectionid },
            {
                $set: {
                    'sections.$.content': req.body.content,
                    'sections.$.imageUrl': req.body.imageUrl,
                    'sections.$.order': req.body.order
                }
            }
        )
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(() => {
                return res.status(400).send('خطا در ویرایش اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion editBlogSection

//#region editBlogComment
router.post('/editblogcomment', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateComments(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        await Blog.updateOne(
            { _id: req.query.id, 'comments._id': req.query.commentid },
            {
                $set: {
                    'comments.$.comment': req.body.comment,
                    'comments.$.email': req.body.email,
                    'comments.$.isPublished': req.body.isPublished,
                    'comments.$.reply': req.body.reply,
                    'comments.$.replyDate': req.body.replyDate
                }
            }
        )
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch((error) => {
                return res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion editBlogComment

//#region editbloglink
router.post('/editbloglink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateLinks(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        await Blog.updateOne(
            { _id: req.query.id, 'links._id': req.query.linkid },
            {
                $set: {
                    'links.$.title': req.body.title,
                    'links.$.url': req.body.url
                }
            }
        )
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(() => {
                return res.status(400).send('خطا در ویرایش اطلاعات');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion editbloglink

//#region removesectionblog
router.post('/removesectionblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = await Blog.findById(req.query.id);
        blog.sections.id(req.query.sectionid).remove();
        blog.save()
            .then(() => {
                res.status(200).send('بخش مطلب با موفقیت حذف شد');
            })
            .catch(() => {
                res.status(400).send('خطا در حذف بخش');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion removesectionblog

//#region removecommentblog
router.post('/removecommentblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = await Blog.findById(req.query.id);
        blog.comments.id(req.query.commentid).remove();
        blog.save()
            .then(() => {
                res.status(200).send('کامنت با موفقیت حذف شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion removecommentblog

//#region removelinkblog
router.post('/removelinkblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = await Blog.findById(req.query.id);
        blog.links.id(req.query.linkid).remove();
        blog.save()
            .then(() => {
                res.status(200).send('لینک مطلب با موفقیت حذف شد');
            })
            .catch(() => {
                res.status(400).send('خطا در حذف بخش');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion removelinkblog

//#region getBlogs
router.get('/getblogs', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blogs = await Blog.find();
        res.status(200).send(blogs);
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});

//#endregion getBlogs

module.exports = router;
