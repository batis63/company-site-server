const express = require('express');
const router = express.Router();

const { Blog, validate, validateSections } = require('../model/blog');
const { User } = require('../model/user');

//#region addBlog
router.post('/addblog', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        let blog = new Blog({
            title: req.body.title,
            userName: req.body.userName,
            userIp: req.body.userIp
        });
        blog.save().then(() => {
            res.status(200).send('تغییرات با موفقیت انجام شد');
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

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = Blog.findByIdAndUpdate(req.query.id, {
            title: req.body.title,
            userName: req.body.userName,
            userIp: req.body.userIp
        })
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

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let blog = Blog.findByIdAndRemove(req.query.id)
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
        let blog = Blog.findById(req.query.id);
        blog.sections.push(req.body);
        blog.save()
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
//#endregion addBlogSection

//#region editBlodSection  
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
        Blog.update(
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
//#endregion editBlodSection

//#region deleteBlogSection
router.post('/deleteblogsection', async (req, res) => {
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
        let blog = Blog.findById(req.query.id);
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
//#endregion deleteBlogSection

module.exports = router;
