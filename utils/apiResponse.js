const JsonResponse = async({ res, status, msg, data = null }) => {
    const body = {
        msg: "",
        data: null,
    };

    body.msg = msg;
    if (data) {
        body.data = data;
    }

    let statusCode = status ? status : 200;

    res.status(statusCode).send(body);
    return;
};

module.exports = {
    JsonResponse,
};