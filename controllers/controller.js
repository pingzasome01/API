var models = require('../models/model')
const { user, putin } = require('../models/model')
const bcryptjs = require('bcryptjs')
module.exports = {
    readAllData: async (req, res) => {
        const schema = req.params.schema
        if (models[schema] === undefined) {
            return res.status(404).send({ error: { message: 'Not found schema' } })
        }
        console.log(models[schema]);
        const result = await models[schema].find({})
        res.status(200).json(result)
    },

    readDataById: async (req, res) => {
        const schema = req.params.schema
        if (models[schema] === undefined) {
            return res.status(404).send({ error: { message: 'Not found schema' } })
        }
        console.log(models[schema]);
        const result = await models[schema].findOne({ _id: req.params._id })
        res.status(200).json(result)
    },

    readDataById2: async (req, res) => {
        const schema = req.params.schema
        if (models[schema] === undefined) {
            return res.status(404).send({ error: { message: 'Not found schema' } })
        }
        console.log(models[schema]);
        const result = await models[schema].find({ id: req.params.id })
        res.status(200).json({putins:result})
    },

    getUserById: async (req, res) => {
        const { id } = req.params
        const result = await User.findById(id)
        res.status(200).send(result)
    },

    readDataByIdMember: async (req, res) => {
        const id = req.params._id
        // const users = await models.user.find({ id: id })
        // const putins = await models.putin.find({ template: users[0].template })
        // var result = putins.map(o => Object.assign({}, users[0], o))
        // console.log(users);

        var user = await consumeAPI('user')
        var putin = await consumeAPI('putin')
        var users = []
        var putins = []
        for (var i in user.data) {
            if (user.data[i].id == id) {
                users.push(user.data[i])
            }
        }
        for (var i in putin.data) {
            if (putin.data[i].template == users[0].template) {
                // console.log(i);
                putins.push(putin.data[i])
            }
        }
        // console.log(putins.length);
        var last5elements = putins.slice(Math.max(putins.length - 5, 1))
        // console.log(last5elements);
        result = last5elements.map(o => Object.assign({}, users[0], o));
        // console.log(result);

        res.status(200).json(result)
    },

    readDataByIdMember2: async (req, res) => {
        const id = req.params._id
        // const users = await models.user.find({ id: id })
        // const putins = await models.putin.find({ template: users[0].template })
        // var result = putins.map(o => Object.assign({}, users[0], o))
        // console.log(users);

        var user = await consumeAPI('user')
        var putin = await consumeAPI('putin')
        var users = []
        var putins = []
        for (var i in user.data) {
            if (user.data[i].id == id) {
                users.push(user.data[i])
            }
        }
        for (var i in putin.data) {
            if (putin.data[i].template == users[0].template) {
                // console.log(i);
                putins.push(putin.data[i])
            }
        }
        // console.log(putins.length);
        var last5elements = putins.slice(Math.max(putins.length - 5, 1))
        // console.log(last5elements);
        result = last5elements.map(o => Object.assign({}, users[0], o));
        // console.log(result);

        res.status(200).json({putins:result})
    },

    readUserById: async (req, res) => {
        console.log(req.body);
        const result = req.body.id?await user.find({id: req.body.id}):await user.find({template: req.body.template})
        res.status(200).json(result)
    },

    readPutinByTemplate: async (req, res) => {
        const result = await putin.find({template: req.body.template})
        res.status(200).json(result)
    },

    // createData: async(req, res) => {
    //     const schema = req.params.schema
    //     if (models[schema] === undefined){
    //         return res.status(404).send({error: {message: 'Not found schema'}})
    //     } 
    //     const newData = new models[schema](req.body)
    //     console.log(newData);
    //     newData.save()
    //     res.status(201).json(newData)
    //     // const newData = new models[schema](req.body)
    //     // const result = await newData.save()
    //     //     .then(result => {
    //     //         res.status(201).json(result)
    //     //     })
    //     //     .catch(err => {
    //     //         console.log(err);
    //     //         res.status(500).json({
    //     //             error: err, 
    //     //             statusCode: 500
    //     //         })
    //     //     })
    // },

    createUser: async (req, res) => {
        // console.log("this. ", req.body);
        const users = req.body
        const result = await user.find({ id: users.id })
        console.log(result.length);
        if (result.length == 0) return res.status(201).json({ message: 'Please add a fingerprint to the system.' })
        if (result.length == 1) {
            bcryptjs.hash(req.body.password, 10, async (err, hash) => {
                await user.findOneAndUpdate({ id: users.id }, { ...users, password: hash }, (err, result) => {
                    if (err) {
                        return res.status(409).json({ err })
                    }
                    console.log("is work");
                    return res.status(200).json(result)
                })
            })
        } else {
             res.status(201).json(result)
        }
       


        // bcryptjs.hash(req.body.password, 10, (err, hash) => {
        //     user.create({ ...users, password: hash }, (err, result) => {
        //         if (err) {
        //             return res.status(409).json({ err })
        //         }
        //         res.status(201).json(result)
        //     })
        // })
    },

    userLogin: async (req, res) => {
        console.log(req.body);

        const users = await user.find({ id: req.body.id })
        console.log(users.length);
        if (users.length >= 1) {
            const result = await bcryptjs.compare(req.body.password, users[0].password)
            if (result) {
                // const token = jwt.sign({id: users[0].id, role: users[0].role}, key, {expiresIn: '31d'})
                return res.status(200).json({ message: 'Login success' })
            }
            res.status(409).json({ message: 'Wrong password' })
        } else {
            res.status(402).json({ message: 'Wrong id ' })
        }
    },
}




function consumeAPI(path) {
    var axios = require('axios');

    var config = {
        method: 'get',
        url: 'http://localhost:3100/api/model/' + path,
        headers: {}
    };

    return axios(config)

}