
//Server Creation

// import express
 const express =require('express')

 const jwt=require('jsonwebtoken')

 const cors =require('cors')

 const dataService =require('./Services/DataService')

 //create an app using the express

 const app =express()

 app.use(express.json())

app.use(cors({
   origin:'http://localhost:4200'
}))

 //create a port number

 app.listen(3000,()=>{
    console.log('listening on port 3000');
 })

 const appMiddleware=(req,res,next)=>{
   console.log('application middleware ok');

   next()
 }
 app.use(appMiddleware)

 const jwtRouterMiddleware=(req,res,next)=>{
   try{
      console.log('router middleware ok');  
   const token=req.headers['x-access-token']
   // const token=req.body.token
   const data=jwt.verify(token,'superkey2023')
   // console.log(data);
   next()
   }catch{
      res.status(422).json({
         statusCode:422,
         status:false,
         message:'Please login first'
      })
   }
 }
 // Resolving http requests

//  app.get('/',(req,res)=>{
//     res.send('Get http request')
//  })
//  app.post('/',(req,res)=>{
//     res.send('post http request')
//  })

//  app.put('/',(req,res)=>{
//     res.send('put http request')
//  })



//  app.patch('/',(req,res)=>{
//     res.send('patch http request')
//  })

//  app.delete('/',(req,res)=>{
//     res.send('delete http request')
//  })

//API calls
//register request

app.post('/register',(req,res)=>{
   dataService.register(req.body.acno,req.body.username,req.body.password).then(
      result=>{
         res.status(result.statusCode).json(result)
      }
   )
   

   // const result=dataService.register(req.body.acno,req.body.name,req.body.password)
   // res.status(result.statusCode).json(result)
   // if(result){
   //    res.send('register successful')

   // }else{
   //    res.send('register failed')

   // }
   // console.log(req.body);
})

//login request
app.post('/login',(req,res)=>{
   dataService.login(req.body.acno,req.body.password).then(
      result=>{
         res.status(result.statusCode).json(result)
      }
   )
})
//depoist request

app.post('/deposit',jwtRouterMiddleware,(req,res)=>{
   dataService.deposit(req.body.acno,req.body.password,req.body.amount).then(
      result=>{
         res.status(result.statusCode).json(result)

      }
   )
})
//withdraw request

app.post('/withdraw',jwtRouterMiddleware,(req,res)=>{
   dataService.withdraw(req.body.acno,req.body.password,req.body.amount).then(
      result=>{

         res.status(result.statusCode).json(result)
      }
   )
})
//transaction request

app.post('/transaction',jwtRouterMiddleware,(req,res)=>{
   dataService.getTransaction(req.body.acno).then(
      result=>{
         res.status(result.statusCode).json(result)

      }
   )
})

//delete request

app.delete('/deleteAcc/:acno',(req,res)=>{
   dataService.deleteAcc(req.params.acno).then(
      result=>{
         res.status(result.statusCode).json(result)

      }
   )
})