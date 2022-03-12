const jwt = require('jsonwebtoken');

exports.getToken = (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      message: "Ok",
      data: {
        token: jwt.sign({ _id: "laods" }, process.env.TOKEN_SECRET)
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting product detail: ${'something'}`
    })
  }
}