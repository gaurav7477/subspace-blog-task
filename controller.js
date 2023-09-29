import fetch from 'node-fetch';
import _ from 'lodash';

const catchAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.log(err);
        res.status(500).send({
            message: err.message
        });
    });
}

const blogStatsController = catchAsync(async (req, res) => {
    let data;
    await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    })
        .then(response => response.json())
        .then(response => data = response.blogs)
        .catch(err => console.error(err));

    console.log(data);

    let size = data.length;

    // retriving largest blog title
    let longestTitle = data[0].title;

    let specificTitleBlogs = [];

    for (let i = 1; i < size; i++) {
        if (data[i].title.length > longestTitle.length) {
            longestTitle = data[i].title;
        }

        if (data[i].title.toUpperCase().includes('PRIVACY')) {

            specificTitleBlogs.push(data[i]);
        }
    }

    let titleMap = new Map();

    for (let i = 0; i < size; i++) {
        if (titleMap.has(data[i].title)) {
            titleMap.set(data[i].title, titleMap.get(data[i].title) + 1);
        } else {
            titleMap.set(data[i].title, 1);
        }
    }

    let uniqueTitleBlogs = [];

    for (let i = 0; i < size; i++) {
        if (titleMap.get(data[i].title) === 1) {
            uniqueTitleBlogs.push(data[i]);
        }
    }

    let response =
    {
        "total_blogs": size,
        "largest_blog_title": longestTitle,
        "specific_title_blogs": specificTitleBlogs,
        "unique_title_blogs": uniqueTitleBlogs
    }

    res.send(response);
});
const getBlog = async (title) => {

    console.log(title);


    let data;
    await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    })
        .then(response => response.json())
        .then(response => data = response.blogs)
        .catch(err => console.error(err));

    let size = data.length;

    let searchResult = [];

    for (let i = 0; i < size; i++) {
        if (data[i].title.toUpperCase().includes(title.toUpperCase())) {
            searchResult.push(data[i]);
        }
    }
    return searchResult;
}
const BlogSearchController = catchAsync(async (req, res) => {
    let title = req.query.query;

    // memorization
    let searchResult = _.memoize(getBlog);

    searchResult = await searchResult(title);

    res.send(searchResult);
}
);
export { blogStatsController, BlogSearchController };

