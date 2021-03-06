const user = require('../models/user');
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
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
    redis.get(dataIdentity, async (err, userData) => {
      if (err) throw err;

      if (userData) {
        res.status(200).send({
          data: JSON.parse(userData),
          message: "data retrieved from the cache"
        });
      } else {
        const getUser = await user.findOne({identityNumber: dataIdentity});
        if(getUser !== null){
          redis.setex(dataIdentity, 600, JSON.stringify(getUser));
          res.json({
            status: 200,
            data: getUser,
            message: "cache miss"
          })
        }
        else{
          res.status(500).json({
            code: 500,
            message: "Failed",
            data: `Error while getting user detail: data null`
          })
        }
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
    redis.get(dataAccount, async (err, userData) => {
      if (err) throw err;

      if (userData) {
        res.status(200).send({
          data: JSON.parse(userData),
          message: "data retrieved from the cache"
        });
      } else {
        const getUser = await user.findOne({accountNumber: dataAccount});
        if(getUser !== null){
          redis.setex(dataAccount, 600, JSON.stringify(getUser));
          res.json({
            status: 200,
            data: getUser,
            message: "cache miss"
          })
        }
        else{
          res.status(500).json({
            code: 500,
            message: "Failed",
            data: `Error while getting user detail: data null`
          })
        }
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
    if(editedUser !== null){
      //update to redis
      redis.flushall('ASYNC');
      res.json({
        status: 200,
        data: editedUser
      })
    }
    else{
      res.status(500).json({
        code: 500,
        message: "Failed",
        data: `Error while updating user detail: data null`
      })
    }
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
    if(deletedUser !== null){
      //update to redis
      redis.flushall('ASYNC');
      res.json({
        status: 200,
        data: deletedUser
      })
    }
    else{
      res.status(500).json({
        code: 500,
        message: "Failed",
        data: `Error while deleting user detail: data null`
      })
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Failed",
      data: `Error while getting user detail: ${error}`
    })
  }
}