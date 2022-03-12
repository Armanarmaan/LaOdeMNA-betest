const user = require('../models/user');
const redis = require("redis");
const redisPort = 6379
const client = redis.createClient(redisPort);

//log error to the console if any occurs
client.on("error", (err) => {
  console.log(err);
});

exports.createUser = async (req, res) => {
  
  // Create a new user
  const newUser = new user({
    userName: req.body.userName,
    accountNumber: req.body.accountNumber,
    emailAddress: req.body.emailAddress,
    identityNumber: req.body.identityNumber,
  });

  try{
    const registeredUser = await newUser.save();
    console.log("registered user", registeredUser);
    res.json({
      status: 200,
      data: newUser.userName
    });
  } catch(err){
    console.log(err);
    res.json({
      status: 500,
      message: err
    });
  }
}

exports.getUserByIdentity = async (req, res) => {
  const dataIdentity = req.params.number;
  try {
    client.get(dataIdentity, async (err, userData) => {
      if (err) throw err;

      if (userData) {
        res.status(200).send({
          data: JSON.parse(userData),
          message: "data retrieved from the cache"
        });
      } else {
        const getUser = await user.findOne({identityNumber: dataIdentity});
        client.setex(dataIdentity, 600, JSON.stringify(getUser));
        res.json({
          status: 200,
          data: getUser,
          message: "cache miss"
        })
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting user detail: ${error}`
    })
  }
}

exports.getUserByAccount = async (req, res) => {
  const dataAccount = req.params.number;
  try {
    client.get(dataAccount, async (err, userData) => {
      if (err) throw err;

      if (userData) {
        res.status(200).send({
          data: JSON.parse(userData),
          message: "data retrieved from the cache"
        });
      } else {
        const getUser = await user.findOne({accountNumber: dataAccount});
        client.setex(dataAccount, 600, JSON.stringify(getUser));
        res.json({
          status: 200,
          data: getUser,
          message: "cache miss"
        })
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting user detail: ${error}`
    })
  }
}

exports.updateByIdentity = async (req, res) => {
  try {
    const editedUser = await user.findOneAndUpdate(
      {
        identityNumber: req.params.number,
      },
      {
        $set: {
          userName: req.body.userName,
          accountNumber: req.body.accountNumber,
          emailAddress: req.body.emailAddress,
          identityNumber: req.body.identityNumber,
        }
      }
    );
    res.json({
      status: 200,
      data: editedUser
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting user detail: ${error}`
    })
  }
}

exports.deleteByIdentity = async (req, res) => {
  try {
    const deletedUser = await user.deleteOne({
      identityNumber: req.params.number
    });
    res.json({
      status: 200,
      data: deletedUser
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting user detail: ${error}`
    })
  }
}