var Post = require('../models/post.model');
var User = require('../models/user.model');
var constant = require('../helpers/constants');
var buyorsellType = constant.TYPE_BUYORSELL;
var config = require('../../config/app.config.js');
var buyorsellConfig = config.buyorsell;

exports.create = async (req, res) => {
    var identity = req.identity.data;
    var userId = identity.id;
    var files = req.files;
    var params = req.body;
    var caption = params.caption;
    var rate = params.rate;
    var model = params.model;
    var kilometer = params.kilometer;
    var additionalInfo = params.additionalInfo;
    var images = [];
    if (files.length == 0) {
        return res.status(400).send({
            success: 0,
            message: 'Atleast one image is required'
        })
    } else {
        var len = files.length;
        var i = 0;
        while (i < len) {
            images.push(files[i].filename);
            i++;
        }
    }
    try {
        const newSell = new Post({
            contentType: buyorsellType,
            userId: userId,
            caption: caption,
            images: images,
            rate: rate,
            model: model,
            kilometer: kilometer,
            additionalInfo: additionalInfo,
            status: 1,
            tsCreatedAt: Date.now(),
            tsModifiedAt: null
        });
        var saveNewSell = await newSell.save();
        res.status(200).send({
            success: 1,
            id: saveNewSell._id,
            message: 'New product added successfully'
        })
    } catch (err) {
        res.status(500).send({
            success: 0,
            message: err.message
        })
    }
}

exports.list = async (req, res) => {
    var identity = req.identity.data;
    var userId = identity.id;
    var params = req.query;
    var page = Number(params.page) || 1;
    page = page > 0 ? page : 1;
    var perPage = Number(params.perPage) || buyorsellConfig.resultsPerPage;
    perPage = perPage > 0 ? perPage : buyorsellConfig.resultsPerPage;
    var offset = (page - 1) * perPage;
    var pageParams = {
        skip: offset,
        limit: perPage
    };
    var search = params.keyword || '.*';
    search = search + '.*';
    try {
        var filter = {
            $or: [{
                    caption: {
                        $regex: search,
                        $options: 'i',
                    }
                }, {
                    model: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    rate: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ],
            contentType: buyorsellType,
            status: 1
        }
        var projection = {
            caption: 1,
            images: 1,
            model: 1,
            rate: 1
        };
        var listBuyorSell = await Post.find(filter, projection, pageParams).limit(perPage).sort({
            'tsCreatedAt': -1
        });
        var itemsCount = await Post.countDocuments(filter);
        totalPages = itemsCount / perPage;
        totalPages = Math.ceil(totalPages);
        var hasNextPage = page < totalPages;
        var pagination = {
            page: page,
            perPage: perPage,
            hasNextPage: hasNextPage,
            totalItems: itemsCount,
            totalPages: totalPages
        };
        res.status(200).send({
            success: 1,
            pagination: pagination,
            items: listBuyorSell
        });
    } catch (err) {
        res.status(500).send({
            success: 0,
            message: err.message
        })
    }
}

exports.detail = async (req, res) => {
    var id = req.params.id;
    try {
        var filter = {
            contentType: buyorsellType,
            _id: id,
            status: 1
        };
        var projection = {
            userId: 1,
            caption: 1,
            images: 1,
            rate: 1,
            model: 1,
            kilometer: 1,
            additionalInfo: 1,
        };
        var productDetail = await Post.findOne(filter, projection).populate({
            path: 'userId',
            select: 'address phone'
        });
        res.status(200).send({
            success: 1,
            item: productDetail
        })
    } catch (err) {
        res.status(500).send({
            success: 0,
            message: err.message
        })
    }
}