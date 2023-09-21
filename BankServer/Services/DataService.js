//import jsonwebtoken

const jwt = require("jsonwebtoken");

//import db.js
const db = require("./db");

// userDetails={
//     1:{accno:1,username:"Taz",password:1,balance:200000,transaction:[]},
//     1001:{accno:1001,username:"vic",password:1001,balance:200000,transaction:[]},
//     1002:{accno:1002,username:"lisa",password:1002,balance:200000,transaction:[]},
//     1003:{accno:1003,username:"gtr",password:1003,balance:200000,transaction:[]}
//    }

const register = (acno, username, password) => {
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        status: false,
        statusCode: 401,
        message: " user already exists ",
      };
    } else {
      const newUser = new db.User({
        acno: acno,
        username: username,
        password: password,
        balance: 20000,
        transaction: [],
      });
      newUser.save(); // to save new data to mongdb
      return {
        status: true,
        statusCode: 200,
        message: "register successful",
      };
    }
  });
  // if(acno in userDetails){
  //   return {
  //     status:false,
  //     statusCode:401,
  //     message:" user already exists "

  //   }
  // }else{
  //  userDetails[acno]={
  //     acno:acno,
  //     username:username,
  //     password:password,
  //     balance:20000,
  //     transaction:[]

  //   }

  //   return  {
  //     status:true,
  //     statusCode:200,
  //     message:"register successful"

  //   }
  // }
};
const login = (acno, password) => {
  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      currentUser = user.username;
      currentBalance = user.balance;
      console.log(user.username);
      currentAcno = acno;
      const token = jwt.sign({ currentAcno: acno }, "superkey2023");
      return {
        status: true,
        statusCode: 200,
        message: "login successful",
        token: token,
        currentAcno: acno,
        currentUser: user.username,
        currentBalance: user.balance,
      };
    } else {
      return {
        status: false,
        statusCode: 401,
        message: " Invalid User details",
      };
    }
  });
  // if(acno in userDetails){
  //     if(password==userDetails[acno].password){
  //       currentUser=userDetails[acno].username
  //       currentAcno=acno
  //       const token= jwt.sign({currentAcno:acno},'superkey2023')
  //       return  {
  //         status:true,
  //         statusCode:200,
  //         message:"login successful",
  //         token:token

  //       }
  //     }else{
  //       return  {
  //         status:false,
  //         statusCode:401,
  //         message:" Invalid Password"

  //       }
  //     }
  // }else{
  //   return  {
  //     status:false,
  //     statusCode:401,
  //     message:" Invalid Account number "

  //   }
  // }
};

const deposit = (acno, password, amt) => {
  var amount = parseInt(amt);
  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      if (password == user.password) {
        user.balance += amount;
        user.transaction.push({
          type: "Credit",
          amount,
        });
        user.save();
        return {
          status: true,
          statusCode: 200,
          message: `Account number: ${acno} credited by Rs ${amount}. And balance is ${user.balance}`,
          currentBalance: user.balance,
        };
      } else {
        return {
          status: false,
          statusCode: 401,
          message: " Invalid Password ",
        };
      }
    } else {
      return {
        status: false,
        statusCode: 401,
        message: " Invalid User details ",
      };
    }
  });

  //   var amount=parseInt(amt)
  //   if(acno in userDetails){
  //     if(password==userDetails[acno].password){
  //       userDetails[acno].balance +=amount
  //       userDetails[acno].transaction.push({
  //         type:'Credit',
  //         amount
  //       })
  //       return {
  //         status:true,
  //         statusCode:200,
  //         message: `Account number: ${acno} credited by Rs ${amount}. And balance is ${userDetails[acno].balance}`

  //       }
  //       }else{
  //         return {
  //           status:false,
  //           statusCode:401,
  //           message:" Invalid Password "

  //         }
  //       }
  //   }else{
  //     return {
  //       status:false,
  //       statusCode:401,
  //       message:" Invalid Account number "

  //     }
  //   }
};

const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt);
  return db.User.findOne({ acno, password }).then((user) => {
    if (user) {
      if (password == user.password) {
        if (user.balance > amount) {
          user.balance -= amount;
          user.transaction.push({
            type: "Debit",
            amount,
          });
          user.save();
          return {
            status: true,
            statusCode: 200,
            message: `Account number: ${acno} debited by Rs${amount}. And balance is ${user.balance}`,
            currentBalance: user.balance,
          };
        }
      } else {
        return {
          status: false,
          statusCode: 401,
          message: " Invalid Password ",
        };
      }
    } else {
      return {
        status: false,
        statusCode: 401,
        message: " Invalid User details ",
      };
    }
  });
  // if(acno in userDetails){
  //   if(password==userDetails[acno].password){
  //     if(userDetails[acno].balance>amount){
  //       userDetails[acno].balance -=amount
  //       userDetails[acno].transaction.push({
  //         type:'Debit',
  //         amount
  //       })
  //       return  {
  //         status:true,
  //         statusCode:200,
  //         message:`Account number: ${acno} debited by Rs${amount}. And balance is ${userDetails[acno].balance}`
  //       }
  //     }
  //     }else{
  //       return {
  //         status:false,
  //         statusCode:401,
  //         message:" Invalid Password "

  //       }
  //     }
  // }else{
  //   return {
  //     status:false,
  //     statusCode:401,
  //     message:" Invalid Account number "

  //   }
  // }
};
const getTransaction = (acno) => {
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction,
      };
    }
  });
};

const deleteAcc = (acno) => {
  return db.User.deleteOne({ acno }).then((user) => {
    if (user) {
      return {
        status: true,
        statusCode: 200,
        message: "user deleted",
      };
    } else {
      return {
        status: false,
        statusCode: 401,
        message: " Invalid User details ",
      };
    }
  });
};

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc,
};
