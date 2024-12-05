const getExpences = (req,where) => {
    return req.user.getExpences(where)
}


module.exports={
    getExpences
}